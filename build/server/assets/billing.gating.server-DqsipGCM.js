import { r as reserveFreeUsageMonthly, t as getFreeUsageMonthly } from "./billing.usage.server-CPe2tTKk.js";
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
function isTestBilling() {
	return String(process.env.SHOPIFY_BILLING_TEST || "").toLowerCase() === "true";
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
async function getBillingContext({ shop, admin }) {
	const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
	const usage = await getFreeUsageMonthly(shop, freeLimit);
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
async function reserveIfFreePlan({ shop, productCount }) {
	const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
	const usage = await getFreeUsageMonthly(shop, freeLimit);
	const reservation = await reserveFreeUsageMonthly(shop, productCount, freeLimit);
	return {
		ok: reservation.ok,
		code: reservation.code,
		planKey: "free",
		mode: "shopify",
		free: {
			monthlyLimit: freeLimit,
			...usage,
			...reservation
		}
	};
}
//#endregion
export { BILLING_PLANS as i, isTestBilling as n, reserveIfFreePlan as r, getBillingContext as t };
