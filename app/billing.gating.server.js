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
  return String(process.env.SHOPIFY_BILLING_TEST || "")
    .toLowerCase()
    .trim() === "true";
}

function normalizeCheckResult(result) {
  // Shopify billing libs farklı şekillerde dönebiliyor; olabildiğince esnek okuyalım.
  // İstediğimiz:
  // - hasActivePayment: boolean
  // - activeSubscription: { id?, name? } | null
  if (!result) {
    return { hasActivePayment: false, activeSubscription: null };
  }

  if (typeof result === "boolean") {
    return { hasActivePayment: result, activeSubscription: null };
  }

  const hasActivePayment =
    Boolean(result.hasActivePayment) ||
    Boolean(result.activePayment) ||
    Boolean(result.isActive) ||
    Boolean(result.active);

  const subs =
    result.appSubscriptions ||
    result.subscriptions ||
    result.activeSubscriptions ||
    [];

  const firstSub = Array.isArray(subs) && subs.length ? subs[0] : null;

  return {
    hasActivePayment,
    activeSubscription: firstSub
      ? {
          id: firstSub.id,
          name: firstSub.name,
        }
      : null,
  };
}

export async function getBillingContext({ shop, billing }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  // billing undefined gelirse (misconfig / auth path) crash etme:
  if (!billing || typeof billing.check !== "function") {
    return {
      shop,
      mode: "shopify",
      planKey: "free",
      isPro: false,
      activeSubscription: null,
      free: usage,
      billingReady: false,
    };
  }

  const checkResult = await billing.check({
    plans: [MONTHLY_PLAN, ANNUAL_PLAN],
    isTest: isTestBilling(),
  });

  const normalized = normalizeCheckResult(checkResult);
  const isPro = Boolean(normalized.hasActivePayment);

  return {
    shop,
    mode: "shopify",
    planKey: isPro ? "pro" : "free",
    isPro,
    activeSubscription: normalized.activeSubscription,
    free: usage,
    billingReady: true,
  };
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