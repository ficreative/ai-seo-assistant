// app/billing.gating.server.js
import { BILLING_PLANS } from "./billing.plans.js";
import {
  getFreeUsageMonthly,
  reserveFreeUsageMonthly,
  resetFreeUsageMonthly,
} from "./billing.usage.server.js";

export const MONTHLY_PLAN = "pro_monthly";
export const ANNUAL_PLAN = "pro_annual";

export function isTestBilling() {
  // Review/dev store için genelde TRUE gerekir.
  // Cloud Run'da SHOPIFY_BILLING_TEST=true yaparsan test charge kullanır.
  return String(process.env.SHOPIFY_BILLING_TEST || "").toLowerCase() === "true";
}

export async function getBillingContext({ shop, billing }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  // billing objesi gelmezse (misconfig / eski rev) crash etmeyelim
  if (!billing) {
    return {
      planKey: BILLING_PLANS.FREE.key,
      isPro: false,
      mode: "live",
      activeSubscription: null,
      free: { monthlyLimit: freeLimit, ...usage },
      plans: BILLING_PLANS,
    };
  }

  // Shopify Billing API: aktif subscription var mı?
  let checkResult = null;
  try {
    checkResult = await billing.check({
      plans: [MONTHLY_PLAN, ANNUAL_PLAN],
      isTest: isTestBilling(),
    });
  } catch (err) {
    console.error("[BILLING] check error:", err);
  }

  const active =
    checkResult?.hasActivePayment &&
    Array.isArray(checkResult?.subscriptions) &&
    checkResult.subscriptions.length
      ? checkResult.subscriptions[0]
      : null;

  const isPro = Boolean(active);

  return {
    planKey: isPro ? BILLING_PLANS.PRO.key : BILLING_PLANS.FREE.key,
    isPro,
    mode: "live",
    activeSubscription: active,
    free: { monthlyLimit: freeLimit, ...usage },
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
    free: { monthlyLimit: freeLimit, ...reservation },
  };
}

export async function resetFreeUsage({ shop }) {
  return resetFreeUsageMonthly(shop);
}