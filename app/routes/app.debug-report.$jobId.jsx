import prisma from "../db.server.js";
import { authenticate } from "../shopify.server";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function loader({ request, params }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const jobId = String(params.jobId || "").trim();
  if (!jobId) return jsonResponse({ error: "Missing jobId" }, 400);

  const job = await prisma.seoJob.findFirst({
    where: { id: jobId, shop },
    include: {
      items: {
        orderBy: { productTitle: "asc" },
      },
    },
  });

  if (!job) return jsonResponse({ error: "Job not found" }, 404);

  // Build a safe debug report (no tokens, no secrets)
  const report = {
    generatedAt: new Date().toISOString(),
    shop,
    job: {
      id: job.id,
      status: job.status,
      phase: job.phase,
      language: job.language,
      total: job.total,
      okCount: job.okCount,
      failedCount: job.failedCount,
      publishOkCount: job.publishOkCount,
      publishFailedCount: job.publishFailedCount,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      finishedAt: job.finishedAt,
      publishStartedAt: job.publishStartedAt,
      publishFinishedAt: job.publishFinishedAt,
      lastError: job.lastError,
      lockExpiresAt: job.lockExpiresAt,
      usageReserved: job.usageReserved,
      usageCount: job.usageCount,
      telemetry: {
        totalAttempts: job.totalAttempts,
        totalRetryWaitMs: job.totalRetryWaitMs,
      },
      settingsJson: job.settingsJson ? safeJsonParse(job.settingsJson) : null,
    },
    items: job.items.map((it) => ({
      id: it.id,
      productId: it.productId,
      productTitle: it.productTitle,
      status: it.status,
      publishStatus: it.publishStatus,
      startedAt: it.startedAt,
      finishedAt: it.finishedAt,
      publishedAt: it.publishedAt,
      seoTitle: it.seoTitle,
      seoDescription: it.seoDescription,
      error: it.error,
      publishError: it.publishError,
      telemetry: {
        genAttempts: it.genAttempts,
        genRetryWaitMs: it.genRetryWaitMs,
        publishAttempts: it.publishAttempts,
        publishRetryWaitMs: it.publishRetryWaitMs,
      },
    })),
  };

  const filename = `debug-report_${job.id}.json`;
  return new Response(JSON.stringify(report, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename=\"${filename}\"`,
      "Cache-Control": "no-store",
    },
  });
}

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return { _parseError: true };
  }
}
