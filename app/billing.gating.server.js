// app/billing.gating.server.js
import { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } from "./shopify.server.js";
import { BILLING_PLANS } from "./billing.plans.js";
import {
  getFreeUsageMonthly,
  reserveFreeUsageMonthly,
  resetFreeUsageMonthly,
} from "./billing.usage.server.js";

function isTestBilling() {
  return process.env.SHOPIFY_BILLING_TEST === "true";
}

export async function getBillingContext(request, shop) {
  const { billing } = await authenticate.admin(request);

  // ✅ billing artık undefined olmayacak (shopify.server.js içine billing config ekledik)
  const check = await billing.check({
    plans: [MONTHLY_PLAN, ANNUAL_PLAN],
    isTest: isTestBilling(),
  });

  const isPro = check.hasActivePayment || false;
  const planKey = check.appSubscriptions?.[0]?.name === ANNUAL_PLAN ? "annual" : isPro ? "monthly" : "free";

  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  return {
    isPro,
    planKey,
    mode: isTestBilling() ? "test" : "live",
    free: { monthlyLimit: freeLimit, ...usage },
  };
}

export async function resetFreeUsage({ shop }) {
  return resetFreeUsageMonthly(shop);
}

export async function reserveIfFreePlan({ request, shop, productCount }) {
  const ctx = await getBillingContext(request, shop);
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;

  if (ctx.isPro) return { ok: true, ...ctx };

  const reservation = await reserveFreeUsageMonthly(shop, productCount, freeLimit);
  return { ok: reservation.ok, code: reservation.code, ...ctx, free: reservation };
}