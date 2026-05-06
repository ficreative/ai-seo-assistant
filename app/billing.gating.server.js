import { BILLING_PLANS } from "./billing.plans.js";
import {
  getFreeUsageMonthly,
  reserveFreeUsageMonthly,
  resetFreeUsageMonthly,
} from "./billing.usage.server.js";
import { MONTHLY_PLAN, ANNUAL_PLAN } from "./shopify.server.js";

function isTestBilling() {
  return String(process.env.SHOPIFY_BILLING_TEST || "").toLowerCase() === "true";
}

// billing burada authenticate’den gelen billing olmalı
export async function getBillingContext({ shop, billing }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  // ✅ Billing check (doesn't throw)
  const check = await billing.check({
    plans: [MONTHLY_PLAN, ANNUAL_PLAN],
    isTest: isTestBilling(),
  });

  const hasActive = Boolean(check?.hasActivePayment);
  const activeSub = check?.appSubscriptions?.[0];

  return {
    isPro: hasActive,
    planKey: hasActive ? (activeSub?.name || MONTHLY_PLAN) : "free",
    mode: isTestBilling() ? "test" : "live",
    free: {
      monthlyLimit: freeLimit,
      ...usage,
    },
    plans: BILLING_PLANS,
    // cancel için lazım olabiliyor
    activeSubscription: activeSub || null,
  };
}

export async function reserveIfFreePlan({ shop, productCount, billing }) {
  const ctx = await getBillingContext({ shop, billing });
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;

  if (ctx.isPro) {
    return { ok: true, ...ctx };
  }

  const reservation = await reserveFreeUsageMonthly(shop, productCount, freeLimit);
  return {
    ok: reservation.ok,
    code: reservation.code,
    ...ctx,
    free: reservation,
  };
}

export async function resetFreeUsage({ shop }) {
  return resetFreeUsageMonthly(shop);
}