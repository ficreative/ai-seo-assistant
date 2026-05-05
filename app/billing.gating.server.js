// app/billing.gating.server.js
import { BILLING_PLANS } from "./billing.plans.js";
import { getPlanForShop } from "./billing.mock.server.js";
import { getFreeUsageMonthly, reserveFreeUsageMonthly, resetFreeUsageMonthly } from "./billing.usage.server.js";

function isTestBilling() {
  // Review / dev için true kullanmak istersen env ile kontrol et
  return process.env.SHOPIFY_BILLING_TEST === "true";
}

export async function getBillingContext(request) {
  const { billing, session } = await authenticate.admin(request);

  const check = await billing.check({
    plans: [MONTHLY_PLAN, ANNUAL_PLAN],
    isTest: isTestBilling(),
  });

  // check.hasActivePayment => pro gibi düşünebiliriz
  const isPro = Boolean(check?.hasActivePayment);

  // Aktif plan adı (varsa)
  const activeSub = Array.isArray(check?.appSubscriptions) ? check.appSubscriptions.find(s => s?.status === "ACTIVE") : null;
  const planKey = activeSub?.name || (isPro ? "pro" : "free");

  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(session.shop, freeLimit);

  return {
    shop: session.shop,
    isPro,
    planKey,
    mode: "shopify_billing",
    subscriptionId: activeSub?.id || null,
    free: {
      monthlyLimit: freeLimit,
      ...usage,
    },
    plans: BILLING_PLANS,
  };
}

export async function reserveIfFreePlan({ request, productCount }) {
  const ctx = await getBillingContext(request);
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;

  if (ctx.isPro) {
    return { ok: true, planKey: ctx.planKey, mode: ctx.mode, free: await getFreeUsageMonthly(ctx.shop, freeLimit) };
  }

  const reservation = await reserveFreeUsageMonthly(ctx.shop, productCount, freeLimit);
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