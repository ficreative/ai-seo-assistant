// app/billing.gating.server.js
import { BILLING_PLANS } from "./billing.plans.js";
import {
  getFreeUsageMonthly,
  reserveFreeUsageMonthly,
  resetFreeUsageMonthly,
} from "./billing.usage.server.js";

// Plan name'leri Shopify Billing API config'inle aynı olmalı.
// (App config'te tanımladığın plan handle/name neyse onu kullan.)
export const MONTHLY_PLAN = "pro_monthly";
export const ANNUAL_PLAN = "pro_annual";

export function isTestBilling() {
  // Shopify Partner test charges için
  return String(process.env.SHOPIFY_BILLING_TEST || "").toLowerCase() === "true";
}

/**
 * billing: authenticate.admin(request) içinden gelen billing objesi olmalı.
 * billing undefined gelirse crash etmeyelim; fallback dönelim.
 */
export async function getBillingContext({ shop, billing }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  // ✅ Billing objesi yoksa crash etme
  if (!billing || typeof billing.check !== "function") {
    return {
      planKey: "free",
      isPro: false,
      mode: "unconfigured",
      activeSubscription: null,
      free: {
        monthlyLimit: freeLimit,
        ...usage,
      },
      plans: BILLING_PLANS,
      error: "Billing context missing (billing is undefined).",
    };
  }

  // ✅ Gerçek billing check
  const check = await billing.check({
    plans: [MONTHLY_PLAN, ANNUAL_PLAN],
    isTest: isTestBilling(),
  });

  // Shopify lib'in çıktısına göre activeSubscriptions listesi gelebilir
  const activeSub =
    (Array.isArray(check?.activeSubscriptions) && check.activeSubscriptions[0]) ||
    null;

  const isPro = Boolean(activeSub);
  const planKey = isPro ? (activeSub?.name || "pro") : "free";

  return {
    planKey,
    isPro,
    mode: isTestBilling() ? "test" : "prod",
    activeSubscription: activeSub,
    free: {
      monthlyLimit: freeLimit,
      ...usage,
    },
    plans: BILLING_PLANS,
  };
}

export async function reserveIfFreePlan({ shop, billing, productCount }) {
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