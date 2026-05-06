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

function buildFreeContext({ freeLimit, usage }) {
  return {
    planKey: "free",
    isPro: false,
    mode: isTestBilling() ? "test" : "production",
    free: {
      monthlyLimit: freeLimit,
      ...usage,
    },
    plans: BILLING_PLANS,
  };
}

export async function getBillingContext({ shop, billing }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  // billing objesi yoksa crash etme
  if (!billing || typeof billing.check !== "function") {
    return buildFreeContext({ freeLimit, usage });
  }

  // Shopify Billing API -> aktif abonelik kontrolü
  const check = await billing.check({
    plans: [MONTHLY_PLAN, ANNUAL_PLAN],
    isTest: isTestBilling(),
  });

  // shopify billing check sonucu farklı şekillerde dönebiliyor,
  // en güvenlisi "hasActivePayment" üzerinden gitmek
  const isPro = Boolean(check?.hasActivePayment);

  // aktif plan adını yakalamaya çalış (varsa)
  const activeName =
    check?.appSubscriptions?.[0]?.name ||
    check?.oneTimePurchases?.[0]?.name ||
    null;

  const planKey =
    activeName === ANNUAL_PLAN
      ? "pro_annual"
      : activeName === MONTHLY_PLAN
      ? "pro_monthly"
      : isPro
      ? "pro"
      : "free";

  return {
    planKey,
    isPro,
    mode: isTestBilling() ? "test" : "production",
    free: {
      monthlyLimit: freeLimit,
      ...usage,
    },
    plans: BILLING_PLANS,
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