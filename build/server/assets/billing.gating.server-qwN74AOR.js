import { r as reserveFreeUsageMonthly, t as getFreeUsageMonthly } from "./billing.usage.server-D9uZ7pSb.js";
//#region app/billing.plans.js
var BILLING_PLANS = {
	FREE: {
		key: "FREE",
		title: "Free Plan",
		subtitle: "For trying the app",
		monthlyProductLimit: 10,
		features: [
			"Up to 10 products / month",
			"Generate product meta title & description",
			"Generation history",
			"Basic support"
		]
	},
	PRO: {
		key: "PRO",
		title: "Pro Plan",
		subtitle: "Unlimited + advanced tools",
		features: [
			"Unlimited product generations",
			"Image ALT text generation",
			"Blog article SEO generation",
			"Bulk generate + bulk apply/publish",
			"Advanced filters & interactive tables",
			"Priority queue processing",
			"Retry failed items",
			"Detailed error insights",
			"Debug report export",
			"Priority support"
		],
		priceMonthlyText: "$19.90 / month",
		priceAnnualText: "$200 / year"
	}
};
//#endregion
//#region app/billing.gating.server.js
function isDevForceProEnabled() {
	return process.env.NODE_ENV !== "production" && String(process.env.DEV_FORCE_PRO || "").toLowerCase() === "true";
}
function devForceProContext({ freeLimit, usage }) {
	return {
		planKey: "pro_dev",
		isPro: true,
		mode: "dev_force_pro",
		free: {
			monthlyLimit: freeLimit,
			limit: freeLimit,
			used: usage?.used || 0,
			remaining: freeLimit,
			...usage
		},
		activeSubscription: {
			id: "dev_force_pro",
			name: "Pro Dev",
			status: "ACTIVE",
			test: true
		}
	};
}
async function fetchActiveSubs(admin) {
	const subs = (await (await admin.graphql(`#graphql
    query ActiveSubs {
      currentAppInstallation {
        activeSubscriptions {
          id
          name
          status
          test
        }
      }
    }
  `)).json())?.data?.currentAppInstallation?.activeSubscriptions || [];
	return Array.isArray(subs) ? subs : [];
}
async function getBillingContext(input = {}) {
	const { shop, admin } = typeof input === "string" ? {
		shop: input,
		admin: null
	} : input || {};
	const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
	const usage = await getFreeUsageMonthly(shop, freeLimit);
	if (isDevForceProEnabled()) return devForceProContext({
		freeLimit,
		usage
	});
	if (!admin) return {
		planKey: "free",
		isPro: false,
		mode: "shopify",
		free: {
			monthlyLimit: freeLimit,
			...usage
		},
		activeSubscription: null
	};
	let subs = [];
	try {
		subs = await fetchActiveSubs(admin);
	} catch (e) {
		console.error("[BILLING] fetchActiveSubs error:", {
			name: e?.name,
			message: e?.message,
			stack: e?.stack
		});
	}
	const active = subs.find((s) => s?.status === "ACTIVE") || null;
	const isPro = Boolean(active);
	return {
		planKey: isPro ? "pro" : "free",
		isPro,
		mode: "shopify",
		free: {
			monthlyLimit: freeLimit,
			...usage
		},
		activeSubscription: active
	};
}
async function reserveIfFreePlan({ shop, productCount, admin = null }) {
	const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
	const usage = await getFreeUsageMonthly(shop, freeLimit);
	if (isDevForceProEnabled()) return {
		ok: true,
		code: "DEV_FORCE_PRO",
		planKey: "pro_dev",
		isPro: true,
		mode: "dev_force_pro",
		free: {
			monthlyLimit: freeLimit,
			limit: freeLimit,
			...usage,
			remaining: freeLimit
		}
	};
	if (admin) {
		let subs = [];
		try {
			subs = await fetchActiveSubs(admin);
		} catch (e) {
			console.error("[BILLING] reserveIfFreePlan fetchActiveSubs error:", {
				shop,
				name: e?.name,
				message: e?.message
			});
		}
		const active = subs.find((s) => s?.status === "ACTIVE") || null;
		if (active) return {
			ok: true,
			code: "PRO_ACTIVE",
			planKey: "pro",
			isPro: true,
			mode: "shopify",
			free: {
				monthlyLimit: freeLimit,
				limit: freeLimit,
				...usage,
				remaining: freeLimit
			},
			activeSubscription: active
		};
	}
	const reservation = await reserveFreeUsageMonthly(shop, productCount, freeLimit);
	return {
		ok: reservation.ok,
		code: reservation.code,
		planKey: "free",
		isPro: false,
		mode: "shopify",
		free: {
			monthlyLimit: freeLimit,
			...usage,
			...reservation
		}
	};
}
//#endregion
export { reserveIfFreePlan as n, BILLING_PLANS as r, getBillingContext as t };
