// app/billing.gating.server.js
import { BILLING_PLANS } from "./billing.plans.js";
import {
  getFreeUsageMonthly,
  reserveFreeUsageMonthly,
  resetFreeUsageMonthly,
} from "./billing.usage.server.js";

import { MONTHLY_PLAN, ANNUAL_PLAN } from "./shopify.server.js";

export { MONTHLY_PLAN, ANNUAL_PLAN };

export function isTestBilling() {
  return String(process.env.SHOPIFY_BILLING_TEST || "").toLowerCase() === "true";
}

/**
 * ✅ Tek standart:
 * getBillingContext({ shop, billing })
 * - billing: authenticate.admin(request) dönüşünden gelen billing objesi
 */
export async function getBillingContext({ shop, billing }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  // Billing objesi yoksa crash etme — Free plan varsay
  if (!billing) {
    return {
      planKey: "free",
      isPro: false,
      mode: "no_billing_object",
      activeSubscription: null,
      free: {
        monthlyLimit: freeLimit,
        ...usage,
      },
      plans: BILLING_PLANS,
    };
  }

  const isTest = isTestBilling();

  // Shopify billing check
  // Not: check result shape kütüphaneye göre değişebilir -> defensif okuyoruz.
  const checkRes = await billing.check({
    plans: [MONTHLY_PLAN, ANNUAL_PLAN],
    isTest,
  });

  const hasActive =
    Boolean(checkRes?.hasActivePayment) ||
    Boolean(checkRes?.hasPayment) ||
    (Array.isArray(checkRes?.subscriptions) && checkRes.subscriptions.length > 0);

  const activeSubscription =
    (Array.isArray(checkRes?.subscriptions) && checkRes.subscriptions[0]) ||
    null;

  // Hangi plan? (subscriptions[0].name veya plan handle)
  const activePlanName =
    activeSubscription?.name ||
    activeSubscription?.plan ||
    activeSubscription?.lineItems?.[0]?.plan?.name ||
    null;

  const isPro = Boolean(hasActive);
  const planKey = isPro ? String(activePlanName || "pro") : "free";

  return {
    planKey,
    isPro,
    mode: "shopify",
    activeSubscription,
    free: {
      monthlyLimit: freeLimit,
      ...usage,
    },
    plans: BILLING_PLANS,
    rawCheck: checkRes,
  };
}

export async function reserveIfFreePlan({ shop, productCount, billing }) {
  const ctx = await getBillingContext({ shop, billing });
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;

  if (ctx.isPro) {
    return {
      ok: true,
      planKey: ctx.planKey,
      mode: ctx.mode,
      free: ctx.free,
    };
  }

  const reservation = await reserveFreeUsageMonthly(shop, productCount, freeLimit);
  return {
    ok: reservation.ok,
    code: reservation.code,
    planKey: ctx.planKey,
    mode: ctx.mode,
    free: reservation,
  };
}

export async function resetFreeUsage({ shop }) {
  return resetFreeUsageMonthly(shop);
}