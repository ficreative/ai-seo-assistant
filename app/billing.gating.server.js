// app/billing.gating.server.js
// Central gating helpers used by routes.
// SERVER-ONLY MODULE.

import { BILLING_PLANS } from "./billing.plans.js";
import {
  getFreeUsageMonthly,
  reserveFreeUsageMonthly,
  resetFreeUsageMonthly,
} from "./billing.usage.server.js";
import { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } from "./shopify.server.js";

function isTestBilling() {
  return process.env.SHOPIFY_BILLING_TEST === "true";
}

export async function getBillingContext({ shop, admin }) {
  // ✅ REAL billing check (Shopify)
  const check = await authenticate.admin.billing.check({
    shop,
    plans: [MONTHLY_PLAN, ANNUAL_PLAN],
    isTest: isTestBilling(),
  });

  const isPro = Boolean(check?.hasActivePayment);
  const activePlanName = check?.appSubscriptions?.[0]?.name || null;

  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  return {
    isPro,
    planKey: isPro ? activePlanName || MONTHLY_PLAN : "free",
    mode: isTestBilling() ? "test" : "live",
    free: {
      monthlyLimit: freeLimit,
      ...usage,
    },
    plans: BILLING_PLANS,
  };
}

export async function reserveIfFreePlan({ shop, productCount }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;

  const check = await authenticate.admin.billing.check({
    shop,
    plans: [MONTHLY_PLAN, ANNUAL_PLAN],
    isTest: isTestBilling(),
  });

  if (check?.hasActivePayment) {
    return {
      ok: true,
      planKey: check?.appSubscriptions?.[0]?.name || MONTHLY_PLAN,
      mode: isTestBilling() ? "test" : "live",
      free: await getFreeUsageMonthly(shop, freeLimit),
    };
  }

  const reservation = await reserveFreeUsageMonthly(shop, productCount, freeLimit);

  return {
    ok: reservation.ok,
    code: reservation.code,
    planKey: "free",
    mode: isTestBilling() ? "test" : "live",
    free: reservation,
  };
}

export async function resetFreeUsage({ shop }) {
  return resetFreeUsageMonthly(shop);
}