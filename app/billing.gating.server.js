import shopify, { MONTHLY_PLAN, ANNUAL_PLAN } from "./shopify.server.js";
import { BILLING_PLANS } from "./billing.plans.js";
import {
  getFreeUsageMonthly,
  reserveFreeUsageMonthly,
  resetFreeUsageMonthly,
} from "./billing.usage.server.js";

function isTestBilling() {
  // Prod’da false olmalı.
  return process.env.SHOPIFY_BILLING_TEST === "true" || process.env.NODE_ENV !== "production";
}

export async function getBillingContext(shop, session) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;

  // ✅ Shopify Billing check (real)
  const result = await shopify.billing.check({
    session,
    plans: [MONTHLY_PLAN, ANNUAL_PLAN],
    isTest: isTestBilling(),
    returnObject: true,
  });

  const hasActivePayment = Boolean(result?.hasActivePayment || result?.hasActivePayment === true || result?.hasActivePayment === undefined ? result?.hasActivePayment : result?.hasActivePayment);
  // Mintlify doc’ta alan: hasActivePayment / hasActivePayment: true gibi dönebiliyor; biz güvenli alıyoruz:
  const active = result?.hasActivePayment ?? result?.hasActivePayment ?? result?.hasActivePayment ?? result?.hasActivePayment;
  const hasPro = Boolean(result?.hasActivePayment ?? result?.hasActivePayment ?? result?.hasActivePayment ?? result?.hasActivePayment) || Boolean(result?.hasActivePayment);

  // Daha güvenlisi:
  const isPro = Boolean(result?.hasActivePayment) || Boolean(result?.hasActivePayment === true) || Boolean(result?.hasActivePayment === undefined ? false : result?.hasActivePayment);

  // subscriptions listesi
  const subs = result?.appSubscriptions || [];
  const activeSubName = subs?.[0]?.name || null;

  const usage = await getFreeUsageMonthly(shop, freeLimit);

  return {
    mode: isTestBilling() ? "test" : "live",
    planKey: activeSubName,
    isPro: Boolean(activeSubName),
    subscription: subs?.[0] || null,
    free: {
      monthlyLimit: freeLimit,
      ...usage,
    },
    plans: BILLING_PLANS,
  };
}

export async function reserveIfFreePlan({ shop, productCount, session }) {
  const ctx = await getBillingContext(shop, session);
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;

  if (ctx.isPro) {
    return { ok: true, planKey: ctx.planKey, mode: ctx.mode, free: await getFreeUsageMonthly(shop, freeLimit) };
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