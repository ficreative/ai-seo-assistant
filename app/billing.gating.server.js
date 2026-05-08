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
  // Partner test charge için: SHOPIFY_BILLING_TEST=true
  return String(process.env.SHOPIFY_BILLING_TEST || "").toLowerCase() === "true";
}

/**
 * Returns billing context using Shopify billing utilities.
 * billing: comes from authenticate.admin(request)
 */
export async function getBillingContext({ shop, billing }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  // billing yoksa (bug/edge) free fallback
  if (!billing) {
    return {
      planKey: "free",
      isPro: false,
      mode: "shopify",
      activeSubscription: null,
      free: usage,
      plans: BILLING_PLANS,
    };
  }

  // ✅ Subscription check (monthly/annual)
  // Not: billing.check() result shape Shopify lib’e göre değişebilir.
  // Biz en güvenlisi: hasActivePayment + activeSubscriptions yaklaşıyoruz.
  let hasActivePayment = false;
  let activeSubscriptions = [];

  try {
    const check = await billing.check({
      plans: [MONTHLY_PLAN, ANNUAL_PLAN],
      isTest: isTestBilling(),
    });

    hasActivePayment = Boolean(check?.hasActivePayment);
    activeSubscriptions = Array.isArray(check?.activeSubscriptions)
      ? check.activeSubscriptions
      : [];
  } catch (e) {
    // check patlarsa free fallback, ama log bas
    const msg = e instanceof Error ? e.message : String(e);
    // eslint-disable-next-line no-console
    console.error("[BILLING] check error:", msg, e?.stack || "");
  }

  const activeSub = activeSubscriptions[0] || null;

  // planKey tespiti
  let planKey = "free";
  if (activeSub?.name === MONTHLY_PLAN) planKey = "pro_monthly";
  else if (activeSub?.name === ANNUAL_PLAN) planKey = "pro_annual";
  else if (hasActivePayment) planKey = "pro"; // generic fallback

  const isPro = planKey !== "free";

  return {
    planKey,
    isPro,
    mode: "shopify",
    activeSubscription: activeSub,
    free: usage,
    plans: BILLING_PLANS,
  };
}

export async function reserveIfFreePlan({ shop, productCount }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  // Eğer Pro ise rezervasyon yok
  // (Bu fonksiyon çağrılırken pro bilgisi dışarıdan verilse daha iyi ama şimdilik basit)
  // Pro kontrolünü route’larda getBillingContext ile yap.
  const reservation = await reserveFreeUsageMonthly(shop, productCount, freeLimit);

  return {
    ok: reservation.ok,
    code: reservation.code,
    free: reservation.ok ? reservation : usage,
  };
}

export async function resetFreeUsage({ shop }) {
  return resetFreeUsageMonthly(shop);
}