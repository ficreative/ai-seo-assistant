// app/billing.gating.server.js
import { BILLING_PLANS } from "./billing.plans.js";
import {
  getFreeUsageMonthly,
  reserveFreeUsageMonthly,
  resetFreeUsageMonthly,
} from "./billing.usage.server.js";

import { MONTHLY_PLAN, ANNUAL_PLAN } from "./shopify.server.js";

// Shopify Partner dev store test charges için
export function isTestBilling() {
  return String(process.env.SHOPIFY_BILLING_TEST || "")
    .toLowerCase()
    .trim() === "true";
}

/**
 * billing: authenticate.admin(request) içinden gelir.
 * Bazı senaryolarda billing undefined olabilir (özellikle auth/embedded edge-case).
 * Crash etmeyelim → Free plan fallback dönelim.
 */
export async function getBillingContext({ shop, billing }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  // Default (free)
  const base = {
    planKey: "free",
    isPro: false,
    mode: isTestBilling() ? "test" : "live",
    activeSubscription: null,
    free: {
      limit: freeLimit,
      ...usage,
    },
  };

  if (!billing || typeof billing.check !== "function") {
    return base;
  }

  // ✅ Shopify Billing API kontrolü
  const checkResult = await billing.check({
    plans: [MONTHLY_PLAN, ANNUAL_PLAN],
    isTest: isTestBilling(),
  });

  // checkResult shape genelde:
  // { hasActivePayment, appSubscriptions? / subscriptions? , activeSubscriptions? } (pakete göre değişebilir)
  const active =
    (checkResult?.activeSubscriptions && checkResult.activeSubscriptions[0]) ||
    (checkResult?.appSubscriptions && checkResult.appSubscriptions[0]) ||
    (Array.isArray(checkResult?.subscriptions) && checkResult.subscriptions[0]) ||
    null;

  const isPro = Boolean(checkResult?.hasActivePayment || active);

  return {
    ...base,
    planKey: isPro ? "pro" : "free",
    isPro,
    activeSubscription: active,
  };
}

export async function reserveIfFreePlan({ shop, productCount }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const reservation = await reserveFreeUsageMonthly(shop, productCount, freeLimit);
  return {
    ok: reservation.ok,
    code: reservation.code,
    free: reservation,
  };
}

export async function resetFreeUsage({ shop }) {
  return resetFreeUsageMonthly(shop);
}