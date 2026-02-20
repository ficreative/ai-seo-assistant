

function sanitizeLanguage(input) {
  const raw = String(input || "").trim().toLowerCase();
  const m = raw.match(/^[a-z]{2}/);
  return m ? m[0] : "tr";
}

import prisma from "./db.server.js";
import shopify from "./shopify.server.js";
import crypto from "crypto";
import { enqueueSeoJob, removeSeoQueueJob } from "./queue.server.js";

/**
 * Offline session'ı bul.
 * NOT: Session model adı genelde "Session" => prisma.session doğru.
 * Eğer farklıysa burada düzelt.
 */
export async function getOfflineSessionForShop(shop) {
  const sessionRow = await prisma.session.findFirst({
    where: { shop, isOnline: false },
    orderBy: { expires: "desc" },
  });

  if (!sessionRow?.id) {
    throw new Error(`Offline session not found for shop: ${shop}`);
  }

  const session = await shopify.sessionStorage.loadSession(sessionRow.id);
  if (!session) throw new Error(`Failed to load offline session for shop: ${shop}`);
  return session;
}

function newJobId() {
  return `${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;
}

/**
 * Generate job oluşturur + job items ekler
 */
export async function createGenerateJob({ shop, seed, productIds, productTitlesById = {}, usageReserved = false }) {
  const jobId = newJobId();

    const language = sanitizeLanguage(seed?.language);
  const settingsJson = seed?.settings ? JSON.stringify(seed.settings) : null;

  // şemanda boolean alanlar var (ekrandan)
  const metaTitle = seed?.fields?.metaTitle !== false;
  const metaDescription = seed?.fields?.metaDescription !== false;

  const itemsCreate = (productIds || []).map((pid) => ({
    targetType: "PRODUCT",
    targetId: String(pid),
    productId: String(pid),
    productTitle: productTitlesById[pid] ? String(productTitlesById[pid]) : null,
    status: "queued",
  }));

  const job = await prisma.seoJob.create({
    data: {
      id: jobId,
      shop,
      status: "queued",
      jobType: "PRODUCT_SEO",
      total: productIds.length,
      okCount: 0,
      failedCount: 0,
      language,
      settingsJson,
      metaTitle,
      metaDescription,
      // ✅ Free plan usage reservation bookkeeping (C2)
      usageReserved: Boolean(usageReserved),
      usageCount: Math.max(0, Number(productIds?.length || 0)),
      items: {
        create: itemsCreate,
      },
    },
    include: { items: true },
  });

  return job;
}

/**
 * Alt text job oluşturur + image items ekler
 * - images: [{ productId, productTitle, mediaId, imageUrl, currentAltText }]
 * Draft alt text "seoTitle" alanında tutulur.
 */
export async function createAltTextJob({ shop, seed, images = [], usageReserved = false }) {
  const jobId = newJobId();

    const language = sanitizeLanguage(seed?.language);
  const settingsJson = seed?.settings ? JSON.stringify(seed.settings) : null;

  const itemsCreate = (images || []).map((img) => ({
    targetType: "IMAGE",
    targetId: String(img.mediaId),
    productId: img.productId ? String(img.productId) : null,
    productTitle: img.productTitle ? String(img.productTitle) : null,
    mediaId: String(img.mediaId),
    imageUrl: img.imageUrl ? String(img.imageUrl) : null,
    // store current alt text in seoDescription for diff/only-changed checks
    seoDescription: img.currentAltText ? String(img.currentAltText) : null,
    status: "queued",
  }));

  const job = await prisma.seoJob.create({
    data: {
      id: jobId,
      shop,
      status: "queued",
      jobType: "ALT_TEXT_IMAGES",
      total: images.length,
      okCount: 0,
      failedCount: 0,
      language,
      settingsJson,
      // meta flags not used for images but keep schema happy
      metaTitle: true,
      metaDescription: false,
      usageReserved: Boolean(usageReserved),
      usageCount: Math.max(0, Number(images?.length || 0)),
      items: { create: itemsCreate },
    },
    include: { items: true },
  });

  return job;
}


export async function createBlogMetaJob({ shop, seed, articles = [], usageReserved = false }) {
  const jobId = newJobId();

    const language = sanitizeLanguage(seed?.language);
  const settingsJson = seed?.settings ? JSON.stringify(seed.settings) : null;

  const itemsCreate = (articles || []).map((a) => ({
    targetType: "BLOG_ARTICLE",
    targetId: String(a.articleId),
    // Reuse product fields for UI convenience
    productId: String(a.articleId),
    productTitle: a.title ? String(a.title) : null,
    // store current SEO description in seoDescription? We keep draft in seoTitle/seoDescription;
    // current values are fetched live in the Details loader for only-changed checks.
    status: "queued",
  }));

  const job = await prisma.seoJob.create({
    data: {
      id: jobId,
      shop,
      status: "queued",
      jobType: "BLOG_SEO_META",
      total: articles.length,
      okCount: 0,
      failedCount: 0,
      language,
      settingsJson,
      metaTitle: true,
      metaDescription: true,
      usageReserved: Boolean(usageReserved),
      usageCount: Math.max(0, Number(articles?.length || 0)),
      items: { create: itemsCreate },
    },
    include: { items: true },
  });

  return job;
}


/**
 * Publish başlatma (şemanı bilmeden minimum güvenli)
 * - Job status'ü queued'a çeker
 * - lastError temizler
 * - Item status'lerini queued'a çeker (varsa)
 */
export async function startPublishPhase({ jobId }) {
  const job = await prisma.seoJob.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("Job not found");

  await prisma.seoJob.update({
    where: { id: jobId },
    data: {
      status: "queued",
      lastError: null,
      // Item tarafında sadece status alanı kesin, onu resetliyoruz:
      items: {
        updateMany: {
          where: { jobId },
          data: { status: "queued" },
        },
      },
    },
  });

  return true;
}

export async function getJobsForShop(shop, options = {}) {
  const {
    limit = 50,
    cursor = null,
    status = null,
    phase = null,
    jobType = null,
    q = null,
    sort = "createdAt_desc",
  } = options || {};

  const where = { shop };

  const statusNorm = status ? String(status).toLowerCase() : "";
  if (statusNorm) {
    where.status = statusNorm;
  }

  const phaseNorm = phase ? String(phase).toLowerCase() : "";
  if (phaseNorm) {
    where.phase = phaseNorm;
  }

  const jobTypeNorm = jobType ? String(jobType).toUpperCase() : "";
  if (jobTypeNorm) {
    where.jobType = jobTypeNorm;
  }

  const qStr = q ? String(q).trim() : "";
  if (qStr) {
    // Job ID search (safe + fast)
    where.id = { contains: qStr };
  }

  const orderBy = (() => {
    const s = String(sort || "").toLowerCase();
    if (s === "createdat_asc") return { createdAt: "asc" };
    if (s === "status_asc") return [{ status: "asc" }, { createdAt: "desc" }];
    if (s === "status_desc") return [{ status: "desc" }, { createdAt: "desc" }];
    if (s === "phase_asc") return [{ phase: "asc" }, { createdAt: "desc" }];
    if (s === "phase_desc") return [{ phase: "desc" }, { createdAt: "desc" }];
    return { createdAt: "desc" };
  })();

  const take = Math.min(100, Math.max(1, Number(limit) || 50));

  const query = {
    where,
    orderBy,
    take,
  };

  if (cursor) {
    query.cursor = { id: String(cursor) };
    query.skip = 1;
  }

  const jobs = await prisma.seoJob.findMany(query);

  const nextCursor = jobs.length === take ? String(jobs[jobs.length - 1].id) : null;

  return { jobs, nextCursor, take };
}


export async function getJobWithItems(shop, jobId) {
  return prisma.seoJob.findFirst({
    where: { id: jobId, shop },
    include: {
      items: {
        // createdAt yoksa Prisma hata verir; o yüzden orderBy'ı kaldırıyoruz.
        // Eğer SeoJobItem modelinde createdAt varsa tekrar ekleriz.
      },
    },
  });
}

/**
 * Retry failed items for a job.
 * - kind: "generate" | "publish" (optional). If not provided, inferred from job.phase.
 * - Resets failed items back to queued and normalizes counters so progress won't exceed total.
 * - Re-enqueues the BullMQ job so the worker processes the remaining failed items.
 */
export async function retryFailedForJob({ shop, jobId, kind = null }) {
  const job = await prisma.seoJob.findFirst({ where: { id: String(jobId || ""), shop } });
  if (!job) throw new Error("Job not found");

  const phase = String(job.phase || "").toLowerCase();
  const inferredKind = kind || (phase === "publishing" || phase === "published" ? "publish" : "generate");

  if (inferredKind === "publish") {
    const failedItems = await prisma.seoJobItem.count({
      where: { jobId: job.id, publishStatus: "failed" },
    });

    if (!failedItems) {
      return { ok: true, message: "No failed publish items to retry.", kind: "publish" };
    }

    await prisma.seoJobItem.updateMany({
      where: { jobId: job.id, publishStatus: "failed" },
      data: { publishStatus: "queued", publishError: null, publishedAt: null },
    });

    const publishOk = await prisma.seoJobItem.count({
      where: { jobId: job.id, publishStatus: "success" },
    });

    await prisma.seoJob.update({
      where: { id: job.id },
      data: {
        status: "queued",
        phase: "publishing",
        lastError: null,
        publishOkCount: publishOk,
        publishFailedCount: 0,
        publishStartedAt: null,
        publishFinishedAt: null,
        lockOwner: null,
        lockExpiresAt: null,
      },
    });

    await enqueueSeoJob(job.id, "publish");
    return { ok: true, message: `Retry started for ${failedItems} failed publish item(s).`, kind: "publish" };
  }

  const failedItems = await prisma.seoJobItem.count({
    where: { jobId: job.id, status: "failed" },
  });

  if (!failedItems) {
    return { ok: true, message: "No failed generation items to retry.", kind: "generate" };
  }

  await prisma.seoJobItem.updateMany({
    where: { jobId: job.id, status: "failed" },
    data: { status: "queued", error: null, startedAt: null, finishedAt: null },
  });

  const ok = await prisma.seoJobItem.count({
    where: { jobId: job.id, status: "success" },
  });

  await prisma.seoJob.update({
    where: { id: job.id },
    data: {
      status: "queued",
      phase: "generating",
      lastError: null,
      okCount: ok,
      failedCount: 0,
      startedAt: null,
      finishedAt: null,
      lockOwner: null,
      lockExpiresAt: null,
    },
  });

  await enqueueSeoJob(job.id, "generate");
  return { ok: true, message: `Retry started for ${failedItems} failed generation item(s).`, kind: "generate" };
}

/**
 * Cancel a job that is queued/running.
 * - Marks job.status = "cancelled" (string enum is not enforced in Prisma)
 * - Marks remaining queued/running items as failed with a cancel message
 * - Clears locks so the worker can move on
 * - Best-effort removes BullMQ jobs for both generate/publish
 */
export async function cancelJobForShop({ shop, jobId }) {
  const id = String(jobId || "").trim();
  if (!id) return { ok: false, message: "Missing jobId" };

  const job = await prisma.seoJob.findFirst({ where: { id, shop } });
  if (!job) return { ok: false, message: "Job not found" };

  const now = new Date();
  const msg = "Cancelled by user";

  const phase = String(job.phase || "generating").toLowerCase();
  const isPublish = phase === "publishing" || phase === "published";

  // Best-effort remove from Bull queue (both kinds, because id is deterministic)
  await removeSeoQueueJob(id, "generate");
  await removeSeoQueueJob(id, "publish");

  // Mark in-flight generation items as failed (do not touch publishStatus here)
  await prisma.seoJobItem.updateMany({
    where: { jobId: id, status: { in: ["queued", "running"] } },
    data: { status: "failed", error: msg, finishedAt: now },
  });

  // Mark in-flight publish items as failed (do not touch status here)
  await prisma.seoJobItem.updateMany({
    where: { jobId: id, publishStatus: { in: ["queued", "running"] } },
    data: { publishStatus: "failed", publishError: msg, publishedAt: null },
  });

  // Normalize counters
  const ok = await prisma.seoJobItem.count({ where: { jobId: id, status: "success" } });
  const failed = await prisma.seoJobItem.count({ where: { jobId: id, status: "failed" } });
  const pok = await prisma.seoJobItem.count({ where: { jobId: id, publishStatus: "success" } });
  const pfailed = await prisma.seoJobItem.count({ where: { jobId: id, publishStatus: "failed" } });

  await prisma.seoJob.update({
    where: { id },
    data: {
      status: "cancelled",
      lastError: msg,
      finishedAt: now,
      phase: isPublish ? "publishing" : "generating",
      okCount: ok,
      failedCount: failed,
      publishOkCount: pok,
      publishFailedCount: pfailed,
      publishFinishedAt: isPublish ? now : job.publishFinishedAt,
      lockOwner: null,
      lockExpiresAt: null,
    },
  });

  return { ok: true, message: "Job cancelled." };
}