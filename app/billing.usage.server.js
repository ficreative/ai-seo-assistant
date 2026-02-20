// app/billing.usage.server.js
// Server-only free-plan monthly usage tracking.

import prisma from "./db.server.js";

function monthKeyIstanbul(date = new Date()) {
  // Compute YYYY-MM in Europe/Istanbul timezone (avoid UTC month boundary issues).
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  return `${year}-${month}`;
}

export async function getFreeUsageMonthly(shop, limit) {
  const month = monthKeyIstanbul();
  const row = await prisma.freePlanUsageMonthly.findUnique({ where: { shop_month: { shop, month } } });
  const used = row?.used ?? 0;
  const remaining = Math.max(0, (limit ?? 10) - used);
  return { month, used, limit: limit ?? 10, remaining };
}

export async function reserveFreeUsageMonthly(shop, count, limit) {
  const month = monthKeyIstanbul();
  const safeCount = Math.max(0, Number(count || 0));
  const lim = limit ?? 10;

  if (!safeCount) {
    return { ok: true, code: "OK", month, used: 0, limit: lim, remaining: lim };
  }

  // Postgres-safe: run in SERIALIZABLE transaction and retry on contention.
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await prisma.$transaction(
        async (tx) => {
          // Ensure row exists
          await tx.freePlanUsageMonthly.upsert({
            where: { shop_month: { shop, month } },
            update: { updatedAt: new Date() },
            create: { shop, month, used: 0, createdAt: new Date(), updatedAt: new Date() },
          });

          const row = await tx.freePlanUsageMonthly.findUnique({
            where: { shop_month: { shop, month } },
          });

          const used = row?.used ?? 0;
          const newUsed = used + safeCount;

          if (newUsed > lim) {
            return {
              ok: false,
              code: "FREE_LIMIT_EXCEEDED",
              month,
              used,
              limit: lim,
              remaining: Math.max(0, lim - used),
            };
          }

          await tx.freePlanUsageMonthly.update({
            where: { shop_month: { shop, month } },
            data: { used: newUsed, updatedAt: new Date() },
          });

          return {
            ok: true,
            code: "OK",
            month,
            used: newUsed,
            limit: lim,
            remaining: Math.max(0, lim - newUsed),
          };
        },
        { isolationLevel: "Serializable" }
      );

      return result;
    } catch (e) {
      const msg = String(e?.message || e);
      // Prisma may throw serialization / transaction conflict errors; retry a few times.
      const shouldRetry =
        msg.includes("Serialization") ||
        msg.includes("could not serialize access") ||
        msg.includes("P2034") ||
        msg.includes("deadlock detected") ||
        msg.includes("Transaction") ||
        msg.includes("timeout");

      if (!shouldRetry || attempt === MAX_RETRIES) throw e;

      // backoff
      await new Promise((r) => setTimeout(r, 50 * attempt));
    }
  }

  // unreachable
  return { ok: false, code: "UNKNOWN", month, used: 0, limit: lim, remaining: lim };
}


export async function resetFreeUsageMonthly(shop) {
  const month = monthKeyIstanbul();
  await prisma.freePlanUsageMonthly.deleteMany({ where: { shop, month } });
  return { ok: true, month };
}

export { monthKeyIstanbul };
