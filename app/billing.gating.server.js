// app/billing.gating.server.js
import { BILLING_PLANS } from "./billing.plans.js";
import { getFreeUsageMonthly, reserveFreeUsageMonthly, resetFreeUsageMonthly } from "./billing.usage.server.js";

/**
 * admin: authenticate.admin(request) içinden gelen admin client
 * shop: session.shop
 */
export async function getBillingContext({ shop, admin }) {
  // Pro plan kontrolü (Shopify Billing API / Managed Pricing)
  // Bu kısım sende "A seçeneği" ile gerçek billing'e bağlanacak.
  // Şimdilik güvenli default: pro değil.
  let isPro = false;
  let planKey = "free";
  let mode = "real";

  // Eğer real billing check fonksiyonunu buraya koyduysan, admin ile çağır:
  // const result = await checkProPlan({ shop, admin });
  // isPro = result.isPro; planKey = result.planKey;

  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  return {
    isPro,
    planKey,
    mode,
    free: { monthlyLimit: freeLimit, ...usage },
    plans: BILLING_PLANS,
  };
}

export async function reserveIfFreePlan({ shop, productCount }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const reservation = await reserveFreeUsageMonthly(shop, productCount, freeLimit);
  return { ok: reservation.ok, code: reservation.code, free: reservation };
}

export async function resetFreeUsage({ shop }) {
  return resetFreeUsageMonthly(shop);
}