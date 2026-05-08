// app/billing.gating.server.js
import { BILLING_PLANS } from "./billing.plans.js";
import {
  getFreeUsageMonthly,
  reserveFreeUsageMonthly,
  resetFreeUsageMonthly,
} from "./billing.usage.server.js";

// ✅ Tek kaynak: plan handle'ları shopify.server.js'den gelsin (asla kopyalama)
import { MONTHLY_PLAN, ANNUAL_PLAN } from "./shopify.server.js";

export { MONTHLY_PLAN, ANNUAL_PLAN };

export function isTestBilling() {
  return String(process.env.SHOPIFY_BILLING_TEST || "").toLowerCase() === "true";
}

function safeErrorObject(e) {
  if (!e) return null;
  try {
    const obj = {};
    for (const k of Object.getOwnPropertyNames(e)) obj[k] = e[k];
    // bazen cause/response nested olur
    obj.cause = e.cause;
    obj.response = e.response;
    return obj;
  } catch {
    return { message: String(e) };
  }
}

/**
 * billing: authenticate.admin(request) içinden gelen billing objesi
 * - billing yoksa free plan fallback dön
 * - billing.check hata atarsa fallback + log
 */
export async function getBillingContext({ shop, billing }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  // default: free
  const base = {
    planKey: "free",
    isPro: false,
    mode: "shopify",
    free: {
      monthlyLimit: freeLimit,
      ...usage,
    },
    activeSubscription: null,
  };

  if (!billing) return base;

  try {
    // billing.check -> aktif subscription var mı?
    const check = await billing.check({
      plans: [MONTHLY_PLAN, ANNUAL_PLAN],
      isTest: isTestBilling(),
    });

    // check objesi lib sürümüne göre değişebilir; güvenli okuyalım
    const activeSubs =
      check?.appSubscriptions ||
      check?.subscriptions ||
      check?.activeSubscriptions ||
      [];

    const active = Array.isArray(activeSubs) ? activeSubs[0] : null;

    const activePlan =
      active?.name || active?.plan || active?.planName || active?.handle;

    const isPro = Boolean(active);

    return {
      ...base,
      isPro,
      planKey: activePlan === ANNUAL_PLAN ? "pro_annual" : isPro ? "pro_monthly" : "free",
      activeSubscription: active
        ? {
            id: active.id,
            name: activePlan,
            status: active.status,
          }
        : null,
    };
  } catch (e) {
    // Bu log’u özellikle detaylı basıyoruz ki Cloud Run’da root cause görelim
    // eslint-disable-next-line no-console
    console.error("[BILLING] check error", safeErrorObject(e));
    return base;
  }
}

export async function reserveIfFreePlan({ shop, productCount }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  const reservation = await reserveFreeUsageMonthly(shop, productCount, freeLimit);
  return {
    ok: reservation.ok,
    code: reservation.code,
    planKey: "free",
    mode: "shopify",
    free: reservation.ok ? reservation : usage,
  };
}

export async function resetFreeUsage({ shop }) {
  return resetFreeUsageMonthly(shop);
}