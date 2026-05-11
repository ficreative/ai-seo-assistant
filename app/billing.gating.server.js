// app/billing.gating.server.js
import { BILLING_PLANS } from "./billing.plans.js";
import {
  getFreeUsageMonthly,
  reserveFreeUsageMonthly,
  resetFreeUsageMonthly,
} from "./billing.usage.server.js";
import { MONTHLY_PLAN, ANNUAL_PLAN } from "./shopify.server.js";

export function isTestBilling() {
  return String(process.env.SHOPIFY_BILLING_TEST || "").toLowerCase() === "true";
}

/**
 * billing: authenticate.admin(request) içinden gelen billing helper (Shopify Billing API wrapper).
 * Eğer billing yoksa crash etmeyelim; free plan dönelim.
 */
export async function getBillingContext({ shop, billing }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  // Fallback: billing helper yoksa pro=false
  if (!billing) {
    return {
      planKey: "free",
      isPro: false,
      mode: "shopify",
      free: { monthlyLimit: freeLimit, ...usage },
      activeSubscription: null,
    };
  }

  // ✅ Aktif subscription var mı?
  let activeSubscription = null;
  let isPro = false;

  try {
    const check = await billing.check({
      plans: [MONTHLY_PLAN, ANNUAL_PLAN],
      isTest: isTestBilling(),
    });

    // check genelde { hasActivePayment, subscriptions } gibi döner
    const subs = Array.isArray(check?.subscriptions) ? check.subscriptions : [];
    activeSubscription = subs.find((s) => s?.status === "ACTIVE") || subs[0] || null;

    isPro = Boolean(check?.hasActivePayment) || Boolean(activeSubscription);
  } catch (e) {
    // Billing check hata verirse yine free’e düş, ama log bas
    // eslint-disable-next-line no-console
    console.error("[BILLING] check error:", e);
  }

  return {
    planKey: isPro ? "pro" : "free",
    isPro,
    mode: "shopify",
    free: { monthlyLimit: freeLimit, ...usage },
    activeSubscription,
  };
}

export async function reserveIfFreePlan({ shop, productCount }) {
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
      ...reservation,
    },
  };
}

export async function resetFreeUsage({ shop }) {
  return resetFreeUsageMonthly(shop);
}