// app/queue.server.js
import { Queue } from "bullmq";

const QUEUE_NAME = "seo-jobs";
const JOB_NAME = "process-seo-job";

function getRedisUrl() {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL is not set. Cannot enqueue jobs.");
  return url;
}

let _queue = null;

function getQueue() {
  if (_queue) return _queue;

  const url = getRedisUrl();
  const connection = { url };

  _queue = new Queue(QUEUE_NAME, { connection });
  return _queue;
}

/**
 * BullMQ custom jobId içinde ':' olamaz.
 * Bu yüzden güvenli bir custom id üretiyoruz.
 */
function safeBullId(input) {
  return String(input || "")
    .trim()
    .replace(/[:]/g, "-"); // ✅ kolonları asla bırakma
}

/**
 * kind: "generate" | "publish" (opsiyonel)
 * - Worker bullJob.data.jobId okuyor
 * - kind sadece debug/ayrım için data içinde kalsın (jobId stringinde ':' yok)
 */
export async function enqueueSeoJob(jobId, kind = "generate") {
  const queue = getQueue();

  const normalizedJobId = String(jobId || "").trim();
  if (!normalizedJobId) {
    throw new Error("enqueueSeoJob(jobId) missing jobId");
  }

  const safeJobId = safeBullId(normalizedJobId);
  const safeKind = safeBullId(kind);

  // ✅ custom id -> ":" yok
  const customId = `${safeKind}-${safeJobId}`;

  await queue.add(
    JOB_NAME,
    { jobId: normalizedJobId, kind },
    {
      jobId: customId,                 // publish-<jobId> aynı kalabilir (idempotent)
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },

      // ✅ KRİTİK: job tamamlanınca Redis'ten silinsin ki
      // aynı customId ile tekrar enqueue edilebilsin
      removeOnComplete: true,

      // (opsiyonel) fail olunca da temizle, yoksa fail job da "exists" yapabilir
      removeOnFail: true,
    },
  );
}

/**
 * Best-effort removal of a queued BullMQ job.
 * We use the same deterministic custom jobId format as enqueueSeoJob().
 * If the job is already active/completed, BullMQ may not remove it — that's OK.
 */
export async function removeSeoQueueJob(jobId, kind = "generate") {
  try {
    const queue = getQueue();

    const normalizedJobId = String(jobId || "").trim();
    if (!normalizedJobId) return { ok: false, removed: false, message: "Missing jobId" };

    const safeJobId = safeBullId(normalizedJobId);
    const safeKind = safeBullId(kind);
    const customId = `${safeKind}-${safeJobId}`;

    await queue.remove(customId);
    return { ok: true, removed: true, message: "Removed from queue" };
  } catch (e) {
    return { ok: false, removed: false, message: e?.message || String(e) };
  }
}

export { QUEUE_NAME, JOB_NAME };