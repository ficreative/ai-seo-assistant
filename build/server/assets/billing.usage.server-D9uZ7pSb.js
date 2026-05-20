import { t as prisma } from "./db.server-BzuWsmVg.js";
//#region app/billing.usage.server.js
function monthKeyIstanbul(date = /* @__PURE__ */ new Date()) {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Europe/Istanbul",
		year: "numeric",
		month: "2-digit"
	}).formatToParts(date);
	return `${parts.find((p) => p.type === "year")?.value}-${parts.find((p) => p.type === "month")?.value}`;
}
function normalizeShop(shop) {
	return String(shop || "").trim() || null;
}
async function getFreeUsageMonthly(shop, limit) {
	const month = monthKeyIstanbul();
	const lim = limit ?? 10;
	const normalizedShop = normalizeShop(shop);
	if (!normalizedShop) return {
		month,
		used: 0,
		limit: lim,
		remaining: lim
	};
	const used = (await prisma.freePlanUsageMonthly.findUnique({ where: { shop_month: {
		shop: normalizedShop,
		month
	} } }))?.used ?? 0;
	return {
		month,
		used,
		limit: lim,
		remaining: Math.max(0, lim - used)
	};
}
async function reserveFreeUsageMonthly(shop, count, limit) {
	const month = monthKeyIstanbul();
	const lim = limit ?? 10;
	const normalizedShop = normalizeShop(shop);
	if (!normalizedShop) return {
		ok: false,
		code: "MISSING_SHOP",
		month,
		used: 0,
		limit: lim,
		remaining: lim
	};
	const safeCount = Math.max(0, Number(count || 0));
	if (!safeCount) return {
		ok: true,
		code: "OK",
		...await getFreeUsageMonthly(normalizedShop, lim)
	};
	const MAX_RETRIES = 3;
	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) try {
		return await prisma.$transaction(async (tx) => {
			await tx.freePlanUsageMonthly.upsert({
				where: { shop_month: {
					shop: normalizedShop,
					month
				} },
				update: { updatedAt: /* @__PURE__ */ new Date() },
				create: {
					shop: normalizedShop,
					month,
					used: 0,
					createdAt: /* @__PURE__ */ new Date(),
					updatedAt: /* @__PURE__ */ new Date()
				}
			});
			const used = (await tx.freePlanUsageMonthly.findUnique({ where: { shop_month: {
				shop: normalizedShop,
				month
			} } }))?.used ?? 0;
			const newUsed = used + safeCount;
			if (newUsed > lim) return {
				ok: false,
				code: "FREE_LIMIT_EXCEEDED",
				month,
				used,
				limit: lim,
				remaining: Math.max(0, lim - used)
			};
			await tx.freePlanUsageMonthly.update({
				where: { shop_month: {
					shop: normalizedShop,
					month
				} },
				data: {
					used: newUsed,
					updatedAt: /* @__PURE__ */ new Date()
				}
			});
			return {
				ok: true,
				code: "OK",
				month,
				used: newUsed,
				limit: lim,
				remaining: Math.max(0, lim - newUsed)
			};
		}, { isolationLevel: "Serializable" });
	} catch (e) {
		const msg = String(e?.message || e);
		if (!(msg.includes("Serialization") || msg.includes("could not serialize access") || msg.includes("P2034") || msg.includes("deadlock detected") || msg.includes("Transaction") || msg.includes("timeout")) || attempt === MAX_RETRIES) throw e;
		await new Promise((r) => setTimeout(r, 50 * attempt));
	}
	return {
		ok: false,
		code: "UNKNOWN",
		month,
		used: 0,
		limit: lim,
		remaining: lim
	};
}
async function resetFreeUsageMonthly(shop) {
	const month = monthKeyIstanbul();
	const normalizedShop = normalizeShop(shop);
	if (!normalizedShop) return {
		ok: false,
		code: "MISSING_SHOP",
		month
	};
	await prisma.freePlanUsageMonthly.deleteMany({ where: {
		shop: normalizedShop,
		month
	} });
	return {
		ok: true,
		month
	};
}
//#endregion
export { resetFreeUsageMonthly as i, monthKeyIstanbul as n, reserveFreeUsageMonthly as r, getFreeUsageMonthly as t };
