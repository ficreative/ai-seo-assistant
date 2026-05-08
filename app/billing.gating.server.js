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
  return String(process.env.SHOPIFY_BILLING_TEST || "").toLowerCase() === "true";
}

/**
 * billing: authenticate.admin(request) içinden gelen billing objesi olmalı.
 * Burada crash yerine güvenli fallback veriyoruz.
 */
export async function getBillingContext({ shop, billing }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  // billing objesi yoksa (ya da yanlış geldi ise) güvenli fallback
  if (!billing || typeof billing.check !== "function") {
    return {
      planKey: "free",
      isPro: false,
      mode: "shopify",
      activeSubscription: null,
      free: { monthlyLimit: freeLimit, ...usage },
      plans: BILLING_PLANS,
    };
  }

  try {
    // Shopify billing.check genelde { hasActivePayment, appSubscriptions } döndürür.
    const check = await billing.check({
      plans: [MONTHLY_PLAN, ANNUAL_PLAN],
      isTest: isTestBilling(),
    });

    const appSubscriptions = Array.isArray(check?.appSubscriptions)
      ? check.appSubscriptions
      : [];

    const activeSubscription = appSubscriptions.find((s) => s?.status === "ACTIVE") || null;
    const isPro = Boolean(check?.hasActivePayment) || Boolean(activeSubscription);

    // planKey: hangi plan aktif?
    const planKey =
      activeSubscription?.name === MONTHLY_PLAN
        ? MONTHLY_PLAN
        : activeSubscription?.name === ANNUAL_PLAN
          ? ANNUAL_PLAN
          : "free";

    return {
      planKey,
      isPro,
      mode: "shopify",
      activeSubscription,
      free: { monthlyLimit: freeLimit, ...usage },
      plans: BILLING_PLANS,
    };
  } catch (e) {
    // ✅ Asıl kritik: hatayı detaylı logla (Cloud Run stderr)
    console.error("[BILLING] check error", {
      shop,
      isTest: isTestBilling(),
      message: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : undefined,
      // Shopify BillingError bazen extra field taşır:
      cause: e?.cause,
      response: e?.response,
    });

    return {
      planKey: "free",
      isPro: false,
      mode: "shopify",
      activeSubscription: null,
      free: { monthlyLimit: freeLimit, ...usage },
      plans: BILLING_PLANS,
      error: "Billing check failed",
    };
  }
}

export async function reserveIfFreePlan({ shop, productCount, billing }) {
  const ctx = await getBillingContext({ shop, billing });
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;

  if (ctx.isPro) {
    return { ok: true, planKey: ctx.planKey, mode: ctx.mode, free: ctx.free };
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