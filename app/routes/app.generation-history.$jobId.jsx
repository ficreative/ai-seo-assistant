// app/routes/app.generation-history.$jobId.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";

import prisma from "../db.server.js";
import { authenticate } from "../shopify.server";
import { enqueueSeoJob } from "../queue.server";
import { createGenerateJob } from "../jobs.server";
import { reserveIfFreePlan } from "../billing.gating.server.js";



import {
  Page,
  Frame,
  Card,
  Button,
  InlineStack,
  BlockStack,
  Text,
  Badge,
  Checkbox,
  Divider,
  Banner,
  TextField,
  Layout,
  Spinner,
  Box,
  Toast,
  ProgressBar,
} from "@shopify/polaris";

const SETTINGS_NAMESPACE = "ai_seo_assistant";
const SETTINGS_KEY = "settings";

async function getSettingsFromMetafield(admin) {
  const query = `#graphql
    query GetAiSeoAssistantSettings($namespace: String!, $key: String!) {
      shop {
        metafield(namespace: $namespace, key: $key) { value }
      }
    }`;
  const res = await admin.graphql(query, {
    variables: { namespace: SETTINGS_NAMESPACE, key: SETTINGS_KEY },
  });
  const json = await res.json();
  const raw = json?.data?.shop?.metafield?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}


/** ---------------- time helpers ---------------- */
function nowIso() {
  return new Date().toISOString();
}
function toMs(iso) {
  try {
    return iso ? new Date(iso).getTime() : 0;
  } catch {
    return 0;
  }
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/** ---------------- preview & quality helpers ---------------- */
function clampText(s, max) {
  const str = String(s ?? "");
  if (!max || max <= 0) return str;
  return str.length > max ? str.slice(0, Math.max(0, max - 1)) + "…" : str;
}
function splitCsv(s) {
  return String(s || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}
function includesAll(text, terms) {
  const t = String(text || "").toLowerCase();
  return (terms || []).every((w) => t.includes(String(w).toLowerCase()));
}
function includesAny(text, terms) {
  const t = String(text || "").toLowerCase();
  return (terms || []).some((w) => t.includes(String(w).toLowerCase()));
}
function computeQuality({ title, desc, settings }) {
  const maxTitle = Number(settings?.seoTitleMaxChars || 60);
  const maxDesc = Number(settings?.seoDescriptionMaxChars || 160);

  const required = splitCsv(settings?.requiredKeywords);
  const banned = splitCsv(settings?.bannedWords);
  const target = String(settings?.targetKeyword || "").trim();

  const combined = `${title || ""} ${desc || ""}`.trim();

  const checks = [
    {
      key: "title_len",
      label: `Title length ≤ ${maxTitle}`,
      ok: String(title || "").length > 0 && String(title || "").length <= maxTitle,
    },
    {
      key: "desc_len",
      label: `Description length ≤ ${maxDesc}`,
      ok: String(desc || "").length > 0 && String(desc || "").length <= maxDesc,
    },
    ...(target
      ? [
          {
            key: "target_kw",
            label: `Includes target keyword: ${target}`,
            ok: includesAny(combined, [target]),
          },
        ]
      : []),
    ...(required.length
      ? [
          {
            key: "required_kws",
            label: `Includes required keywords (${required.length})`,
            ok: includesAll(combined, required),
          },
        ]
      : []),
    ...(banned.length
      ? [
          {
            key: "banned",
            label: `Avoids banned words (${banned.length})`,
            ok: !includesAny(combined, banned),
          },
        ]
      : []),
  ];

  let score = 100;
  const failed = checks.filter((c) => !c.ok).length;
  score -= failed * 15;

  const t = String(title || "");
  if (t && t === t.toUpperCase() && /[A-ZÇĞİÖŞÜ]/.test(t)) score -= 10;
  if (t.length > maxTitle) score -= Math.min(20, t.length - maxTitle);

  const d = String(desc || "");
  if (d.length > maxDesc) score -= Math.min(20, d.length - maxDesc);

  score = Math.max(0, Math.min(100, Math.round(score)));

  return { score, checks, maxTitle, maxDesc };
}


/** ---------------- ID normalization ---------------- */
function toProductGid(id) {
  if (!id) return "";
  const s = String(id).trim();

  if (s.startsWith("gid://")) return s;

  const m = s.match(/\/Product\/(\d+)$/);
  if (m?.[1]) return `gid://shopify/Product/${m[1]}`;

  if (/^\d+$/.test(s)) return `gid://shopify/Product/${s}`;

  return s;
}

function toArticleGid(id) {
  if (!id) return "";
  const s = String(id).trim();

  if (s.startsWith("gid://")) return s;

  const m = s.match(/\/Article\/(\d+)$/);
  if (m?.[1]) return `gid://shopify/Article/${m[1]}`;

  if (/^\d+$/.test(s)) return `gid://shopify/Article/${s}`;

  return s;
}


function gidToNumeric(id) {
  if (!id) return "";
  const s = String(id).trim();
  if (/^\d+$/.test(s)) return s;
  const m = s.match(/\/Product\/(\d+)$/);
  return m?.[1] ? String(m[1]) : "";
}

function productIdVariants(rawId) {
  const gid = toProductGid(rawId);
  const num = gidToNumeric(rawId);
  const out = new Set();
  if (rawId) out.add(String(rawId).trim());
  if (gid) out.add(gid);
  if (num) out.add(num);
  return Array.from(out).filter(Boolean);
}

/** ---------------- publish status normalize ---------------- */
function isPublishRunningStatus(ps) {
  const s = String(ps || "").toLowerCase();
  return s === "running" || s === "publishing" || s === "in_progress" || s === "processing";
}
function isPublishSuccessStatus(ps) {
  const s = String(ps || "").toLowerCase();
  return (
    s === "success" ||
    s === "published" ||
    s === "completed" ||
    s === "done" ||
    s === "succeeded" ||
    s === "ok"
  );
}

/** ---------------- Shopify live SEO helper ---------------- */

/** ---------------- Shopify live Article SEO helper (metafields) ---------------- */
async function fetchLiveArticleSeo(admin, articleIds) {
  const ids = Array.from(new Set((articleIds || []).map(toArticleGid).filter(Boolean)));
  if (!ids.length) return {};

  const query = `#graphql
    query ArticlesSeo($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Article {
          id
          titleTag: metafield(namespace: "global", key: "title_tag") { value }
          descriptionTag: metafield(namespace: "global", key: "description_tag") { value }
        }
      }
    }`;

  const res = await admin.graphql(query, { variables: { ids } });
  const json = await res.json();

  const nodes = json?.data?.nodes || [];
  const map = {};

  for (const n of nodes) {
    const gid = n?.id ? String(n.id) : "";
    if (!gid) continue;
    map[gid] = {
      seoTitle: n?.titleTag?.value ?? "",
      seoDescription: n?.descriptionTag?.value ?? "",
    };
  }

  return map;
}

async function fetchLiveProductSeo(admin, productIds) {
  const ids = Array.from(new Set((productIds || []).map(toProductGid).filter(Boolean)));
  if (!ids.length) return {};

  const query = `#graphql
    query ProductsSeo($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          seo { title description }
        }
      }
    }`;

  const res = await admin.graphql(query, { variables: { ids } });
  const json = await res.json();

  const nodes = json?.data?.nodes || [];
  const map = {};

  for (const n of nodes) {
    const gid = n?.id ? String(n.id) : "";
    if (!gid) continue;
    map[gid] = {
      seoTitle: n?.seo?.title ?? "",
      seoDescription: n?.seo?.description ?? "",
    };
  }

  return map;
}

/** ---------------- embedded query helper ---------------- */
function buildEmbeddedSearch(currentSearch) {
  const p = new URLSearchParams(currentSearch || "");

  const shop =
    p.get("shop") ||
    (typeof window !== "undefined" ? window.sessionStorage.getItem("shopifyShop") : "") ||
    "";
  const host =
    p.get("host") ||
    (typeof window !== "undefined" ? window.sessionStorage.getItem("shopifyHost") : "") ||
    "";
  const embedded =
    p.get("embedded") ||
    (typeof window !== "undefined" ? window.sessionStorage.getItem("shopifyEmbedded") : "") ||
    "";

  const out = new URLSearchParams();
  if (shop) out.set("shop", shop);
  if (host) out.set("host", host);
  if (embedded) out.set("embedded", embedded);

  const qs = out.toString();
  return qs ? `?${qs}` : "";
}

/** ---------------- server ---------------- */
export async function loader({ request, params }) {
  const { admin, session } = await authenticate.admin(request);
  const jobId = String(params.jobId || "");

  const job = await prisma.seoJob.findFirst({
    where: { id: jobId, shop: session.shop },
    include: { items: true },
  });

  if (!job) throw new Response("Not found", { status: 404 });

  const isImageJob = String(job.jobType || "PRODUCT_SEO") === "ALT_TEXT_IMAGES";
  const isBlogJob = String(job.jobType || "PRODUCT_SEO") === "BLOG_SEO_META";

  const productIds = isImageJob || isBlogJob
    ? []
    : (job.items || []).map((it) => toProductGid(it.productId)).filter(Boolean);

  const articleIds = isBlogJob
    ? (job.items || []).map((it) => String(it.targetId || it.productId || "")).filter(Boolean)
    : [];

  const liveSeoMap = isImageJob
    ? {}
    : isBlogJob
      ? await fetchLiveArticleSeo(admin, articleIds)
      : await fetchLiveProductSeo(admin, productIds);

  const settings = await getSettingsFromMetafield(admin);

  return { job, liveSeoMap, settings };
}

/** ---------------- action ---------------- */
export async function action({ request, params }) {
  const { admin, session } = await authenticate.admin(request);
  const jobId = String(params.jobId || "");

  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");

  const job = await prisma.seoJob.findFirst({
    where: { id: jobId, shop: session.shop },
  });
  if (!job) throw new Response("Not found", { status: 404 });

  const isImageJob = String(job.jobType || "PRODUCT_SEO") === "ALT_TEXT_IMAGES";
  const isBlogJob = String(job.jobType || "PRODUCT_SEO") === "BLOG_SEO_META";

  // Retry whole job (used for stuck recovery)
  if (intent === "retry_job_generate") {
    // Re-queue all non-success items for generation
    await prisma.$transaction([
      prisma.seoJobItem.updateMany({
        where: { jobId, status: { notIn: ["success"] } },
        data: { status: "queued", error: null },
      }),
      prisma.seoJob.update({
        where: { id: jobId },
        data: {
          phase: "generating",
          status: "queued",
          startedAt: new Date(),
          finishedAt: null,
          okCount: 0,
          failedCount: 0,
          lastError: null,
          lastHeartbeatAt: new Date(),
        },
      }),
    ]);

    await enqueueSeoJob(jobId, "generate");
    return { ok: true, intent: "retry_job_generate" };
  }

  if (intent === "retry_job_publish") {
    // For apply/publish phase: keep skipped items as-is; re-queue failed/queued/running
    await prisma.$transaction([
      prisma.seoJobItem.updateMany({
        where: { jobId, publishStatus: { in: ["failed", "queued", "running"] } },
        data: { publishStatus: "queued", publishError: null },
      }),
      prisma.seoJob.update({
        where: { id: jobId },
        data: {
          phase: "publishing",
          status: "queued",
          publishStartedAt: new Date(),
          publishFinishedAt: null,
          publishOkCount: 0,
          publishFailedCount: 0,
          lastError: null,
          lastHeartbeatAt: new Date(),
        },
      }),
    ]);

    await enqueueSeoJob(jobId, "publish");
    return { ok: true, intent: "retry_job_publish" };
  }

  if (intent === "save_draft_selected") {
    const itemsJson = String(formData.get("items") || "[]");
    const items = safeParse(itemsJson, []);

    const valid = Array.isArray(items)
      ? items
          .map((x) => ({
            id: String(x?.id || "").trim(),
            productId: String(x?.productId || "").trim(),
            seoTitle: x?.seoTitle == null ? null : String(x.seoTitle),
            seoDescription: x?.seoDescription == null ? null : String(x.seoDescription),
          }))
          .filter((x) => (isImageJob ? x.id : x.productId))
      : [];

    if (!valid.length) return { ok: false, error: "No items selected" };

    if (isImageJob) {
      await prisma.$transaction(
        valid.map((v) =>
          prisma.seoJobItem.updateMany({
            where: { jobId, id: v.id },
            data: { seoTitle: v.seoTitle },
          }),
        ),
      );
      return { ok: true, intent: "save_draft_selected", saved: valid.map((v) => v.id) };
    }

    await prisma.$transaction(
      valid.map((v) =>
        prisma.seoJobItem.updateMany({
          where: { jobId, productId: v.productId },
          data: {
            seoTitle: v.seoTitle,
            seoDescription: v.seoDescription,
          },
        }),
      ),
    );

    return { ok: true, intent: "save_draft_selected", saved: valid.map((v) => v.productId) };
  }

  if (intent === "publish_selected") {
    const itemsJson = String(formData.get("items") || "[]");
    const items = safeParse(itemsJson, []);

    const valid = Array.isArray(items)
      ? items
          .map((x) => ({
            id: String(x?.id || "").trim(),
            productId: String(x?.productId || "").trim(),
            seoTitle: x?.seoTitle == null ? null : String(x.seoTitle),
            seoDescription: x?.seoDescription == null ? null : String(x.seoDescription),
          }))
          .filter((x) => (isImageJob ? x.id : x.productId))
      : [];

    if (!valid.length) {
      return { ok: false, error: "No items selected" };
    }

    const onlyChanged = String(formData.get("onlyChanged") || "true") === "true";

    if (isImageJob) {
      // Only-changed check uses stored current alt text in seoDescription
      let filtered = valid;
      if (onlyChanged) {
        const rows = await prisma.seoJobItem.findMany({
          where: { jobId, id: { in: valid.map((v) => v.id) } },
          select: { id: true, seoDescription: true },
        });
        const curMap = Object.fromEntries(rows.map((r) => [String(r.id), String(r.seoDescription || "")]));
        filtered = valid.filter((v) => String(v.seoTitle || "").trim() !== String(curMap[v.id] || "").trim());
      }

      if (!filtered.length) {
        return { ok: false, error: onlyChanged ? "No changes to apply" : "No items selected" };
      }

      const selectedIds = Array.from(new Set(filtered.map((v) => v.id)));

      await prisma.$transaction([
        prisma.seoJobItem.updateMany({
          where: { jobId },
          data: { publishStatus: "skipped", publishError: null },
        }),
        prisma.seoJobItem.updateMany({
          where: { jobId, id: { in: selectedIds } },
          data: { publishStatus: "queued", publishError: null, publishedAt: null },
        }),
        ...filtered.map((it) =>
          prisma.seoJobItem.updateMany({
            where: { jobId, id: it.id },
            data: { seoTitle: it.seoTitle },
          }),
        ),
      ]);

      await prisma.seoJob.update({
        where: { id: jobId },
        data: {
          phase: "publishing",
          status: "queued",
          publishStartedAt: new Date(),
          publishFinishedAt: null,
          publishOkCount: 0,
          publishFailedCount: 0,
          lastError: null,
        },
      });

      await enqueueSeoJob(jobId, "publish");
      return { ok: true };

    }

    if (isBlogJob) {
      // For BLOG_ARTICLE items, productId carries the Article GID.
      let filtered = valid;

      if (onlyChanged) {
        const gids = Array.from(new Set(valid.map((v) => toArticleGid(v.productId)).filter(Boolean)));
        const liveMap = await fetchLiveArticleSeo(admin, gids);

        filtered = valid.filter((v) => {
          const gid = toArticleGid(v.productId);
          const live = liveMap?.[gid];
          if (!live) return true;

          const nextTitle = String(v.seoTitle ?? "");
          const nextDesc = String(v.seoDescription ?? "");
          const curTitle = String(live.seoTitle ?? "");
          const curDesc = String(live.seoDescription ?? "");

          return nextTitle.trim() !== curTitle.trim() || nextDesc.trim() !== curDesc.trim();
        });
      }

      if (!filtered.length) {
        return { ok: false, error: onlyChanged ? "No changes to apply" : "No items selected" };
      }

      const selectedIds = Array.from(new Set(filtered.map((v) => v.productId)));

      await prisma.$transaction([
        prisma.seoJobItem.updateMany({
          where: { jobId },
          data: { publishStatus: "skipped", publishError: null },
        }),
        prisma.seoJobItem.updateMany({
          where: { jobId, productId: { in: selectedIds } },
          data: { publishStatus: "queued", publishError: null, publishedAt: null },
        }),
        ...filtered.map((it) =>
          prisma.seoJobItem.updateMany({
            where: { jobId, productId: it.productId },
            data: { seoTitle: it.seoTitle, seoDescription: it.seoDescription },
          }),
        ),
      ]);

      await prisma.seoJob.update({
        where: { id: jobId },
        data: {
          phase: "publishing",
          status: "queued",
          publishStartedAt: new Date(),
          publishFinishedAt: null,
          publishOkCount: 0,
          publishFailedCount: 0,
          lastError: null,
        },
      });

      await enqueueSeoJob(jobId, "publish");
      return { ok: true };
    }


    // If onlyChanged=true, filter selected items to only those whose SEO differs from live product SEO.
    let filtered = valid;
    if (onlyChanged) {
      const gidIds = Array.from(
        new Set(
          valid
            .map((v) => toProductGid(v.productId))
            .filter(Boolean),
        ),
      );
      const liveMap = await fetchLiveProductSeo(admin, gidIds);

      filtered = valid.filter((v) => {
        const gid = toProductGid(v.productId);
        const live = liveMap?.[gid];
        if (!live) return true;

        const nextTitle = String(v.seoTitle ?? "");
        const nextDesc = String(v.seoDescription ?? "");
        const curTitle = String(live.seoTitle ?? "");
        const curDesc = String(live.seoDescription ?? "");

        const titleChanged = nextTitle.trim() !== curTitle.trim();
        const descChanged = nextDesc.trim() !== curDesc.trim();

        // If job is configured to not edit one field, ignore it.
        const mt = Boolean(job?.metaTitle ?? true);
        const md = Boolean(job?.metaDescription ?? true);
        const okTitle = mt ? titleChanged : false;
        const okDesc = md ? descChanged : false;

        return okTitle || okDesc;
      });
    }

    if (!filtered.length) {
      return { ok: false, error: onlyChanged ? "No changes to apply" : "No items selected" };
    }

    const selectedAllIds = Array.from(new Set(filtered.flatMap((v) => productIdVariants(v.productId))));

    await prisma.$transaction([
      prisma.seoJobItem.updateMany({
        where: { jobId },
        data: {
          publishStatus: "skipped",
          publishError: null,
        },
      }),

      prisma.seoJobItem.updateMany({
        where: {
          jobId,
          productId: { in: selectedAllIds },
        },
        data: {
          publishStatus: "queued",
          publishError: null,
          publishedAt: null,
        },
      }),

      ...filtered.map((it) => {
        const ids = productIdVariants(it.productId);
        return prisma.seoJobItem.updateMany({
          where: { jobId, productId: { in: ids } },
          data: {
            seoTitle: it.seoTitle,
            seoDescription: it.seoDescription,
          },
        });
      }),
    ]);

    await prisma.seoJob.update({
      where: { id: jobId },
      data: {
        phase: "publishing",
        status: "queued",
        publishStartedAt: new Date(),
        publishFinishedAt: null,
        publishOkCount: 0,
        publishFailedCount: 0,
        lastError: null,
      },
    });

    await enqueueSeoJob(jobId, "publish");
    return {
      ok: true,
      intent: "publish_selected",
      queued: filtered.length,
      skipped: Math.max(0, valid.length - filtered.length),
    };
  }

  // F: Regenerate selected items as a NEW job (keeps history clean)
  if (intent === "regenerate_selected" || intent === "regenerate_failed") {
    const itemsJson = String(formData.get("items") || "[]");
    const maybe = safeParse(itemsJson, []);

    let productIds = Array.isArray(maybe)
      ? maybe.map((x) => String(x?.productId || x || "").trim()).filter(Boolean)
      : [];

    if (intent === "regenerate_failed" && !productIds.length) {
      const failed = await prisma.seoJobItem.findMany({
        where: { jobId, status: "failed" },
        select: { productId: true },
      });
      productIds = failed.map((f) => String(f.productId));
    }

    if (!productIds.length) {
      return { ok: false, error: intent === "regenerate_failed" ? "No failed items" : "No items selected" };
    }

    // Reserve free-plan usage (regen counts as usage)
    const reservation = await reserveIfFreePlan({ shop: session.shop, productCount: productIds.length });
    if (!reservation.ok) {
      return {
        ok: false,
        code: reservation.code || "FREE_LIMIT_EXCEEDED",
        error: "Free plan limit exceeded",
        billing: reservation,
      };
    }

    // Carry seed from current job
    const seedSettings = safeParse(String(job.settingsJson || "{}"), {});
    const titlesById = {};
    const rows = await prisma.seoJobItem.findMany({
      where: { jobId, productId: { in: productIds } },
      select: { productId: true, productTitle: true },
    });
    for (const r of rows) {
      if (r?.productId && r?.productTitle) titlesById[String(r.productId)] = String(r.productTitle);
    }

    const newJob = await createGenerateJob({
      shop: session.shop,
      seed: {
        language: String(job.language || "tr"),
        settings: seedSettings,
        fields: { metaTitle: Boolean(job.metaTitle ?? true), metaDescription: Boolean(job.metaDescription ?? true) },
      },
      usageReserved: true,
      productIds,
      productTitlesById: titlesById,
    });

    await enqueueSeoJob(newJob.id, "generate");
    return { ok: true, intent, newJobId: newJob.id };
  }



  if (intent === "retry_failed_publish") {
    const itemsJson = String(formData.get("items") || "[]");
    const maybe = safeParse(itemsJson, []);

    // if empty, retry all failed publish items
    let productIds = Array.isArray(maybe)
      ? maybe.map((x) => String(x?.productId || x || "").trim()).filter(Boolean)
      : [];

    if (!productIds.length) {
      const failed = await prisma.seoJobItem.findMany({
        where: { jobId, publishStatus: "failed" },
        select: { productId: true },
      });
      productIds = failed.map((f) => String(f.productId));
    }

    if (!productIds.length) return { ok: false, error: "No failed items to retry" };

    const idsAll = Array.from(new Set(productIds.flatMap((p) => productIdVariants(p))));

    const failedCount = await prisma.seoJobItem.count({
      where: { jobId, productId: { in: idsAll }, publishStatus: "failed" },
    });

    await prisma.$transaction([
      prisma.seoJobItem.updateMany({
        where: { jobId, productId: { in: idsAll } },
        data: {
          publishStatus: "queued",
          publishError: null,
          publishedAt: null,
        },
      }),
      prisma.seoJob.update({
        where: { id: jobId },
        data: {
          status: "queued",
          phase: "publishing",
          publishFinishedAt: null,
          publishStartedAt: new Date(),
          lastError: null,
          ...(failedCount ? { publishFailedCount: { decrement: failedCount } } : {}),
        },
      }),
    ]);

    await enqueueSeoJob(jobId, "publish");
    return { ok: true, intent: "retry_failed_publish", retried: idsAll.length };
  }

  if (intent === "retry_failed_generate") {
    const itemsJson = String(formData.get("items") || "[]");
    const maybe = safeParse(itemsJson, []);

    let productIds = Array.isArray(maybe)
      ? maybe.map((x) => String(x?.productId || x || "").trim()).filter(Boolean)
      : [];

    if (!productIds.length) {
      const failed = await prisma.seoJobItem.findMany({
        where: { jobId, status: "failed" },
        select: { productId: true },
      });
      productIds = failed.map((f) => String(f.productId));
    }

    if (!productIds.length) return { ok: false, error: "No failed items to retry" };

    const idsAll = Array.from(new Set(productIds.flatMap((p) => productIdVariants(p))));

    const failedCount = await prisma.seoJobItem.count({
      where: { jobId, productId: { in: idsAll }, status: "failed" },
    });

    await prisma.$transaction([
      prisma.seoJobItem.updateMany({
        where: { jobId, productId: { in: idsAll } },
        data: {
          status: "queued",
          error: null,
          startedAt: null,
          finishedAt: null,
        },
      }),
      prisma.seoJob.update({
        where: { id: jobId },
        data: {
          status: "queued",
          phase: "generating",
          finishedAt: null,
          startedAt: new Date(),
          lastError: null,
          ...(failedCount ? { failedCount: { decrement: failedCount } } : {}),
        },
      }),
    ]);

    await enqueueSeoJob(jobId, "generate");
    return { ok: true, intent: "retry_failed_generate", retried: idsAll.length };
  }
  if (intent === "start_publish_all") {
    await prisma.seoJobItem.updateMany({
      where: { jobId },
      data: { publishStatus: "queued", publishError: null, publishedAt: null },
    });

    await prisma.seoJob.update({
      where: { id: jobId },
      data: {
        phase: "publishing",
        status: "queued",
        publishStartedAt: new Date(),
        publishFinishedAt: null,
        publishOkCount: 0,
        publishFailedCount: 0,
        lastError: null,
      },
    });

    await enqueueSeoJob(jobId, "publish");
    return { ok: true };
  }

  return { ok: false, error: "Unknown intent" };
}

/** ---------------- helpers ---------------- */
function normalizePhase(phase) {
  return String(phase || "").toLowerCase();
}
function normalizeStatus(status) {
  return String(status || "").toLowerCase();
}

function outputsLabel(job) {
  const jt = String(job?.jobType || "PRODUCT_SEO");
  if (jt === "ALT_TEXT_IMAGES") return "ALT text";
  const parts = [];
  const mt = Boolean(job?.metaTitle ?? true);
  const md = Boolean(job?.metaDescription ?? true);
  if (mt) parts.push("Title");
  if (md) parts.push("Description");
  return parts.length ? parts.join(" + ") : "—";
}

/**
 * Badge Rules:
 * - UI değişti ama save draft yapılmadı -> Edited
 * - Save draft yapıldı (publish'ten sonra aktif draft varsa) -> Draft saved
 * - Publish oldu (edit yoksa) -> Published
 * - Publish olup sonra tekrar değişti -> Edited
 *
 * Not: Draft saved tespiti "Save draft'a basıldığı an" üzerinden yapılır (en stabil).
 */
function computeSingleBadge({
  pid,
  fields,
  draftEdits,
  draftSavedSnapshot, // ✅ Save draft anındaki snapshot
  publishedBaseline,  // ✅ Shopify'daki canlı (published) değerler
  publishStatus,
  dbPublishedAt,
}) {
  const ps = String(publishStatus || "").toLowerCase();

  const publishRunning = isPublishRunningStatus(ps);
  const publishFailed = ps === "failed";
  const publishedAtMs = toMs(dbPublishedAt);
  const isPublished = isPublishSuccessStatus(ps) || Boolean(publishedAtMs);

  // Save draft snapshot (en güvenilir "draft saved" işareti)
  const snap = draftSavedSnapshot?.[pid] || {};
  const snapSavedAtMs = toMs(snap?.draftSavedAt);

  // Current UI
  const cur = draftEdits?.[pid] || {};
  const curTitle = String(cur?.seoTitle ?? "");
  const curDesc = String(cur?.seoDescription ?? "");

  // Snapshot baseline (save draft'e basılan en son hal)
  const snapTitle = String(snap?.seoTitle ?? "");
  const snapDesc = String(snap?.seoDescription ?? "");

  // Shopify'daki canlı/published baseline
  const pubTitle = String(publishedBaseline?.seoTitle ?? "");
  const pubDesc = String(publishedBaseline?.seoDescription ?? "");

  const DRAFT_AFTER_PUBLISH_GAP_MS = 1500;
  const hasDraftSavedAfterPublish =
    Boolean(snapSavedAtMs) && Boolean(publishedAtMs) && snapSavedAtMs > publishedAtMs + DRAFT_AFTER_PUBLISH_GAP_MS;

  const differsFromSnapshot =
    (fields.metaTitle ? curTitle !== snapTitle : false) ||
    (fields.metaDescription ? curDesc !== snapDesc : false);

  const differsFromPublished =
    (fields.metaTitle ? curTitle !== pubTitle : false) ||
    (fields.metaDescription ? curDesc !== pubDesc : false);

  if (publishRunning) return { tone: "info", label: "Publishing" };
  if (publishFailed) return { tone: "critical", label: "Failed" };

  // NOTE:
  // We don't show a separate "Selected" badge state.
  // Selection is a UI control; status badges should reflect content state (Published/Edited/etc.).

  // ✅ Publish sonrası Save Draft senaryosu:
  // - Publish olduktan sonra draft kaydedildiyse: UI snapshot'tan farklıysa Edited, aynıysa Draft saved.
  if (isPublished && hasDraftSavedAfterPublish) {
    if (differsFromSnapshot) return { tone: "warning", label: "Edited" };
    return { tone: "info", label: "Draft saved" };
  }

  // ✅ Publish olduktan sonra UI değiştiyse Edited, değilse Published
  if (isPublished) {
    if (differsFromPublished) return { tone: "warning", label: "Edited" };
    return { tone: "success", label: "Published" };
  }

  // ✅ Publish yokken: UI snapshot'tan farklıysa Edited
  if (differsFromSnapshot) return { tone: "warning", label: "Edited" };

  // ✅ Draft saved (publish yokken)
  if (snapSavedAtMs) return { tone: "info", label: "Draft saved" };

  // If DB says it was skipped and there is no meaningful edit/draft, keep it as Not selected.
  // (Selection in the UI should not introduce a new badge state.)
  if (ps === "skipped") return { tone: "subdued", label: "Not selected" };

  return { tone: "attention", label: "Unpublished" };
}

// Image badge uses DB current alt text (stored in seoDescription) as baseline,
// so after publish the badge correctly becomes Published instead of staying Edited.
function computeImageBadge({ draftAlt, currentAlt, publishStatus, dbPublishedAt }) {
  const ps = String(publishStatus || "").toLowerCase();
  const publishRunning = isPublishRunningStatus(ps);
  const publishFailed = ps === "failed";
  const publishedAtMs = toMs(dbPublishedAt);
  const isPublished = isPublishSuccessStatus(ps) || Boolean(publishedAtMs);

  const draft = String(draftAlt ?? "").trim();
  const cur = String(currentAlt ?? "").trim();
  const isEdited = draft !== cur;

  if (publishRunning) return { tone: "info", label: "Publishing" };
  if (publishFailed) return { tone: "critical", label: "Failed" };

  if (isEdited) return { tone: "warning", label: "Edited" };

  if (isPublished) return { tone: "success", label: "Published" };
  if (ps === "skipped") return { tone: "subdued", label: "Not selected" };
  return { tone: "attention", label: "Unpublished" };
}


/** ---------------- component ---------------- */
export default function GenerationDetails() {
  const { jobId } = useParams();
  hookupJobIdGuard(jobId);

  // Loader returns job + liveSeoMap + settings (from metafield). We use settings for preview/quality.
  const { job: jobFromLoader, liveSeoMap, settings } = useLoaderData();

  const poller = useFetcher();
  const actionFetcher = useFetcher();

  const location = useLocation();
  const navigate = useNavigate();

  const [draftEdits, setDraftEdits] = useState({});
  const [draftSavedSnapshot, setDraftSavedSnapshot] = useState({});
  const [publishedMap, setPublishedMap] = useState({});
  const [selected, setSelected] = useState({});
  const [showCompare, setShowCompare] = useState(true);
  const [showFailedOnly, setShowFailedOnly] = useState(false);
  const [applyOnlyChanged, setApplyOnlyChanged] = useState(true);

  // P1-7: toast UX
  const [toast, setToast] = useState(null);

  // P1-8: show completion toast only once per phase
  const genDoneToastRef = useRef(false);
  const pubDoneToastRef = useRef(false);

  // ✅ Polling: action sürerken poll yok (fetch abort/crash önler)
  useEffect(() => {
    const t = setInterval(() => {
      if (actionFetcher.state !== "idle") return;
      if (poller.state !== "idle") return;
      poller.load(`${location.pathname}${location.search || ""}`);
    }, 2500);

    return () => clearInterval(t);
  }, [poller, poller.state, location.pathname, location.search, actionFetcher.state]);

  const job = useMemo(() => {
    const d = poller.data;
    if (d && typeof d === "object" && d.job) return d.job;
    return jobFromLoader;
  }, [poller.data, jobFromLoader]);

  // P1-7: after actions, refresh fast + show toast
  useEffect(() => {
    const d = actionFetcher.data;
    if (!d || typeof d !== "object") return;

    if (d.ok) {
      // If server created a new job, jump to it.
      if (d.newJobId) {
        try {
          navigate(`/app/generation-history/${String(d.newJobId)}${backSearch}`);
        } catch {}
        return;
      }

      const msg =
        d.intent === "save_draft_selected"
          ? "Draft saved"
          : d.intent === "publish_selected"
            ? `Apply queued (${Number(d.queued || 0)})${Number(d.skipped || 0) ? `, skipped (${Number(d.skipped || 0)} no changes)` : ""}`
          : d.intent === "regenerate_selected"
            ? "Regenerate queued (new job)"
            : d.intent === "regenerate_failed"
              ? "Regenerate failed queued (new job)"
          : d.intent === "retry_failed_publish"
            ? `Retry queued (${Number(d.retried || 0)})`
            : d.intent === "retry_failed_generate"
              ? `Retry queued (${Number(d.retried || 0)})`
              : d.intent === "retry_job_publish"
                ? "Retry apply queued"
                : d.intent === "retry_job_generate"
                  ? "Retry generate queued"
              : "Action queued";

      setToast({ content: msg, error: false });

      // immediate refresh + short burst polling for snappier progress
      try {
        poller.load(`${location.pathname}${location.search || ""}`);
      } catch {}

      let ticks = 0;
      const t = setInterval(() => {
        ticks += 1;
        if (ticks > 6) {
          clearInterval(t);
          return;
        }
        if (poller.state !== "idle") return;
        poller.load(`${location.pathname}${location.search || ""}`);
      }, 1500);

      return () => clearInterval(t);
    }

    if (d.error) {
      setToast({ content: String(d.error), error: true });
    }
  }, [actionFetcher.data]);


  // poller ile liveSeoMap geldikçe güncelle
  useEffect(() => {
    const d = poller.data;
    if (d && typeof d === "object" && d.liveSeoMap) {
      setPublishedMap(d.liveSeoMap || {});
    }
  }, [poller.data]);

  const loading = !job;

  const isImageJob = useMemo(() => String(job?.jobType || "PRODUCT_SEO") === "ALT_TEXT_IMAGES", [job?.jobType]);

  const itemKey = useCallback(
    (it) => {
      if (!it) return "";
      return isImageJob ? String(it.id || "") : String(it.productId || "");
    },
    [isImageJob],
  );

  const fields = useMemo(() => {
    const metaTitle = job ? Boolean(job?.metaTitle ?? true) : true;
    const metaDescription = job ? Boolean(job?.metaDescription ?? true) : true;
    if (!metaTitle && !metaDescription) return { metaTitle: true, metaDescription: true };
    return { metaTitle, metaDescription };
  }, [job]);

  const items = useMemo(() => (Array.isArray(job?.items) ? job.items : []), [job?.items]);

  const hydratedRef = useRef(false);

  useEffect(() => {
    hydratedRef.current = false;
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    setDraftEdits({});
    setDraftSavedSnapshot({});
    setPublishedMap(liveSeoMap || {});

    setSelected((prev) => {
      const hasAny = prev && Object.keys(prev).length > 0;
      if (hasAny) return prev;

      const sel = {};
      const its = Array.isArray(job?.items) ? job.items : [];
      for (const it of its) {
        const k = itemKey(it);
        if (!k) continue;
        const ps = String(it?.publishStatus || "").toLowerCase();
        // If DB says this item was not selected for publish, reflect that in the UI selection.
        sel[k] = ps === "skipped" ? false : true;
      }
      return sel;
    });
  }, [jobId, job?.items, liveSeoMap]);

  useEffect(() => {
    if (!items.length) return;

    setSelected((prev) => {
      const next = { ...(prev || {}) };
      let changed = false;

      for (const it of items) {
        const k = itemKey(it);
        if (!k) continue;
        if (next[k] === undefined) {
          const ps = String(it?.publishStatus || "").toLowerCase();
          next[k] = ps === "skipped" ? false : true;
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [items]);

  const selectedIds = useMemo(() => {
    return items
      .map((it) => itemKey(it))
      .filter((k) => k && Boolean(selected[k]));
  }, [items, selected, itemKey]);



  const failedPublishSelectedCount = useMemo(() => {
    return items.filter((it) => {
      const k = itemKey(it);
      return k && Boolean(selected[k]) && String(it?.publishStatus || "").toLowerCase() === "failed";
    }).length;
  }, [items, selected, itemKey]);

  const failedGenerateSelectedCount = useMemo(() => {
    return items.filter((it) => {
      const k = itemKey(it);
      return k && Boolean(selected[k]) && String(it?.status || "").toLowerCase() === "failed";
    }).length;
  }, [items, selected, itemKey]);
  const allSelected = selectedIds.length === items.length && items.length > 0;

  const toggleAll = useCallback(() => {
    const next = {};
    const newVal = !allSelected;
    for (const it of items) {
      const k = itemKey(it);
      if (!k) continue;
      next[k] = newVal;
    }
    setSelected(next);
  }, [allSelected, items, itemKey]);

  const toggleOne = useCallback((k) => {
    setSelected((prev) => ({
      ...(prev || {}),
      [String(k)]: !prev?.[String(k)],
    }));
  }, []);

  const setDraftField = useCallback((k, field, value) => {
    setDraftEdits((prev) => {
      const p = String(k);
      const cur = prev?.[p] || { seoTitle: "", seoDescription: "", draftSavedAt: null };
      return {
        ...(prev || {}),
        [p]: { ...cur, [field]: value },
      };
    });
  }, []);

  // ✅ İlk hydrate: hem draftEdits hem snapshot'ı DB’deki değerlerle doldur (baseline stabil olsun)
  useEffect(() => {
    if (!jobId) return;
    if (!items.length) return;

    // draftEdits
    setDraftEdits((prev) => {
      const next = { ...(prev || {}) };
      for (const it of items) {
        const pid = itemKey(it);
        if (!pid) continue;

        const existing = next[pid] || {};
        const nextTitle =
          (existing.seoTitle ?? "") !== "" ? existing.seoTitle : String(it.seoTitle ?? "");
        const nextDesc =
          (existing.seoDescription ?? "") !== ""
            ? existing.seoDescription
            : String(it.seoDescription ?? "");

        next[pid] = {
          seoTitle: nextTitle || "",
          seoDescription: nextDesc || "",
          draftSavedAt: existing.draftSavedAt || null,
        };
      }
      return next;
    });

    // snapshot baseline
    setDraftSavedSnapshot((prev) => {
      const next = { ...(prev || {}) };
      for (const it of items) {
        const pid = itemKey(it);
        if (!pid) continue;
        if (!next[pid]) {
          next[pid] = {
            seoTitle: String(it.seoTitle ?? ""),
            seoDescription: String(it.seoDescription ?? ""),
            draftSavedAt: null,
          };
        }
      }
      return next;
    });
  }, [jobId, items, itemKey]);

  const saveDraftSelected = useCallback(() => {
    if (!jobId) return;
    if (!selectedIds.length) return;

    const now = nowIso();

    const payload = selectedIds.map((k) => {
      const edit = draftEdits?.[k] || {};
      if (isImageJob) {
        return {
          id: String(k),
          seoTitle: String(edit.seoTitle ?? ""),
        };
      }
      return {
        productId: String(k),
        seoTitle: fields.metaTitle ? String(edit.seoTitle ?? "") : null,
        seoDescription: fields.metaDescription ? String(edit.seoDescription ?? "") : null,
      };
    });

    // ✅ sadece save_draft_selected gönderiyoruz
    const fd = new FormData();
    fd.set("intent", "save_draft_selected");
    fd.set("items", JSON.stringify(payload));
    actionFetcher.submit(fd, { method: "post" });

    // ✅ snapshot'ı payload ile kilitle (badge için gerçek baseline)
    setDraftSavedSnapshot((prev) => {
      const next = { ...(prev || {}) };
      for (const row of payload) {
        const key = isImageJob ? String(row.id || "") : String(row.productId || "");
        if (!key) continue;
        const prevItem = next[key] || {};
        next[key] = {
          ...prevItem,
          seoTitle: row.seoTitle == null ? String(prevItem.seoTitle ?? "") : String(row.seoTitle),
          seoDescription:
            isImageJob
              ? String(prevItem.seoDescription ?? "")
              : row.seoDescription == null
                ? String(prevItem.seoDescription ?? "")
                : String(row.seoDescription),
          draftSavedAt: now,
        };
      }
      return next;
    });

    // ✅ UI state'e de draftSavedAt yaz (görsel tutarlılık)
    setDraftEdits((prev) => {
      const next = { ...(prev || {}) };
      for (const k of selectedIds) {
        const cur = next[k] || { seoTitle: "", seoDescription: "", draftSavedAt: null };
        next[k] = { ...cur, draftSavedAt: now };
      }
      return next;
    });
  }, [jobId, selectedIds, draftEdits, fields, actionFetcher, isImageJob]);

  const publishSelected = useCallback(() => {
    if (!jobId) return;
    if (!selectedIds.length) return;

    const payload = selectedIds.map((k) => {
      const it = items.find((x) => itemKey(x) === String(k));
      const baseTitle = String(it?.seoTitle ?? "");
      const baseDesc = String(it?.seoDescription ?? "");
      const edit = draftEdits?.[k] || {};

      if (isImageJob) {
        return {
          id: String(k),
          seoTitle: String(edit.seoTitle ?? baseTitle),
        };
      }

      return {
        productId: String(k),
        seoTitle: fields.metaTitle ? String(edit.seoTitle ?? baseTitle) : null,
        seoDescription: fields.metaDescription ? String(edit.seoDescription ?? baseDesc) : null,
      };
    });

    const fd = new FormData();
    fd.set("intent", "publish_selected");
    fd.set("items", JSON.stringify(payload));
    fd.set("onlyChanged", applyOnlyChanged ? "true" : "false");
    actionFetcher.submit(fd, { method: "post" });
  }, [jobId, selectedIds, draftEdits, fields, actionFetcher, items, applyOnlyChanged, isImageJob, itemKey]);

  const regenerateSelected = useCallback((onlyFailed = false) => {
    if (!jobId) return;

    let targetIds = [];
    if (onlyFailed) {
      // If onlyFailed, regenerate failed items (optionally only within selected)
      targetIds = items
        .filter((it) => String(it?.status || "").toLowerCase() === "failed")
        .filter((it) => {
          const pid = String(it?.productId || "");
          return pid && (selected[pid] || !selectedIds.length);
        })
        .map((it) => String(it.productId));
    } else {
      targetIds = [...selectedIds];
    }

    const payload = targetIds.map((pid) => ({ productId: String(pid) }));
    const fd = new FormData();
    fd.set("intent", onlyFailed ? "regenerate_failed" : "regenerate_selected");
    fd.set("items", JSON.stringify(payload));
    actionFetcher.submit(fd, { method: "post" });
  }, [jobId, selectedIds, selected, items, actionFetcher]);

  const retryFailedPublish = useCallback((onlySelected = true) => {
    if (!jobId) return;

    const failed = items.filter((it) => {
      if (String(it?.publishStatus || "").toLowerCase() !== "failed") return false;
      if (!onlySelected) return true;
      const pid = String(it?.productId || "");
      return pid && Boolean(selected[pid]);
    });

    const payload = failed.map((it) => ({ productId: String(it.productId) }));
    const fd = new FormData();
    fd.set("intent", "retry_failed_publish");
    fd.set("items", JSON.stringify(payload));
    actionFetcher.submit(fd, { method: "post" });
  }, [jobId, items, selected, actionFetcher]);

  const retryFailedGenerate = useCallback((onlySelected = true) => {
    if (!jobId) return;

    const failed = items.filter((it) => {
      if (String(it?.status || "").toLowerCase() !== "failed") return false;
      if (!onlySelected) return true;
      const pid = String(it?.productId || "");
      return pid && Boolean(selected[pid]);
    });

    const payload = failed.map((it) => ({ productId: String(it.productId) }));
    const fd = new FormData();
    fd.set("intent", "retry_failed_generate");
    fd.set("items", JSON.stringify(payload));
    actionFetcher.submit(fd, { method: "post" });
  }, [jobId, items, selected, actionFetcher]);


  const backSearch = useMemo(() => buildEmbeddedSearch(location.search), [location.search]);

  const phase = normalizePhase(job?.phase);
  const status = normalizeStatus(job?.status);

  const isStuck = status === "stuck";
  const isGeneratingPhase = phase === "generating";
  const isPublishingPhase = phase === "publishing";

  const retryWholeJob = useCallback(
    (which) => {
      if (!jobId) return;
      const fd = new FormData();
      fd.set("intent", which === "publish" ? "retry_job_publish" : "retry_job_generate");
      actionFetcher.submit(fd, { method: "post" });
    },
    [jobId, actionFetcher],
  );

  // ✅ Publishing progress total = skipped olmayanlar (seçilenler)
  const publishTotal = useMemo(() => {
    if (!items.length) return 0;
    const nonSkipped = items.filter(
      (it) => String(it?.publishStatus || "").toLowerCase() !== "skipped",
    ).length;
    return nonSkipped || items.length;
  }, [items]);

  // P1-8: compute summaries
  const genOk = Number(job?.okCount ?? 0);
  const genFailed = Number(job?.failedCount ?? 0);
  const total = Number(job?.total ?? items.length ?? 0);
  const genProcessed = genOk + genFailed;
  const genDone = total > 0 && genProcessed >= total && (phase === "generating" || phase === "generated" || phase === "publishing" || phase === "published");

  const pubOk = Number(job?.publishOkCount ?? 0);
  const pubFailed = Number(job?.publishFailedCount ?? 0);
  const pubProcessed = pubOk + pubFailed;
  const pubDone = publishTotal > 0 && pubProcessed >= publishTotal && (phase === "publishing" || phase === "published");

  // P1-8: completion toast (once)
  useEffect(() => {
    if (genDone && !genDoneToastRef.current) {
      genDoneToastRef.current = true;
      const msg = genFailed > 0 ? `Generation finished: ${genOk}/${total} succeeded, ${genFailed} failed` : `Generation finished: ${genOk}/${total} succeeded`;
      setToast({ content: msg, error: genFailed > 0 });
    }
  }, [genDone, genOk, genFailed, total]);

  useEffect(() => {
    if (pubDone && !pubDoneToastRef.current) {
      pubDoneToastRef.current = true;
      const msg = pubFailed > 0 ? `Apply finished: ${pubOk}/${publishTotal} succeeded, ${pubFailed} failed` : `Apply finished: ${pubOk}/${publishTotal} succeeded`;
      setToast({ content: msg, error: pubFailed > 0 });
    }
  }, [pubDone, pubOk, pubFailed, publishTotal]);

  const visibleItems = useMemo(() => {
    if (!showFailedOnly) return items;
    if (phase === "publishing" || phase === "published") {
      return items.filter((it) => String(it?.publishStatus || "").toLowerCase() === "failed");
    }
    return items.filter((it) => String(it?.status || "").toLowerCase() === "failed");
  }, [items, showFailedOnly, phase]);

  const progressText = useMemo(() => {
    if (!job) return "";
    const total = Number(job?.total ?? items.length ?? 0);

    if (phase === "publishing" || phase === "published") {
      const processed = Number(job?.publishOkCount ?? 0) + Number(job?.publishFailedCount ?? 0);
      if (phase === "publishing") return `${processed}/${publishTotal} Published`;
      return `${publishTotal}/${publishTotal} Published`;
    }

    const processed = Number(job?.okCount ?? 0) + Number(job?.failedCount ?? 0);
    if (phase === "generating") return `${processed}/${total} Generated`;
    return `${total}/${total} Generated`;
  }, [job, items.length, phase, publishTotal]);

  const topStatusBar = useMemo(() => {
    if (!job) return null;

    if (phase === "publishing") {
      return (
        <Banner tone="info" title="Publishing in progress">
          <Text as="p" variant="bodyMd">
            {progressText}
          </Text>
        </Banner>
      );
    }

    if (status === "failed") {
      return (
        <Banner tone="critical" title="Job failed">
          <Text as="p" variant="bodyMd">
            Please check logs and try again.
          </Text>
        </Banner>
      );
    }

    return null;
  }, [job, phase, status, progressText]);

  if (loading) {
    return (
      <Frame>
        <Page title="Generation Details" fullWidth>
          <Layout>
            <Layout.Section>
              <Card>
                <Box padding="400">
                  <InlineStack gap="200" blockAlign="center">
                    <Spinner size="small" />
                    <Text as="span" variant="bodyMd">
                      Loading…
                    </Text>
                  </InlineStack>
                </Box>
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      </Frame>
    );
  }

  return (
    <Frame>
      {toast ? (
        <Toast content={toast.content} error={toast.error} onDismiss={() => setToast(null)} />
      ) : null}
      <Page
        title="Generation Details"
        subtitle={`Job: #${jobId || ""}`}
        backAction={{
          content: "Back",
          onAction: () => navigate(`/app/generation-history${backSearch}`),
        }}
        fullWidth
      >
        <BlockStack gap="400">
          {topStatusBar}

          {isStuck ? (
            <Banner
              tone="critical"
              title="Job seems stuck"
              action={
                isPublishingPhase
                  ? { content: "Retry apply", onAction: () => retryWholeJob("publish") }
                  : isGeneratingPhase
                    ? { content: "Retry generate", onAction: () => retryWholeJob("generate") }
                    : { content: "Retry", onAction: () => retryWholeJob("generate") }
              }
              secondaryAction={{
                content: "Export debug report",
                url: `/app/debug-report/${encodeURIComponent(String(jobId || "").trim())}`,
                external: true,
              }}
            >
              <Text as="p" variant="bodyMd">
                We couldn't detect progress for a while. Retrying will resume from where it stopped.
              </Text>
              {job?.lastError ? (
                <Text as="p" tone="subdued" variant="bodySm">
                  {String(job.lastError).slice(0, 220)}
                </Text>
              ) : null}
            </Banner>
          ) : null}

        {/* P1-8: Summary banner + one-click retry */}
        <Banner
          tone={
            (phase === "publishing" || phase === "generating")
              ? "info"
              : (genFailed > 0 || pubFailed > 0)
                ? "warning"
                : "success"
          }
          title="Summary"
        >
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              {`Generation: ${genOk}/${total} succeeded, ${genFailed} failed`}
            </Text>
            {(phase === "publishing" || phase === "published") ? (
              <Text as="p" variant="bodyMd">
                {`Apply: ${pubOk}/${publishTotal} succeeded, ${pubFailed} failed`}
              </Text>
            ) : null}

            <InlineStack gap="200" wrap>
              <Button
                variant="secondary"
                onClick={() => setShowFailedOnly((v) => !v)}
                disabled={items.length === 0}
              >
                {showFailedOnly ? "Show all items" : "Show failed only"}
              </Button>

              {genFailed > 0 ? (
                <Button
                  variant="secondary"
                  onClick={() => retryFailedGenerate(false)}
                  disabled={actionFetcher.state !== "idle"}
                >
                  {`Retry all failed generate (${genFailed})`}
                </Button>
              ) : null}

              {pubFailed > 0 ? (
                <Button
                  variant="secondary"
                  onClick={() => retryFailedPublish(false)}
                  disabled={actionFetcher.state !== "idle"}
                >
                  {`Retry all failed apply (${pubFailed})`}
                </Button>
              ) : null}
            </InlineStack>
          </BlockStack>
        </Banner>

        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200" blockAlign="center">
                <Text as="h2" variant="headingMd">
                  Generated Results
                </Text>
                <Badge tone="info">{`Outputs: ${outputsLabel(job)}`}</Badge>
              </InlineStack>

              <InlineStack gap="200">
                <Button variant="secondary" onClick={toggleAll} disabled={items.length === 0}>
                  {allSelected ? "Unselect all" : "Select all"}
                </Button>


                <Button
                  variant="secondary"
                  onClick={() => setShowCompare((v) => !v)}
                  disabled={items.length === 0 || isImageJob}
                >
                  {showCompare ? "Hide compare" : "Show compare"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={saveDraftSelected}
                  disabled={selectedIds.length === 0 || actionFetcher.state !== "idle"}
                >
                  Save draft
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => regenerateSelected(false)}
                  disabled={isImageJob || selectedIds.length === 0 || actionFetcher.state !== "idle"}
                >
                  Regenerate selected (new job)
                </Button>

                {genFailed > 0 ? (
                  <Button
                    variant="secondary"
                    onClick={() => regenerateSelected(true)}
                    disabled={isImageJob || actionFetcher.state !== "idle"}
                  >
                    Regenerate failed (new job)
                  </Button>
                ) : null}

                {failedGenerateSelectedCount > 0 ? (
                  <Button
                    variant="secondary"
                    onClick={() => retryFailedGenerate(true)}
                    disabled={isImageJob || actionFetcher.state !== "idle"}
                  >
                    Retry failed generate ({failedGenerateSelectedCount})
                  </Button>
                ) : null}

                {failedPublishSelectedCount > 0 ? (
                  <Button
                    variant="secondary"
                    onClick={() => retryFailedPublish(true)}
                    disabled={isImageJob || actionFetcher.state !== "idle"}
                  >
                    Retry failed apply ({failedPublishSelectedCount})
                  </Button>
                ) : null}

                <Box paddingInlineStart="200">
                  <Checkbox
                    label="Only changed"
                    checked={applyOnlyChanged}
                    onChange={(v) => setApplyOnlyChanged(Boolean(v))}
                    disabled={actionFetcher.state !== "idle"}
                  />
                </Box>

                <Button
                  onClick={publishSelected}
                  disabled={selectedIds.length === 0 || actionFetcher.state !== "idle"}
                  loading={actionFetcher.state !== "idle"}
                >
                  Apply selected
                </Button>

                <Button
                  variant="secondary"
                  url={`/app/debug-report/${encodeURIComponent(String(jobId || "").trim())}`}
                  external
                >
                  Export debug report
                </Button>
              </InlineStack>
            </InlineStack>

            <Divider />

            {items.length === 0 ? (
              <Text as="p" tone="subdued">
                No results found for this job.
              </Text>
            ) : (
              <BlockStack gap="400">
                {showFailedOnly && visibleItems.length === 0 ? (
                  <Text as="p" tone="subdued">
                    No failed items.
                  </Text>
                ) : null}

                {visibleItems.map((it) => {
                  const k = itemKey(it);
                  if (!k) return null;

                  const edit = draftEdits?.[k] || {
                    seoTitle: String(it.seoTitle ?? ""),
                    seoDescription: String(it.seoDescription ?? ""),
                    draftSavedAt: null,
                  };

                  if (isImageJob) {
                    const badge = computeImageBadge({
                      draftAlt: edit.seoTitle,
                      currentAlt: it.seoDescription,
                      publishStatus: it.publishStatus,
                      dbPublishedAt: it.publishedAt,
                    });

                    return (
                      <Card key={k} sectioned>
                        <BlockStack gap="200">
                          <InlineStack align="space-between">
                            <InlineStack gap="200" blockAlign="center">
                              <Checkbox label="" checked={Boolean(selected[k])} onChange={() => toggleOne(k)} />
                              <Text as="p" fontWeight="semibold">
                                {it.productTitle || "Image"}
                              </Text>
                              <Badge tone="info">{`Media: ${String(it.mediaId || it.targetId || "").slice(-8)}`}</Badge>
                            </InlineStack>

                            <InlineStack gap="200" blockAlign="center">
                              <Badge tone={badge.tone}>{badge.label}</Badge>
                            </InlineStack>
                          </InlineStack>

                          {it.imageUrl ? (
                            <Box padding="200" background="bg-surface-secondary" borderRadius="200">
                              <img src={it.imageUrl} alt={String(edit.seoTitle || it.seoDescription || it.productTitle || "image")} style={{ maxWidth: 220, height: "auto", borderRadius: 8 }} />
                            </Box>
                          ) : null}

                          <TextField
                            label="ALT text"
                            value={String(edit.seoTitle ?? "")}
                            onChange={(v) => setDraftField(k, "seoTitle", v)}
                            autoComplete="off"
                            helpText={it.seoDescription ? `Current ALT: ${String(it.seoDescription)}` : "Current ALT is empty"}
                          />

                          <InlineStack align="space-between" blockAlign="center">
                            <Text as="p" variant="bodySm" tone="subdued">
                              {`Product: ${it.productTitle || ""}`}
                            </Text>
                          </InlineStack>
                        </BlockStack>
                      </Card>
                    );
                  }

                  const pid = String(it.productId || "");
                  const gid = toProductGid(pid);
                  const live = publishedMap?.[gid] || liveSeoMap?.[gid] || { seoTitle: "", seoDescription: "" };
                  const liveTitle = String(live?.seoTitle ?? "");
                  const liveDesc = String(live?.seoDescription ?? "");
                  const draftTitle = String(edit.seoTitle ?? "");
                  const draftDesc = String(edit.seoDescription ?? "");
                  const willChangeTitle = fields.metaTitle ? draftTitle !== liveTitle : false;
                  const willChangeDesc = fields.metaDescription ? draftDesc !== liveDesc : false;

                  const q = computeQuality({ title: draftTitle, desc: draftDesc, settings });
                  const qTone = q.score >= 80 ? "success" : q.score >= 60 ? "warning" : "critical";

                  const badge = computeSingleBadge({
                    pid,
                    publishStatus: it.publishStatus,
                    dbPublishedAt: it.publishedAt,
                    draftEdits,
                    draftSavedSnapshot,
                    publishedBaseline: live,
                    fields,
                  });

                  return (
                    <Card key={pid} sectioned>
                      <BlockStack gap="200">
                        <InlineStack align="space-between">
                          <InlineStack gap="200" blockAlign="center">
                            <Checkbox
                              label=""
                              checked={Boolean(selected[pid])}
                              onChange={() => toggleOne(pid)}
                            />
                            <Text as="p" fontWeight="semibold">
                              {it.productTitle || `Product #${pid}`}
                            </Text>
                            <Badge tone="info">{`ID: ${pid}`}</Badge>
                          </InlineStack>

                          <InlineStack gap="200" blockAlign="center">
                            <Badge tone={badge.tone}>{badge.label}</Badge>
                          </InlineStack>
                        </InlineStack>

                        {(Number(it.genAttempts || 0) > 0 ||
                          Number(it.genRetryWaitMs || 0) > 0 ||
                          Number(it.publishAttempts || 0) > 0 ||
                          Number(it.publishRetryWaitMs || 0) > 0) ? (
                          <Text as="p" tone="subdued" variant="bodySm">
                            {`Gen: ${Number(it.genAttempts || 0)} attempt(s), ${Number(
                              it.genRetryWaitMs || 0,
                            )}ms wait • Publish: ${Number(it.publishAttempts || 0)} attempt(s), ${Number(
                              it.publishRetryWaitMs || 0,
                            )}ms wait`}
                          </Text>
                        ) : null}

                        {applyOnlyChanged && Boolean(selected[pid]) && !(willChangeTitle || willChangeDesc) ? (
                          <Text as="p" tone="subdued" variant="bodySm">
                            No changes — this item will be skipped when applying.
                          </Text>
                        ) : null}

                        <BlockStack gap="300">
                          {fields.metaTitle || fields.metaDescription ? (
                            <InlineStack align="space-between" blockAlign="center">
                              <Text as="h3" variant="headingSm">
                                {showCompare ? "Compare & Edit" : "Generated Content"}
                              </Text>

                              {showCompare ? (
                                <InlineStack gap="200" blockAlign="center">
                                  {(willChangeTitle || willChangeDesc) ? (
                                    <Badge tone="warning">Changes pending</Badge>
                                  ) : (
                                    <Badge tone="success">No changes</Badge>
                                  )}

                                  <Button
                                    size="slim"
                                    variant="secondary"
                                    onClick={() => {
                                      setDraftField(pid, "seoTitle", liveTitle);
                                      setDraftField(pid, "seoDescription", liveDesc);
                                    }}
                                    disabled={!liveTitle && !liveDesc}
                                  >
                                    Reset to current
                                  </Button>
                                </InlineStack>
                              ) : null}
                            </InlineStack>
                          ) : null}

                          {showCompare ? (
                            <Layout>
                              <Layout.Section oneHalf>
                                <BlockStack gap="200">
                                  <Text as="p" variant="bodySm" tone="subdued">
                                    Current on Shopify
                                  </Text>

                                  {fields.metaTitle ? (
                                    <TextField
                                      label="SEO Title (current)"
                                      value={liveTitle}
                                      disabled
                                      autoComplete="off"
                                    />
                                  ) : null}

                                  {fields.metaDescription ? (
                                    <TextField
                                      label="SEO Description (current)"
                                      value={liveDesc}
                                      disabled
                                      autoComplete="off"
                                      multiline={4}
                                    />
                                  ) : null}
                                </BlockStack>
                              </Layout.Section>

                              <Layout.Section oneHalf>
                                <BlockStack gap="200">
                                  <Text as="p" variant="bodySm" tone="subdued">
                                    New draft (will be applied)
                                  </Text>

                                  {fields.metaTitle ? (
                                    <TextField
                                      label="SEO Title (new)"
                                      value={draftTitle}
                                      onChange={(val) => setDraftField(pid, "seoTitle", val)}
                                      autoComplete="off"
                                      helpText={`${draftTitle.length}/${q.maxTitle} • ` + (willChangeTitle ? "Will update after publish" : "Same as current")}
                                      error={draftTitle.length > q.maxTitle}
                                    />
                                  ) : null}

                                  {fields.metaDescription ? (
                                    <TextField
                                      label="SEO Description (new)"
                                      value={draftDesc}
                                      onChange={(val) => setDraftField(pid, "seoDescription", val)}
                                      autoComplete="off"
                                      multiline={4}
                                      helpText={`${draftDesc.length}/${q.maxDesc} • ` + (willChangeDesc ? "Will update after publish" : "Same as current")}
                                      error={draftDesc.length > q.maxDesc}
                                    />
                                  ) : null}
                                </BlockStack>
                              </Layout.Section>
                            </Layout>
                          ) : (
                            <>
                              {fields.metaTitle ? (
                                <TextField
                                  label="Generated SEO Title"
                                  value={String(edit.seoTitle ?? "")}
                                  onChange={(val) => setDraftField(pid, "seoTitle", val)}
                                  autoComplete="off"
                                  helpText={`${String(edit.seoTitle ?? "").length}/${q.maxTitle}`}
                                  error={String(edit.seoTitle ?? "").length > q.maxTitle}
                                />
                              ) : null}

                              {fields.metaDescription ? (
                                <TextField
                                  label="Generated SEO Description"
                                  value={String(edit.seoDescription ?? "")}
                                  onChange={(val) => setDraftField(pid, "seoDescription", val)}
                                  autoComplete="off"
                                  multiline={4}
                                  helpText={`${String(edit.seoDescription ?? "").length}/${q.maxDesc}`}
                                  error={String(edit.seoDescription ?? "").length > q.maxDesc}
                                />
                              ) : null}
                            </>
                          )}

                          {!fields.metaTitle && !fields.metaDescription ? (
                            <Text as="p" tone="subdued">
                              No output was selected for this job.
                            </Text>
                          ) : null}

{(fields.metaTitle || fields.metaDescription) ? (
  <Box
    padding="400"
    background="bg-surface-secondary"
    borderColor="border"
    borderWidth="025"
    borderRadius="200"
  >
    <BlockStack gap="300">
      <InlineStack align="space-between" blockAlign="center">
        <Text as="p" variant="bodySm" fontWeight="semibold">
          Preview & Quality
        </Text>
        <Badge tone={qTone}>{`Quality ${q.score}/100`}</Badge>
      </InlineStack>

      <ProgressBar progress={q.score} />

      <BlockStack gap="100">
        <Text as="p" variant="bodySm" fontWeight="semibold">
          Google snippet (approx.)
        </Text>
        <Text as="p" variant="headingSm">
          {clampText(draftTitle || it.productTitle || "", q.maxTitle)}
        </Text>
        <Text as="p" variant="bodySm" tone="subdued">
          {`https://${String(settings?.brandName || "your-store")
            .toLowerCase()
            .replace(/\s+/g, "")}.com/products/...`}
        </Text>
        <Text as="p" variant="bodySm" tone="subdued">
          {clampText(draftDesc || "", q.maxDesc)}
        </Text>
      </BlockStack>

      <Divider />

      <BlockStack gap="100">
        <Text as="p" variant="bodySm" fontWeight="semibold">
          Checklist
        </Text>
        {q.checks.map((c) => (
          <InlineStack key={c.key} align="space-between" blockAlign="center">
            <Text as="span" variant="bodySm">
              {c.label}
            </Text>
            <Badge tone={c.ok ? "success" : "critical"}>{c.ok ? "OK" : "Fix"}</Badge>
          </InlineStack>
        ))}
      </BlockStack>
    </BlockStack>
  </Box>
) : null}



{it.error || it.publishError ? (
                            <Banner tone="critical" title="Error">
                              <p>{String(it.publishError || it.error || "")}</p>
                            </Banner>
                          ) : null}
                        </BlockStack>
                      </BlockStack>
                    </Card>
                  );
                })}
              </BlockStack>
            )}
          </BlockStack>
        </Card>

        <InlineStack align="end">
          <Button variant="secondary" onClick={() => navigate(`/app/generation-history${backSearch}`)}>
            Back to Generation History
          </Button>
        </InlineStack>
        </BlockStack>
      </Page>
    </Frame>
  );
}

function hookupJobIdGuard(_) {
  return _;
}

/** ---------------- route ErrorBoundary ---------------- */
export function ErrorBoundary() {
  const err = useRouteError();
  // eslint-disable-next-line no-console
  console.error("GenerationDetails ErrorBoundary:", err);

  let title = "Generation Details crashed";
  let message = "Unknown error";

  if (isRouteErrorResponse(err)) {
    title = `Error ${err.status}`;
    message = err.data || err.statusText;
  } else if (err instanceof Error) {
    message = err.message;
  } else {
    message = String(err);
  }

  return (
    <Page title="Generation Details" fullWidth>
      <Banner tone="critical" title={title}>
        <Text as="p" variant="bodyMd">
          {message}
        </Text>
      </Banner>
    </Page>
  );
}