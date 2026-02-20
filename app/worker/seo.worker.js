// app/worker/seo.worker.js
import "dotenv/config";
import { Worker } from "bullmq";
import Redis from "ioredis";
import prisma from "../db.server.js";
import { unauthenticated } from "../shopify.server.js";
import { reserveIfFreePlan } from "../billing.gating.server.js";
import { initSentry, captureException } from "../utils/sentry.server.js";

const QUEUE_NAME = "seo-jobs";

function getRedisUrl() {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL is not set.");
  return url;
}
const connection = { url: getRedisUrl() };

// --- Shop-level concurrency lock (Redis) ---
// Goal: Only 1 job per shop should be processed at any time.
// This prevents parallel generation/publish jobs within the same store,
// which can cause rate limits, UI confusion, and "stuck" progress.
const redis = new Redis(getRedisUrl(), { maxRetriesPerRequest: null });

const SHOP_LOCK_TTL_MS = Number(process.env.SHOP_LOCK_TTL_MS || 15 * 60_000); // 15 min
const SHOP_LOCK_RETRY_DELAY_MS = Number(process.env.SHOP_LOCK_RETRY_DELAY_MS || 10_000); // 10 sec
const STUCK_JOB_MINUTES = Number(process.env.STUCK_JOB_MINUTES || 10);

function shopLockKey(shop) {
  return `seo:shop-lock:${String(shop || "").trim().toLowerCase()}`;
}

async function acquireShopLock(shop, owner) {
  const key = shopLockKey(shop);
  // SET key value NX PX ttl
  const res = await redis.set(key, owner, "PX", SHOP_LOCK_TTL_MS, "NX");
  return res === "OK";
}

async function refreshShopLock(shop, owner) {
  const key = shopLockKey(shop);
  const current = await redis.get(key);
  if (current !== owner) return false;
  await redis.pexpire(key, SHOP_LOCK_TTL_MS);
  return true;
}

async function releaseShopLock(shop, owner) {
  const key = shopLockKey(shop);
  // Only release if we still own it.
  const lua = `
    if redis.call('get', KEYS[1]) == ARGV[1] then
      return redis.call('del', KEYS[1])
    else
      return 0
    end
  `;
  await redis.eval(lua, 1, key, owner);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function isJobCancelled(jobId) {
  try {
    const j = await prisma.seoJob.findUnique({ where: { id: String(jobId).trim() }, select: { status: true } });
    const s = String(j?.status || "").toLowerCase();
    return s === "cancelled" || s === "canceled";
  } catch {
    return false;
  }
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ----------------------- Language enforcement helpers -----------------------
function sanitizeLanguage(input) {
  const raw = String(input || "").trim().toLowerCase();
  const m = raw.match(/^[a-z]{2}/);
  return m ? m[0] : "tr";
}

function languageName(code) {
  const c = sanitizeLanguage(code);
  if (c === "tr") return "Turkish";
  if (c === "en") return "English";
  if (c === "de") return "German";
  if (c === "fr") return "French";
  if (c === "es") return "Spanish";
  if (c === "it") return "Italian";
  if (c === "nl") return "Dutch";
  if (c === "pt") return "Portuguese";
  if (c === "ar") return "Arabic";
  if (c === "ru") return "Russian";
  return c;
}

function outputLanguageGuard(languageCode) {
  const c = sanitizeLanguage(languageCode);
  const name = languageName(c);
  return (
    `All user-visible text you generate MUST be in ${name}. ` +
    `Do NOT mix languages. If the input content is another language, still output in ${name}. ` +
    `If you cannot comply, return an empty string.`
  );
}

function hasTurkishChars(s) {
  return /[çğıöşüÇĞİÖŞÜ]/.test(String(s || ""));
}

function englishTokenScore(s) {
  const t = String(s || "").toLowerCase();
  const tokens = ["the", "and", "for", "with", "discover", "experience", "perfect", "unmatched", "slopes", "snowboarder"];
  let score = 0;
  for (const k of tokens) if (t.includes(k)) score += 1;
  return score;
}

function turkishTokenScore(s) {
  const t = String(s || "").toLowerCase();
  const tokens = ["ve", "ile", "için", "mükemmel", "performans", "dayanıklı", "kış", "spor", "şık", "keşfedin"];
  let score = 0;
  for (const k of tokens) if (t.includes(k)) score += 1;
  return score;
}

function isLanguageMismatch(lang, ...texts) {
  const l = sanitizeLanguage(lang);
  const combined = texts.filter(Boolean).join(" ");
  if (!combined) return false;

  if (l === "tr") {
    const hasTr = hasTurkishChars(combined);
    const enScore = englishTokenScore(combined);
    const trScore = turkishTokenScore(combined);
    return (!hasTr && enScore >= 3 && trScore === 0);
  }

  if (l === "en") {
    return hasTurkishChars(combined);
  }

  return false;
}

async function rewriteJsonToLanguage({ lang, inputJson, keys, max_tokens = 220, onAttempt, onRetry }) {
  const l = sanitizeLanguage(lang);
  const keyList = keys.join(", ");
  const sys =
    "You are a rewriting assistant. " +
    outputLanguageGuard(l) +
    " Return ONLY valid JSON with keys: " + keyList + ". " +
    "Preserve meaning, keep it natural, no extra keys, no markdown.";

  const user =
    `Target language: ${l}\n` +
    `Rewrite the following JSON values strictly into the target language.\n` +
    `JSON: ${JSON.stringify(inputJson)}`;

  return await openAiChatJson({ sys, user, max_tokens, onAttempt, onRetry });
}


// Promise.race timeout helper (request’i abort etmez ama worker’ın takılmasını engeller)
async function withTimeout(promise, ms, label = "timeout") {
  let t;
  const timeoutPromise = new Promise((_, rej) => {
    t = setTimeout(() => rej(new Error(`${label} after ${ms}ms`)), ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(t);
  }
}

async function parseOpenAiErrorBody(resp) {
  try {
    const ct = resp.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const j = await resp.json();
      const msg = j?.error?.message || j?.message || JSON.stringify(j);
      return String(msg || "");
    }
    return await resp.text();
  } catch {
    return "";
  }
}

function classifyOpenAiFailure({ status, message, name }) {
  // Transient errors worth retrying
  const transientStatus = new Set([408, 409, 429, 500, 502, 503, 504]);
  const isAbort = name === "AbortError" || /aborted/i.test(String(message || ""));
  const isNetwork = /ECONNRESET|ENOTFOUND|EAI_AGAIN|ETIMEDOUT|network/i.test(String(message || ""));
  const isTransient = (status && transientStatus.has(status)) || isAbort || isNetwork;

  // User-facing (short) messages
  if (status === 401 || status === 403) {
    return { isTransient: false, userMessage: "OpenAI API key is invalid or missing." };
  }
  if (status === 429) {
    return { isTransient: true, userMessage: "OpenAI rate limit reached." };
  }
  if (status === 400 && /context length|max.*tokens|too long/i.test(String(message || ""))) {
    return { isTransient: false, userMessage: "Input is too long for the model." };
  }
  if (status && status >= 400 && status < 500) {
    return { isTransient: false, userMessage: `OpenAI request failed (${status}).` };
  }
  if (status && status >= 500) {
    return { isTransient: true, userMessage: `OpenAI server error (${status}).` };
  }
  if (isAbort) return { isTransient: true, userMessage: "OpenAI request timed out." };
  if (isNetwork) return { isTransient: true, userMessage: "Network error while calling OpenAI." };

  return { isTransient, userMessage: "OpenAI request failed." };
}

function computeBackoffMs(attempt, baseMs = 1000) {
  // attempt: 1..N (retry attempt number)
  const exp = Math.min(3, attempt - 1); // cap growth
  const ms = baseMs * Math.pow(2, exp) + attempt * 500; // 1s, ~3s, ~7s
  const jitter = Math.floor(Math.random() * 250);
  return ms + jitter;
}

function computeShopifyThrottleWaitMs(json, { minAvailable = 100, maxWaitMs = 5000 } = {}) {
  try {
    const cost = json?.extensions?.cost;
    const throttle = cost?.throttleStatus;
    const currentlyAvailable = Number(throttle?.currentlyAvailable);
    const restoreRate = Number(throttle?.restoreRate);

    if (!Number.isFinite(currentlyAvailable) || !Number.isFinite(restoreRate) || restoreRate <= 0) {
      return 0;
    }

    // If we're low on available cost, wait just enough to replenish to `minAvailable`.
    if (currentlyAvailable >= minAvailable) return 0;
    const deficit = minAvailable - currentlyAvailable;
    const sec = deficit / restoreRate;
    const ms = Math.ceil(sec * 1000);
    if (!Number.isFinite(ms) || ms <= 0) return 0;
    return Math.min(maxWaitMs, ms);
  } catch {
    return 0;
  }
}


function classifyShopifyFailure({ status, message = "", graphQLErrors = [] }) {
  const msg = String(message || "");
  const gqlMsg = graphQLErrors.map((e) => e?.message).filter(Boolean).join(" | ");

  if (status === 401 || status === 403) {
    return { isTransient: false, userMessage: "Shopify Admin API authentication failed." };
  }
  if (status === 429) {
    return { isTransient: true, userMessage: "Shopify API rate limit reached." };
  }
  if (status && status >= 500) {
    return { isTransient: true, userMessage: `Shopify API server error (${status}).` };
  }

  const combined = `${msg} ${gqlMsg}`.toLowerCase();
  if (/thrott|rate limit|too many requests|429/.test(combined)) {
    return { isTransient: true, userMessage: "Shopify API throttled the request." };
  }

  if (status && status >= 400 && status < 500) {
    return { isTransient: false, userMessage: `Shopify API request failed (${status}).` };
  }

  const isAbort = msg.includes("AbortError") || msg.toLowerCase().includes("timeout");
  const isNetwork = /ECONNRESET|ENOTFOUND|EAI_AGAIN|fetch failed|network/i.test(msg);
  if (isAbort) return { isTransient: true, userMessage: "Shopify API request timed out." };
  if (isNetwork) return { isTransient: true, userMessage: "Network error while calling Shopify." };

  return { isTransient: true, userMessage: "Shopify API request failed." };
}

async function shopifyGraphqlJsonWithRetry({ admin, query, variables, label = "Shopify GraphQL", onAttempt, onRetry, onThrottle }) {
  const maxAttempts = Number(process.env.SHOPIFY_MAX_ATTEMPTS || 3);
  const baseBackoffMs = Number(process.env.SHOPIFY_BACKOFF_BASE_MS || 1000);
  const timeoutMs = Number(process.env.SHOPIFY_TIMEOUT_MS || 30_000);

  let lastErr;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (typeof onAttempt === "function") {
      try { await onAttempt(attempt); } catch {}
    }

    try {
      const resp = await withTimeout(
        admin.graphql(query, { variables }),
        timeoutMs,
        `${label}`
      );

      const status = resp?.status || 0;
      const retryAfter = Number(resp?.headers?.get?.("retry-after") || 0);

      const json = await withTimeout(resp.json(), timeoutMs, `${label} json()`);

      if (status === 429 || status >= 500) {
        const cls = classifyShopifyFailure({ status, message: json?.errors?.[0]?.message || "", graphQLErrors: json?.errors || [] });
        const err = new Error(`${cls.userMessage}${json?.errors?.[0]?.message ? ` Details: ${json.errors[0].message}` : ""}`);
        err.status = status;
        err.isTransient = cls.isTransient;
        err.retryAfter = retryAfter;
        err.json = json;
        throw err;
      }

      if (Array.isArray(json?.errors) && json.errors.length) {
        const cls = classifyShopifyFailure({ status, message: json.errors[0]?.message || "", graphQLErrors: json.errors });
        const err = new Error(`${cls.userMessage}${json.errors[0]?.message ? ` Details: ${json.errors[0].message}` : ""}`);
        err.status = status;
        err.isTransient = cls.isTransient;
        err.retryAfter = retryAfter;
        err.json = json;
        throw err;
      }

      // Throttle-aware pacing (Shopify GraphQL cost-based throttling)
      // Even if status=200, Shopify can indicate we're close to limits via extensions.cost.throttleStatus.
      const throttleWaitMs = computeShopifyThrottleWaitMs(json);
      if (throttleWaitMs > 0) {
        if (typeof onThrottle === "function") {
          try {
            await onThrottle({ waitMs: throttleWaitMs, throttleStatus: json?.extensions?.cost?.throttleStatus, cost: json?.extensions?.cost });
          } catch {}
        }
        await sleep(throttleWaitMs);
      }

      return json;
    } catch (e) {
      lastErr = e;

      const status = Number(e?.status || 0);
      const cls = classifyShopifyFailure({ status, message: e?.message || "" });
      const isTransient = typeof e?.isTransient === "boolean" ? e.isTransient : cls.isTransient;

      if (!isTransient || attempt >= maxAttempts) {
        throw e;
      }

      const backoff = computeBackoffMs(attempt, baseBackoffMs);
      const waitMs = Math.max(backoff, Number(e?.retryAfter || 0) * 1000);

      if (typeof onRetry === "function") {
        try {
          await onRetry({ attemptNumber: attempt, waitMs, reason: cls.userMessage, status });
        } catch {}
      }

      await sleep(waitMs);
    }
  }

  throw lastErr || new Error("Shopify request failed.");
}


/**
 * OpenAI JSON call with retry/backoff + transient/permanent classification.
 * - Retries: 3 attempts (configurable)
 * - Backoff: 1s / 3s / 7s (+ jitter)
 * 
 * Hooks:
 * - onAttempt(attemptNumber)
 * - onRetry({ attemptNumber, waitMs, reason })
 */
async function openAiChatJson({ sys, user, max_tokens = 220, onAttempt, onRetry }) {
  const key = process.env.OPENAI_API_KEY || "";
  if (!key) throw new Error("OPENAI_API_KEY is not set on the server.");

  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const maxAttempts = Number(process.env.OPENAI_MAX_ATTEMPTS || 3);
  const baseBackoffMs = Number(process.env.OPENAI_BACKOFF_BASE_MS || 1000);

  let lastErr;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (typeof onAttempt === "function") {
      try { await onAttempt(attempt); } catch {}
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), Number(process.env.OPENAI_TIMEOUT_MS || 60_000));

      const resp = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.6,
          max_tokens,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: sys },
            { role: "user", content: user },
          ],
        }),
      }).finally(() => clearTimeout(timeout));

      if (!resp.ok) {
        const bodyMsg = await parseOpenAiErrorBody(resp);
        const status = resp.status;
        const retryAfter = Number(resp.headers.get("retry-after") || 0);
        const cls = classifyOpenAiFailure({ status, message: bodyMsg });

        const err = new Error(`${cls.userMessage}${bodyMsg ? ` Details: ${bodyMsg}` : ""}`);
        err.status = status;
        err.isTransient = cls.isTransient;
        err.userMessage = cls.userMessage;
        err.retryAfter = retryAfter;
        throw err;
      }

      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content || "{}";

      try {
        return JSON.parse(content);
      } catch {
        const err = new Error(`OpenAI returned non-JSON content.`);
        err.isTransient = true; // we can retry malformed outputs
        err.userMessage = "OpenAI returned an invalid response.";
        throw err;
      }
    } catch (e) {
      lastErr = e;

      const status = e?.status;
      const cls = classifyOpenAiFailure({ status, message: e?.message, name: e?.name });
      const isTransient = Boolean(e?.isTransient ?? cls.isTransient);

      // Permanent: fail immediately
      if (!isTransient) {
        const msg = String(e?.userMessage || cls.userMessage || e?.message || e);
        throw new Error(msg);
      }

      // No more attempts
      if (attempt >= maxAttempts) {
        const msg = String(e?.userMessage || cls.userMessage || e?.message || e);
        throw new Error(msg);
      }

      // Wait + retry
      const waitMs = e?.retryAfter ? Math.max(e.retryAfter * 1000, 1000) : computeBackoffMs(attempt, baseBackoffMs);
      if (typeof onRetry === "function") {
        try {
          await onRetry({
            attemptNumber: attempt,
            waitMs,
            reason: String(e?.userMessage || cls.userMessage || e?.message || "transient error"),
          });
        } catch {}
      }
      await sleep(waitMs);
    }
  }

  // Should never reach here
  throw lastErr || new Error("OpenAI request failed.");
}

async function generateSeoForProduct({ title, descriptionText, language, settings, onAttempt, onRetry }) {
  const lang = sanitizeLanguage(language);
  const brand = String(settings?.brandName || "").trim();
  const tone = String(settings?.tone || "default").trim();
  const voice = String(settings?.brandVoice || "").trim();
  const targetKeyword = String(settings?.targetKeyword || "").trim();
  const requiredKeywordsRaw = String(settings?.requiredKeywords || "").trim();
  const bannedWordsRaw = String(settings?.bannedWords || "").trim();

  const allowEmojis = Boolean(settings?.allowEmojis);
  const capitalization = String(settings?.capitalization || "titlecase").trim();

  const titleTemplate = String(settings?.titleTemplate || "").trim();
  const descriptionTemplate = String(settings?.descriptionTemplate || "").trim();

  const maxLength = String(settings?.maxLength || "standard");
  const titleMaxChars = Math.max(
    20,
    Number.parseInt(String(settings?.titleMaxChars || ""), 10) ||
      (maxLength === "short" ? 55 : maxLength === "long" ? 70 : 70),
  );
  const descriptionMaxChars = Math.max(
    60,
    Number.parseInt(String(settings?.descriptionMaxChars || ""), 10) ||
      (maxLength === "short" ? 140 : maxLength === "long" ? 160 : 160),
  );

  const requiredKeywords = requiredKeywordsRaw
    ? requiredKeywordsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 10)
    : [];
  const bannedWords = bannedWordsRaw
    ? bannedWordsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 30)
    : [];

  const capInstruction =
    capitalization === "uppercase"
      ? "Use UPPERCASE for the SEO title."
      : capitalization === "sentence"
        ? "Use sentence case for the SEO title."
        : capitalization === "titlecase"
          ? "Use Title Case for the SEO title."
          : "";

  const sys =
    "You are an SEO assistant for Shopify product pages. " +
    outputLanguageGuard(lang) + " " +
    "Return ONLY valid JSON with keys: seoTitle, seoDescription. " +
    `seoTitle max ${titleMaxChars} chars, seoDescription max ${descriptionMaxChars} chars. ` +
    "No markdown, no extra keys.";

  const user = [
    `Language: ${lang}`,
    brand ? `Brand: ${brand}` : "",
    `Tone: ${tone}`,
    voice ? `Brand voice guidelines: ${voice}` : "",
    targetKeyword ? `Target keyword: ${targetKeyword}` : "",
    requiredKeywords.length
      ? `Must include (naturally, if possible): ${requiredKeywords.join(", ")}`
      : "",
    bannedWords.length ? `Avoid these words: ${bannedWords.join(", ")}` : "",
    capInstruction,
    allowEmojis ? "Emojis are allowed." : "Do not use emojis.",
    titleTemplate
      ? `Title template (optional): ${titleTemplate}`
      : "",
    descriptionTemplate
      ? `Description template (optional): ${descriptionTemplate}`
      : "",
    `Product title: ${title}`,
    descriptionText ? `Product description: ${descriptionText}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const out = await openAiChatJson({ sys, user, max_tokens: 220, onAttempt, onRetry });
  let seoTitle = String(out?.seoTitle || "");
  let seoDescription = String(out?.seoDescription || "");

  if (isLanguageMismatch(lang, seoTitle, seoDescription)) {
    const rewritten = await rewriteJsonToLanguage({
      lang,
      inputJson: { seoTitle, seoDescription },
      keys: ["seoTitle", "seoDescription"],
      max_tokens: 220,
      onAttempt,
      onRetry,
    });
    seoTitle = String(rewritten?.seoTitle || seoTitle);
    seoDescription = String(rewritten?.seoDescription || seoDescription);
  }

  return {
    seoTitle: seoTitle.slice(0, titleMaxChars),
    seoDescription: seoDescription.slice(0, descriptionMaxChars),
  };
}

async function generateAltTextForImage({ productTitle, productDescriptionText, currentAltText, language, settings, onAttempt, onRetry }) {
  const lang = sanitizeLanguage(language);
  const brand = String(settings?.brandName || "").trim();
  const tone = String(settings?.tone || "default").trim();
  const voice = String(settings?.brandVoice || "").trim();
  const targetKeyword = String(settings?.targetKeyword || "").trim();
  const requiredKeywordsRaw = String(settings?.requiredKeywords || "").trim();
  const bannedWordsRaw = String(settings?.bannedWords || "").trim();

  const allowEmojis = Boolean(settings?.allowEmojis);
  const maxChars = Math.max(40, Number.parseInt(String(settings?.altTextMaxChars || ""), 10) || 125);

  const requiredKeywords = requiredKeywordsRaw
    ? requiredKeywordsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 10)
    : [];
  const bannedWords = bannedWordsRaw
    ? bannedWordsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 30)
    : [];

  const sys =
    "You write concise, descriptive ALT text for Shopify product images. " +
    outputLanguageGuard(lang) + " " +
    "Return ONLY valid JSON with key: altText. " +
    `altText max ${maxChars} chars. ` +
    "No markdown, no extra keys.";

  const user = [
    `Language: ${lang}`,
    brand ? `Brand: ${brand}` : "",
    `Tone: ${tone}`,
    voice ? `Brand voice guidelines: ${voice}` : "",
    targetKeyword ? `Target keyword (optional, only if natural): ${targetKeyword}` : "",
    requiredKeywords.length
      ? `Must include (naturally, if possible): ${requiredKeywords.join(", ")}`
      : "",
    bannedWords.length ? `Avoid these words: ${bannedWords.join(", ")}` : "",
    allowEmojis ? "Emojis are allowed (but usually avoid in alt text)." : "Do not use emojis.",
    currentAltText ? `Current ALT text: ${currentAltText}` : "",
    `Product title: ${productTitle || ""}`,
    productDescriptionText ? `Product description (plain text): ${productDescriptionText}` : "",
    "Goal: Describe what the image likely shows for accessibility. " +
      "Do not keyword-stuff. Do not repeat brand name unless it helps identification. " +
      "Avoid salesy language. Avoid quotes." ,
  ]
    .filter(Boolean)
    .join("\n");

  const out = await openAiChatJson({ sys, user, max_tokens: 120, onAttempt, onRetry });
  let altText = String(out?.altText || "");

  if (isLanguageMismatch(lang, altText)) {
    const rewritten = await rewriteJsonToLanguage({
      lang,
      inputJson: { altText },
      keys: ["altText"],
      max_tokens: 120,
      onAttempt,
      onRetry,
    });
    altText = String(rewritten?.altText || altText);
  }

  return {
    altText: altText.slice(0, maxChars),
  };
}

async function fetchProduct(admin, id) {
  const query = `#graphql
    query Product($id: ID!) {
      product(id: $id) {
        id
        title
        descriptionHtml
      }
    }
  `;
  const resp = await withTimeout(
    admin.graphql(query, { variables: { id } }),
    30_000,
    "Shopify GraphQL fetchProduct"
  );
  const json = await withTimeout(resp.json(), 30_000, "Shopify GraphQL fetchProduct json()");
  return json?.data?.product || null;
}


async function fetchArticle(admin, id) {
  const query = `#graphql
    query Article($id: ID!) {
      node(id: $id) {
        __typename
        ... on Article {
          id
          title
          body
          titleTag: metafield(namespace: "global", key: "title_tag") { value }
          descriptionTag: metafield(namespace: "global", key: "description_tag") { value }
        }
      }
    }
  `;
  const resp = await withTimeout(
    admin.graphql(query, { variables: { id } }),
    30_000,
    "Shopify GraphQL fetchArticle"
  );
  const json = await withTimeout(resp.json(), 30_000, "Shopify GraphQL fetchArticle json");
  const node = json?.data?.node;
  if (!node || node.__typename !== "Article") return null;
  return node;
}




async function updateArticleSeoMetafields(
  admin,
  articleId,
  seoTitle,
  seoDescription,
  {
    metaTitle = true,
    metaDescription = true,
    onAttempt,
    onRetry,
    onThrottle,
  } = {},
) {
  // Articles don't expose `seo` field like Products; SEO title/description are stored in global metafields.
  const ownerIdCandidates = ownerIdCandidatesForArticle(articleId);
  const mutation = `#graphql
    mutation SetArticleSeoMetafields($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id key namespace value }
        userErrors { field message }
      }
    }
  `;

  // Fetch current live values once (best effort) for backfilling missing counterpart metafields.
  let live = null;
  try {
    live = await fetchArticle(admin, articleId);
  } catch {
    live = null;
  }
  const liveTitle = String(live?.titleTag?.value ?? "").trim();
  const liveDesc = String(live?.descriptionTag?.value ?? "").trim();

  for (const currentOwnerId of ownerIdCandidates) {
    const metafields = [];
    // IMPORTANT: Never overwrite existing SEO fields with an empty string.
    // If the model returns an empty value (or the job doesn't include that field), we omit it.
    const titleVal = String(seoTitle ?? "").trim();
    const descVal = String(seoDescription ?? "").trim();

    const willWriteTitle = Boolean(metaTitle && titleVal);
    const willWriteDesc = Boolean(metaDescription && descVal);

    if (willWriteTitle) {
      metafields.push({
        ownerId: currentOwnerId,
        namespace: "global",
        key: "title_tag",
        type: "single_line_text_field",
        value: titleVal,
      });
    }
    if (willWriteDesc) {
      metafields.push({
        ownerId: currentOwnerId,
        namespace: "global",
        key: "description_tag",
        type: "single_line_text_field",
        value: descVal,
      });
    }

    // Backfill counterpart if it's missing in Shopify and we have a live value.
    if (willWriteTitle && !willWriteDesc && metaDescription) {
      if (!liveDesc) {
        // no-op
      } else {
        metafields.push({
          ownerId: currentOwnerId,
          namespace: "global",
          key: "description_tag",
          type: "single_line_text_field",
          value: liveDesc,
        });
      }
    }
    if (willWriteDesc && !willWriteTitle && metaTitle) {
      if (!liveTitle) {
        // no-op
      } else {
        metafields.push({
          ownerId: currentOwnerId,
          namespace: "global",
          key: "title_tag",
          type: "single_line_text_field",
          value: liveTitle,
        });
      }
    }

    // Nothing to write -> keep existing values.
    if (!metafields.length) return;

  try {
    const json = await shopifyGraphqlJsonWithRetry({
      admin,
      query: mutation,
      variables: { metafields },
      label: `Shopify GraphQL updateArticleSeoMetafields (ownerId=${currentOwnerId})`,
      onAttempt,
      onRetry,
      onThrottle,
    });

    const errs = json?.data?.metafieldsSet?.userErrors || [];
    if (errs.length) {
      const msg = errs.map((e) => e.message).join(" | ");
      // If this is an invalid-id type error, try the next ownerId candidate
      if (/invalid id/i.test(msg)) {
        console.warn(`[blog-meta] metafieldsSet invalid id for ownerId=${currentOwnerId}: ${msg}`);
        continue;
      }
      throw new Error(msg);
    }

    return; // success
  } catch (e) {
    const msg = String(e?.message || e || "");
    if (/invalid id/i.test(msg)) {
      console.warn(`[blog-meta] attempt failed with invalid id for ownerId=${currentOwnerId}: ${msg}`);
      continue;
    }
    throw e;
  }
}

throw new Error(`Invalid id for Article metafields ownerId. Tried: ${ownerIdCandidates.join(", ")}`);

}

async function updateProductSeo(
  admin,
  id,
  seoTitle,
  seoDescription,
  {
    metaTitle = true,
    metaDescription = true,
    onAttempt,
    onRetry,
    onThrottle,
  } = {},
) {
  // IMPORTANT (root-cause fix):
  // Updating ProductInput.seo has been observed to clear the other field in some API versions.
  // To guarantee "title-only" doesn't clear description (and vice-versa), we update the
  // underlying global metafields instead. Shopify Admin's SEO UI is backed by these.
  // - global.title_tag
  // - global.description_tag

  const titleVal = String(seoTitle ?? "").trim();
  const descVal = String(seoDescription ?? "").trim();

  // IMPORTANT:
  // Some shops store SEO in `product.seo` without the backing global metafields.
  // If we set only ONE metafield (e.g., title_tag), Shopify may start reading SEO from metafields
  // and the other field can appear blank if its metafield doesn't exist yet.
  // To prevent that, when doing a title-only/description-only update, we backfill the missing
  // counterpart metafield from the current live value.

  const query = `#graphql
    query ProductSeoForMetafields($id: ID!) {
      product(id: $id) {
        id
        seo { title description }
        titleTag: metafield(namespace: "global", key: "title_tag") { value }
        descriptionTag: metafield(namespace: "global", key: "description_tag") { value }
      }
    }
  `;

  const resp = await withTimeout(
    admin.graphql(query, { variables: { id } }),
    30_000,
    "Shopify GraphQL ProductSeoForMetafields"
  );
  const json = await withTimeout(resp.json(), 30_000, "Shopify GraphQL ProductSeoForMetafields json()");
  const p = json?.data?.product;

  const titleTagVal = String(p?.titleTag?.value ?? "").trim();
  const descTagVal = String(p?.descriptionTag?.value ?? "").trim();
  const seoTitleVal = String(p?.seo?.title ?? "").trim();
  const seoDescVal = String(p?.seo?.description ?? "").trim();

  // Prefer the global metafield value if it is non-empty, otherwise fall back to product.seo.
  const currentTitle = titleTagVal || seoTitleVal;
  const currentDesc = descTagVal || seoDescVal;

  const willWriteTitle = Boolean(metaTitle && titleVal);
  const willWriteDesc = Boolean(metaDescription && descVal);

  const metafields = [];

  if (willWriteTitle) {
    metafields.push({
      ownerId: id,
      namespace: "global",
      key: "title_tag",
      type: "single_line_text_field",
      value: titleVal,
    });
  }
  if (willWriteDesc) {
    metafields.push({
      ownerId: id,
      namespace: "global",
      key: "description_tag",
      type: "single_line_text_field",
      value: descVal,
    });
  }

  // Backfill counterpart metafield if missing in Shopify.
  if (willWriteTitle && !willWriteDesc && metaDescription) {
    const existingDescTag = String(p?.descriptionTag?.value ?? "").trim();
    if (!existingDescTag && currentDesc) {
      metafields.push({
        ownerId: id,
        namespace: "global",
        key: "description_tag",
        type: "single_line_text_field",
        value: currentDesc,
      });
    }
  }
  if (willWriteDesc && !willWriteTitle && metaTitle) {
    const existingTitleTag = String(p?.titleTag?.value ?? "").trim();
    if (!existingTitleTag && currentTitle) {
      metafields.push({
        ownerId: id,
        namespace: "global",
        key: "title_tag",
        type: "single_line_text_field",
        value: currentTitle,
      });
    }
  }

  if (!metafields.length) return;

  const mutation = `#graphql
    mutation SetProductSeoMetafields($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id key namespace value }
        userErrors { field message }
      }
    }
  `;

  const setJson = await shopifyGraphqlJsonWithRetry({
    admin,
    query: mutation,
    variables: { metafields },
    label: `Shopify GraphQL updateProductSeoMetafields (ownerId=${id})`,
    onAttempt,
    onRetry,
    onThrottle,
  });

  const errs = setJson?.data?.metafieldsSet?.userErrors || [];
  if (errs.length) throw new Error(errs.map((e) => e.message).join(" | "));
}

async function updateProductMediaAltText(admin, productId, mediaId, altText, { onAttempt, onRetry, onThrottle } = {}) {
  const mutation = `#graphql
    mutation ProductUpdateMedia($productId: ID!, $media: [UpdateMediaInput!]!) {
      productUpdateMedia(productId: $productId, media: $media) {
        media { ... on MediaImage { id alt } }
        userErrors { field message }
      }
    }
  `;

  const json = await shopifyGraphqlJsonWithRetry({
    admin,
    query: mutation,
    variables: {
      productId,
      media: [{ id: mediaId, alt: altText }],
    },
    label: "Shopify GraphQL updateProductMediaAltText",
    onAttempt,
    onRetry,
    onThrottle,
  });

  const errs = json?.data?.productUpdateMedia?.userErrors || [];
  if (errs.length) throw new Error(errs.map((e) => e.message).join(" | "));
}


/** ---- Locking (atomic) ---- */
async function lockJob(jobId, lockOwner, ttlMs = 5 * 60_000) {
  const now = new Date();
  const expires = new Date(now.getTime() + ttlMs);

  const res = await prisma.seoJob.updateMany({
    where: {
      id: jobId,
      OR: [
        { lockOwner: null },
        { lockExpiresAt: null },
        { lockExpiresAt: { lt: now } },
        { lockOwner }, // aynı owner tekrar uzatabilir
      ],
    },
    data: { lockOwner, lockExpiresAt: expires, lastHeartbeatAt: now },
  });

  return res.count > 0;
}

async function touchLock(jobId, lockOwner, ttlMs = 5 * 60_000, shop = null) {
  const now = new Date();
  const expires = new Date(now.getTime() + ttlMs);
  await prisma.seoJob.updateMany({
    where: { id: jobId, lockOwner },
    data: { lockExpiresAt: expires, lastHeartbeatAt: now },
  });

  // Keep the per-shop Redis lock alive as well (best-effort).
  if (shop) {
    try {
      await refreshShopLock(shop, lockOwner);
    } catch {
      // ignore
    }
  }
}

/** ---- Admin client (NO request needed) ---- */
async function getAdminClientForShop(shop) {
  const shopDomain = String(shop || "").trim();
  if (!shopDomain) throw new Error("Missing shop on SeoJob (job.shop is empty).");

  const out = await unauthenticated.admin(shopDomain);
  const admin = out?.admin;
  if (!admin?.graphql) {
    throw new Error("Failed to create admin GraphQL client via unauthenticated.admin(shop).");
  }
  return admin;
}

/** ---- GENERATE ---- */
async function processGenerate(job) {
  const settings = job.settingsJson ? JSON.parse(job.settingsJson) : {};
  const language = job.language || "tr";

  const isImageJob = String(job.jobType || "PRODUCT_SEO") === "ALT_TEXT_IMAGES";
  const isBlogJob = String(job.jobType || "PRODUCT_SEO") === "BLOG_SEO_META";

  const admin = await getAdminClientForShop(job.shop);

  await prisma.seoJob.update({
    where: { id: job.id },
    data: { status: "running", startedAt: new Date(), lastHeartbeatAt: new Date(), phase: "generating", lastError: null },
  });

  const items = await prisma.seoJobItem.findMany({
    where: {
      jobId: job.id,
      status: { in: ["queued", "failed"] },
      ...(isImageJob ? { targetType: "IMAGE" } : isBlogJob ? { targetType: "BLOG_ARTICLE" } : { targetType: "PRODUCT" }),
    },
    orderBy: { id: "asc" },
  });

  for (const item of items) {
    if (await isJobCancelled(job.id)) {
      // eslint-disable-next-line no-console
      console.log("[worker] generate cancelled, stopping:", job.id);
      return;
    }

    await touchLock(job.id, job.lockOwner, 5 * 60_000, job.shop);

    await prisma.seoJobItem.update({
      where: { id: item.id },
      data: { status: "running", startedAt: new Date(), error: null },
    });

    try {
      if (isImageJob) {
        const parentId = String(item.productId || "");
        if (!parentId) throw new Error("Missing productId for IMAGE item");

        const p = await fetchProduct(admin, parentId);
        const title = p?.title || item.productTitle || "";
        const descText = stripHtml(p?.descriptionHtml || "");

        const out = await generateAltTextForImage({
          productTitle: title,
          productDescriptionText: descText,
          currentAltText: item.seoDescription || "",
          language,
          settings,
          onAttempt: async (attempt) => {
            await prisma.seoJobItem.update({
              where: { id: item.id },
              data: { genAttempts: { increment: 1 } },
            });
            await prisma.seoJob.update({
              where: { id: job.id },
              data: { totalAttempts: { increment: 1 } },
            });

            if (attempt > 1) {
              await prisma.seoJobItem.update({
                where: { id: item.id },
                data: { error: `Retrying OpenAI request (attempt ${attempt})…` },
              });
              await prisma.seoJob.update({
                where: { id: job.id },
                data: { lastError: `Retrying OpenAI request (attempt ${attempt})…` },
              });
            }
          },
          onRetry: async ({ attemptNumber, waitMs, reason }) => {
            await prisma.seoJobItem.update({
              where: { id: item.id },
              data: { genRetryWaitMs: { increment: Math.max(0, Math.floor(waitMs)) } },
            });
            await prisma.seoJob.update({
              where: { id: job.id },
              data: { totalRetryWaitMs: { increment: Math.max(0, Math.floor(waitMs)) } },
            });

            const sec = Math.max(1, Math.ceil(waitMs / 1000));
            const msg = `OpenAI transient error (${reason}). Retrying in ${sec}s… (attempt ${attemptNumber + 1})`;
            await prisma.seoJobItem.update({
              where: { id: item.id },
              data: { error: msg },
            });
            await prisma.seoJob.update({
              where: { id: job.id },
              data: { lastError: msg },
            });
          },
        });

        await prisma.seoJobItem.update({
          where: { id: item.id },
          data: {
            status: "success",
            finishedAt: new Date(),
            productTitle: title || item.productTitle,
            // draft alt text stored in seoTitle
            seoTitle: out.altText || null,
          },
        });

        await prisma.seoJob.update({
          where: { id: job.id },
          data: { okCount: { increment: 1 } },
        });
      } else if (isBlogJob) {
        const articleId = String(item.targetId || item.productId || "");
        if (!articleId) throw new Error("Missing articleId for BLOG_ARTICLE item");

        const a = await fetchArticle(admin, articleId);
        const title = a?.title || item.productTitle || "";
        const bodyText = stripHtml(a?.body || a?.contentHtml || a?.excerptHtml || "");

        const out = await generateSeoForProduct({
          title,
          descriptionText: bodyText,
          language,
          settings,
          onAttempt: async (attempt) => {
            await prisma.seoJobItem.update({
              where: { id: item.id },
              data: { genAttempts: { increment: 1 } },
            });
            await prisma.seoJob.update({
              where: { id: job.id },
              data: { totalAttempts: { increment: 1 } },
            });
          },
          onRetry: async (waitMs, err) => {
            await prisma.seoJobItem.update({
              where: { id: item.id },
              data: {
                genRetryWaitMs: { increment: Math.max(0, Number(waitMs || 0)) },
                error: err?.message ? String(err.message).slice(0, 900) : null,
              },
            });
            await prisma.seoJob.update({
              where: { id: job.id },
              data: { totalRetryWaitMs: { increment: Math.max(0, Number(waitMs || 0)) } },
            });
          },
        });

        await prisma.seoJobItem.update({
          where: { id: item.id },
          data: {
            status: "success",
            finishedAt: new Date(),
            seoTitle: out?.seoTitle || null,
            seoDescription: out?.seoDescription || null,
            error: null,
          },
        });

        await prisma.seoJob.update({
          where: { id: job.id },
          data: { okCount: { increment: 1 } },
        });
      } else {
        const p = await fetchProduct(admin, item.productId);
        const title = p?.title || item.productTitle || "";
        const descText = stripHtml(p?.descriptionHtml || "");

        const out = await generateSeoForProduct({
          title,
          descriptionText: descText,
          language,
          settings,
          onAttempt: async (attempt) => {
          // telemetry: count attempts
          await prisma.seoJobItem.update({
            where: { id: item.id },
            data: { genAttempts: { increment: 1 } },
      });
          await prisma.seoJob.update({
            where: { id: job.id },
            data: { totalAttempts: { increment: 1 } },
          });

          if (attempt > 1) {
            await prisma.seoJobItem.update({
              where: { id: item.id },
              data: { error: `Retrying OpenAI request (attempt ${attempt})…` },
            });
            await prisma.seoJob.update({
              where: { id: job.id },
              data: { lastError: `Retrying OpenAI request (attempt ${attempt})…` },
            });
          }
          },
          onRetry: async ({ attemptNumber, waitMs, reason }) => {
          // telemetry: retry wait time
          await prisma.seoJobItem.update({
            where: { id: item.id },
            data: { genRetryWaitMs: { increment: Math.max(0, Math.floor(waitMs)) } },
          });
          await prisma.seoJob.update({
            where: { id: job.id },
            data: { totalRetryWaitMs: { increment: Math.max(0, Math.floor(waitMs)) } },
          });

          const sec = Math.max(1, Math.ceil(waitMs / 1000));
          const msg = `OpenAI transient error (${reason}). Retrying in ${sec}s… (attempt ${attemptNumber + 1})`;
          await prisma.seoJobItem.update({
            where: { id: item.id },
            data: { error: msg },
          });
          await prisma.seoJob.update({
            where: { id: job.id },
            data: { lastError: msg },
          });
          },
        });

        const seoTitle = job.metaTitle ? out.seoTitle : item.seoTitle;
        const seoDescription = job.metaDescription ? out.seoDescription : item.seoDescription;

        await prisma.seoJobItem.update({
          where: { id: item.id },
          data: {
            status: "success",
            finishedAt: new Date(),
            productTitle: title || item.productTitle,
            seoTitle: seoTitle || null,
            seoDescription: seoDescription || null,
          },
        });

        await prisma.seoJob.update({
          where: { id: job.id },
          data: { okCount: { increment: 1 } },
        });
      }
    } catch (e) {
      await prisma.seoJobItem.update({
        where: { id: item.id },
        data: { status: "failed", finishedAt: new Date(), error: String(e?.message || e) },
      });

      await prisma.seoJob.update({
        where: { id: job.id },
        data: { failedCount: { increment: 1 }, lastError: String(e?.message || e) },
      });
    }

    await sleep(450);
  }

  if (await isJobCancelled(job.id)) {
    // eslint-disable-next-line no-console
    console.log("[worker] generate cancelled at finalize, skipping success:", job.id);
    return;
  }

  await prisma.seoJob.update({
    where: { id: job.id },
    data: { status: "success", finishedAt: new Date(), phase: "generated" },
  });
}

/** ---- PUBLISH ---- */
async function processPublish(job) {
  const admin = await getAdminClientForShop(job.shop);

  const isImageJob = String(job.jobType || "PRODUCT_SEO") === "ALT_TEXT_IMAGES";
  const isBlogJob = String(job.jobType || "PRODUCT_SEO") === "BLOG_SEO_META";

  await prisma.seoJob.update({
    where: { id: job.id },
    data: {
      status: "running",
      publishStartedAt: new Date(),
      lastHeartbeatAt: new Date(),
      phase: "publishing",
      lastError: null,
    },
  });

  const items = await prisma.seoJobItem.findMany({
    where: {
      jobId: job.id,
      publishStatus: { in: ["queued", "failed"] },
      ...(isImageJob ? { targetType: "IMAGE" } : isBlogJob ? { targetType: "BLOG_ARTICLE" } : { targetType: "PRODUCT" }),
    },
    orderBy: { id: "asc" },
  });

  // ✅ hiç item yoksa da job publish’i kapatalım (UI stuck olmasın)
  if (!items.length) {
    if (await isJobCancelled(job.id)) {
      // eslint-disable-next-line no-console
      console.log("[worker] publish cancelled (no items), skipping finalize:", job.id);
      return;
    }
    await prisma.seoJob.update({
      where: { id: job.id },
      data: { status: "success", publishFinishedAt: new Date(), phase: "published" },
    });
    return;
  }

  for (const item of items) {
    if (await isJobCancelled(job.id)) {
      // eslint-disable-next-line no-console
      console.log("[worker] publish cancelled, stopping:", job.id);
      return;
    }
    await touchLock(job.id, job.lockOwner, 5 * 60_000, job.shop);

    await prisma.seoJobItem.update({
      where: { id: item.id },
      data: { publishStatus: "running", publishError: null },
    });

    try {
      const onThrottle = async ({ waitMs, throttleStatus }) => {
        try {
          await touchLock(job.id, job.lockOwner, 5 * 60_000, job.shop);
          const sec = Math.max(1, Math.ceil(waitMs / 1000));
          const avail = throttleStatus?.currentlyAvailable;
          const rate = throttleStatus?.restoreRate;
          const msg = `Shopify throttling (cost). Waiting ${sec}s…${avail != null ? ` (available=${avail}` : ""}${rate != null ? `, restoreRate=${rate}` : ""}${avail != null ? ")" : ""}`;

          await prisma.seoJobItem.update({
            where: { id: item.id },
            data: {
              publishRetryWaitMs: { increment: Math.max(0, Math.floor(waitMs)) },
              publishError: msg,
            },
          });

          await prisma.seoJob.update({
            where: { id: job.id },
            data: { lastError: msg, totalRetryWaitMs: { increment: Math.max(0, Math.floor(waitMs)) } },
          });
        } catch {
          // ignore
        }
      };

      if (isImageJob) {
        const productId = String(item.productId || "");
        const mediaId = String(item.mediaId || item.targetId || "");
        if (!productId) throw new Error("Missing productId for IMAGE item");
        if (!mediaId) throw new Error("Missing mediaId for IMAGE item");

        await updateProductMediaAltText(
          admin,
          productId,
          mediaId,
          String(item.seoTitle || ""),
          {
            onAttempt: async (attemptNumber) => {
              await prisma.seoJobItem.update({
                where: { id: item.id },
                data: { publishAttempts: attemptNumber },
              });
            },
            onRetry: async ({ attemptNumber, waitMs, reason, status, errorMessage }) => {
              await touchLock(job.id, job.lockOwner, 5 * 60_000, job.shop);

              const sec = Math.max(1, Math.ceil(waitMs / 1000));
              const detail = (errorMessage || "").trim();
              const why = (reason || "").trim();
              const parts = [`Shopify transient error (${status || "?"}).`];
              if (why) parts.push(why);
              if (detail && !detail.includes("Shopify transient error")) parts.push(`Details: ${detail}`);
              parts.push(`Retrying in ${sec}s… (attempt ${attemptNumber + 1})`);
              const msg = parts.join(" ");

              await prisma.seoJobItem.update({
                where: { id: item.id },
                data: { publishRetryWaitMs: { increment: waitMs }, publishError: msg },
              });
              await prisma.seoJob.update({
                where: { id: job.id },
                data: { lastError: msg },
              });

              // eslint-disable-next-line no-console
              console.log("[publish-retry]", job.id, mediaId, msg, reason ? `(${reason})` : "");
            },
            onThrottle,
          }
        );
      } else {
        // BLOG jobs must update Article SEO metafields, not Product SEO.
        if (isBlogJob) {
          const articleId = String(item.targetId || item.productId || "");
          if (!articleId) throw new Error("Missing articleId for BLOG_ARTICLE item");

          await updateArticleSeoMetafields(
            admin,
            articleId,
            item.seoTitle || "",
            item.seoDescription || "",
            {
              metaTitle: Boolean(job?.metaTitle ?? true),
              metaDescription: Boolean(job?.metaDescription ?? true),
              onAttempt: async (attemptNumber) => {
                await prisma.seoJobItem.update({
                  where: { id: item.id },
                  data: { publishAttempts: attemptNumber },
                });
              },
              onRetry: async ({ attemptNumber, waitMs, reason, status, errorMessage }) => {
                await touchLock(job.id, job.lockOwner, 5 * 60_000, job.shop);

                const sec = Math.max(1, Math.ceil(waitMs / 1000));
                const detail = (errorMessage || "").trim();
                const why = (reason || "").trim();
                const parts = [`Shopify transient error (${status || "?"}).`];
                if (why) parts.push(why);
                if (detail && !detail.includes("Shopify transient error")) parts.push(`Details: ${detail}`);
                parts.push(`Retrying in ${sec}s… (attempt ${attemptNumber + 1})`);
                const msg = parts.join(" ");

                await prisma.seoJobItem.update({
                  where: { id: item.id },
                  data: { publishRetryWaitMs: { increment: waitMs }, publishError: msg },
                });

                await prisma.seoJob.update({
                  where: { id: job.id },
                  data: { lastError: msg },
                });

                // eslint-disable-next-line no-console
                console.log("[publish-retry]", job.id, articleId, msg, reason ? `(${reason})` : "");
              },
              onThrottle,
            }
          );
        } else {
          await updateProductSeo(
            admin,
            item.productId,
            item.seoTitle || "",
            item.seoDescription || "",
            {
              metaTitle: Boolean(job?.metaTitle ?? true),
              metaDescription: Boolean(job?.metaDescription ?? true),
              onAttempt: async (attemptNumber) => {
                // Track attempts for publish separately (telemetry)
                await prisma.seoJobItem.update({
                  where: { id: item.id },
                  data: { publishAttempts: attemptNumber },
                });
              },
              onRetry: async ({ attemptNumber, waitMs, reason, status }) => {
                // Keep job + per-shop locks alive while we wait
                await touchLock(job.id, job.lockOwner, 5 * 60_000, job.shop);

                const sec = Math.max(1, Math.ceil(waitMs / 1000));
                const msg = `Shopify transient error (${status || "?"}). Retrying in ${sec}s… (attempt ${attemptNumber + 1})`;

                await prisma.seoJobItem.update({
                  where: { id: item.id },
                  data: {
                    publishRetryWaitMs: { increment: waitMs },
                    publishError: msg,
                  },
                });

                await prisma.seoJob.update({
                  where: { id: job.id },
                  data: { lastError: msg },
                });

                // eslint-disable-next-line no-console
                console.log("[publish-retry]", job.id, item.productId, msg, reason ? `(${reason})` : "");
              },
              onThrottle,
            }
          );
        }
      }

      await prisma.seoJobItem.update({
        where: { id: item.id },
        data: isImageJob
          ? {
              publishStatus: "success",
              publishedAt: new Date(),
              // Keep "current" ALT text in sync so UI badges (Edited/Published) behave correctly.
              // We store the current/live ALT text in seoDescription for IMAGE items.
              seoDescription: String(item.seoTitle || ""),
              publishError: null,
            }
          : { publishStatus: "success", publishedAt: new Date() },
      });

      await prisma.seoJob.update({
        where: { id: job.id },
        data: { publishOkCount: { increment: 1 } },
      });
    } catch (e) {
      await prisma.seoJobItem.update({
        where: { id: item.id },
        data: { publishStatus: "failed", publishError: String(e?.message || e) },
      });

      await prisma.seoJob.update({
        where: { id: job.id },
        data: { publishFailedCount: { increment: 1 }, lastError: String(e?.message || e) },
      });
    }

    await sleep(350);
  }

  if (await isJobCancelled(job.id)) {
    // eslint-disable-next-line no-console
    console.log("[worker] publish cancelled at finalize, skipping success:", job.id);
    return;
  }

  await prisma.seoJob.update({
    where: { id: job.id },
    data: {
      status: "success",
      publishFinishedAt: new Date(),
      phase: "published",
    },
  });
}

async function handleJob(jobId, _kind, lockOwner, preloadedJob = null) {
  const normalizedJobId = String(jobId || "").trim();
  if (!normalizedJobId) return;

  const gotLock = await lockJob(normalizedJobId, lockOwner);
  if (!gotLock) {
    // eslint-disable-next-line no-console
    console.log("[worker] lock busy, skipping:", normalizedJobId);
    return;
  }

  try {
    const job = preloadedJob || (await prisma.seoJob.findUnique({ where: { id: normalizedJobId } }));
    if (!job) return;

    // If user cancelled the job, exit early (best-effort).
    // We still release DB lock and shop lock in finally blocks.
    const jobStatus = String(job.status || "").toLowerCase();
    if (jobStatus === "cancelled" || jobStatus === "canceled") {
      // eslint-disable-next-line no-console
      console.log("[worker] job cancelled, skipping:", normalizedJobId);
      return;
    }

    // total safety
    const total = await prisma.seoJobItem.count({ where: { jobId: normalizedJobId } });
    if (job.total !== total) {
      await prisma.seoJob.update({ where: { id: normalizedJobId }, data: { total } });
    }

    const phase = String(job.phase || "generating");

    if (phase === "generating") {
      // --- Free plan enforcement (worker-side) ---
      // The UI reserves usage before enqueueing, but jobs could be enqueued from other entrypoints.
      // To make sure the limit cannot be bypassed, we enforce it here as well.
      // We only reserve once per job (usageReserved flag).
      if (!job.usageReserved) {
        const usageCount = Number(job.usageCount || job.total || 0);
        const reservation = await reserveIfFreePlan({ shop: job.shop, productCount: usageCount });

        if (!reservation.ok) {
          const now = new Date();
          const msg = `Free plan limit exceeded (worker enforcement).`;
          await prisma.seoJobItem.updateMany({
            where: { jobId: normalizedJobId, status: { in: ["queued", "running"] } },
            data: { status: "failed", finishedAt: now, error: msg },
          });

          await prisma.seoJob.update({
            where: { id: normalizedJobId },
            data: {
              status: "failed",
              finishedAt: now,
              lastError: msg,
              phase: "generating",
              usageReserved: false,
              usageCount,
            },
          });

          // eslint-disable-next-line no-console
          console.warn("[worker] FREE_PLAN_ENFORCED jobId=", normalizedJobId, "shop=", job.shop);
          return;
        }

        // Mark as reserved so we never reserve twice for the same job.
        await prisma.seoJob.update({
          where: { id: normalizedJobId },
          data: { usageReserved: true, usageCount: Number(job.usageCount || job.total || 0) },
        });
      }

      await processGenerate({ ...job, lockOwner });
      return;
    }


    if (phase === "publishing") {
      await processPublish({ ...job, lockOwner });
      return;
    }
  } finally {
    // ✅ KRİTİK: işlem bittiğinde lock'u serbest bırak
    await prisma.seoJob.updateMany({
      where: { id: normalizedJobId, lockOwner },
      data: { lockOwner: null, lockExpiresAt: null },
    });
  }
}

// --- Stuck job recovery ---
// A job becomes "stuck" when:
// - status = running
// - lockExpiresAt is in the past (worker stopped touching the lock)
// We then mark job/items as failed so UI can recover and the user can retry.
async function recoverStuckJobs() {
  const now = new Date();
  const cutoff = new Date(now.getTime() - STUCK_JOB_MINUTES * 60_000);

  // Limit batch size to avoid heavy load.
  const stuck = await prisma.seoJob.findMany({
    where: {
      status: "running",
      lockExpiresAt: { not: null, lt: now },
      OR: [
        { lastHeartbeatAt: { not: null, lt: cutoff } },
        { startedAt: { not: null, lt: cutoff } },
        { publishStartedAt: { not: null, lt: cutoff } },
        // fallback: if no startedAt fields but lock expired, still recover
        { startedAt: null, publishStartedAt: null, lastHeartbeatAt: null },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: 25,
  });

  if (!stuck.length) return;

  for (const job of stuck) {
    const phase = String(job.phase || "generating");
    const msg = `Recovered stuck job (no heartbeat for >= ${STUCK_JOB_MINUTES}m)`;

    try {
      if (phase === "publishing") {
        await prisma.seoJobItem.updateMany({
          where: { jobId: job.id, publishStatus: "running" },
          data: { publishStatus: "failed", publishError: msg },
        });
      } else {
        await prisma.seoJobItem.updateMany({
          where: { jobId: job.id, status: "running" },
          data: { status: "failed", finishedAt: now, error: msg },
        });
      }

      await prisma.seoJob.update({
        where: { id: job.id },
        data: {
          status: "failed",
          finishedAt: now,
          publishFinishedAt: phase === "publishing" ? now : job.publishFinishedAt,
          lastError: msg,
          lockOwner: null,
          lockExpiresAt: null,
        },
      });

      // eslint-disable-next-line no-console
      console.warn("[worker]", msg, "jobId=", job.id, "shop=", job.shop);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[worker] failed to recover stuck job", job.id, e);
    }
  }
}

/** ---- Worker bootstrap ---- */
export function startSeoWorker() {
  initSentry();
  // eslint-disable-next-line no-console
  console.log(
    `[worker] SEO Worker started… queue="${QUEUE_NAME}" redis="${process.env.REDIS_URL || ""}"`
  );

  const worker = new Worker(
    QUEUE_NAME,
    async (bullJob) => {
      const jobId = bullJob?.data?.jobId;
      const kind = bullJob?.data?.kind;
      const lockOwner = `worker-${process.pid}`;

      // eslint-disable-next-line no-console
      console.log("[worker] received job:", bullJob?.id, "data:", bullJob?.data);

      if (!jobId) throw new Error("Missing jobId in bull job data");

      // Load job to identify the shop (for per-shop concurrency)
      const dbJob = await prisma.seoJob.findUnique({ where: { id: String(jobId).trim() } });
      if (!dbJob) return;

      // Acquire per-shop lock (1 job per shop at a time)
      const gotShopLock = await acquireShopLock(dbJob.shop, lockOwner);
      if (!gotShopLock) {
        // Another job from the same shop is running.
        // Re-schedule this Bull job a bit later (do NOT burn attempts).
        try {
          const ts = Date.now() + SHOP_LOCK_RETRY_DELAY_MS;
          // BullMQ requires the token when moving between states.
          await bullJob.moveToDelayed(ts, bullJob.token);
          // eslint-disable-next-line no-console
          console.log(
            `[worker] shop lock busy (${dbJob.shop}), delayed ${SHOP_LOCK_RETRY_DELAY_MS}ms for job`,
            bullJob?.id
          );
          return;
        } catch (e) {
          // If moveToDelayed fails, fall back to a short sleep + retry via throw.
          await sleep(200);
          throw new Error(`SHOP_LOCK_BUSY: ${String(e?.message || e)}`);
        }
      }

      try {
        await handleJob(jobId, kind, lockOwner, dbJob);
      } finally {
        await releaseShopLock(dbJob.shop, lockOwner);
      }
    },
    { connection }
  );

  // Stuck job recovery: if a job is "running" but its DB lock expired (no heartbeat)
  // we mark it as failed so UI doesn't stay stuck forever.
  const intervalMs = 60_000;
  const timer = setInterval(() => {
    recoverStuckJobs().catch((e) => {
      // eslint-disable-next-line no-console
      console.error("[worker] recoverStuckJobs error:", e);
    });
  }, intervalMs);

  worker.on("closed", () => clearInterval(timer));

  worker.on("failed", (bullJob, err) => {
    // eslint-disable-next-line no-console
    console.error("Worker failed:", bullJob?.id, err);
    captureException(err, { where: "worker.failed", bullJobId: bullJob?.id, data: bullJob?.data });
  });

  worker.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("Worker error:", err);
    captureException(err, { where: "worker.error" });
  });

  return worker;
}

if (process.argv?.[1]?.includes("seo.worker.js")) {
  startSeoWorker();
}


function normalizeArticleOwnerId(id) {
  if (!id) return "";
  const s = String(id).trim();

  // In Admin GraphQL, blog posts are represented as `Article` and its ID is `gid://shopify/Article/<id>`.
  // Use the Article ID directly for reads/writes (metafieldsSet, etc.).
  if (s.startsWith("gid://shopify/Article/")) return s;

  // If we somehow received an OnlineStoreArticle id, convert it back to Article.
  if (s.startsWith("gid://shopify/OnlineStoreArticle/")) {
    return s.replace("gid://shopify/OnlineStoreArticle/", "gid://shopify/Article/");
  }

  // If it's a numeric legacy id, build an Article GID.
  if (/^\d+$/.test(s)) return `gid://shopify/Article/${s}`;

  return s;
}

function ownerIdCandidatesForArticle(articleId) {
  const s = String(articleId || "").trim();
  const c = [];
  if (s) c.push(s);

  const norm = normalizeArticleOwnerId(s);
  if (norm) c.push(norm);

  // IMPORTANT: Some shops / API versions do NOT have the OnlineStoreArticle typename at all.
  // Including `gid://shopify/OnlineStoreArticle/...` can therefore trigger "Invalid id".
  // We only keep the `Article` form here.
  if (s.startsWith("gid://shopify/OnlineStoreArticle/")) {
    c.push(s.replace("gid://shopify/OnlineStoreArticle/", "gid://shopify/Article/"));
  }

  // Dedupe while preserving order
  return c.filter((v, i) => c.indexOf(v) === i);
}




/** ---------------- Resolve Article GID for mutations ----------------
 * Some shops / API versions can return blog article IDs with different typename segments.
 * We preflight with `node(id:)` to ensure the ID exists, and fallback by swapping between
 * `Article` and `OnlineStoreArticle`.
 */
async function resolveArticleMutationId(admin, rawId, { onAttempt, onRetry } = {}) {
  const candidates = [];
  const s = String(rawId || "").trim();

  if (!s) return "";

  // Keep original first
  candidates.push(s);

  // If numeric, try both
  if (/^\d+$/.test(s)) {
    candidates.push(`gid://shopify/Article/${s}`);
    candidates.push(`gid://shopify/OnlineStoreArticle/${s}`);
  }

  // If gid, try swapping between Article and OnlineStoreArticle
  if (s.startsWith("gid://shopify/Article/")) {
    candidates.push(s.replace("gid://shopify/Article/", "gid://shopify/OnlineStoreArticle/"));
  } else if (s.startsWith("gid://shopify/OnlineStoreArticle/")) {
    candidates.push(s.replace("gid://shopify/OnlineStoreArticle/", "gid://shopify/Article/"));
  }

  // Also try normalized forms
  try {
    candidates.push(toArticleGid(s));
  } catch {}
  // De-dupe
  const uniq = Array.from(new Set(candidates.filter(Boolean)));

  const query = `#graphql
    query ResolveNode($id: ID!) {
      node(id: $id) { __typename id }
    }`;

  for (const id of uniq) {
    const json = await shopifyGraphqlJsonWithRetry({
      admin,
      query,
      variables: { id },
      label: "Shopify GraphQL node resolve (article id)",
      onAttempt,
      onRetry,
    });

    const node = json?.data?.node;
    if (node?.id) return String(node.id);
  }

  return "";
}

async function updateArticleSeo(admin, { articleId, seoTitle, seoDescription, onAttempt, onRetry }) {
  // Shopify stores article SEO as metafields: global.title_tag and global.description_tag.
  // For articles, use articleUpdate (ArticleUpdateInput.metafields) instead of metafieldsSet to avoid ownerId validation issues.
  const mutation = `#graphql
    mutation ArticleUpdateSeo($id: ID!, $article: ArticleUpdateInput!) {
      articleUpdate(id: $id, article: $article) {
        article { id }
        userErrors { field message }
      }
    }
  `;

  const id = await resolveArticleMutationId(admin, articleId, { onAttempt, onRetry });
  if (!id) throw new Error(`Invalid id: ${String(articleId)}`);

  const article = {
    metafields: [
      {
        namespace: "global",
        key: "title_tag",
        type: "single_line_text_field",
        value: String(seoTitle || ""),
      },
      {
        namespace: "global",
        key: "description_tag",
        type: "single_line_text_field",
        value: String(seoDescription || ""),
      },
    ],
  };

  const json = await shopifyGraphqlJsonWithRetry({
    admin,
    query: mutation,
    variables: { id, article },
    label: "Shopify GraphQL articleUpdate (article SEO)",
    onAttempt,
    onRetry,
  });

  const errs = json?.data?.articleUpdate?.userErrors || [];
  if (errs.length) throw new Error(errs.map((e) => e.message).join("; "));

  return {
    id,
    seo: { title: String(seoTitle || ""), description: String(seoDescription || "") },
  };
}


