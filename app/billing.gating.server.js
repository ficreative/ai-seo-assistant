// app/billing.gating.server.js
// Central gating helpers used by routes.

import { BILLING_PLANS } from "./billing.plans.js";
import { getPlanForShop } from "./billing.mock.server.js";
import { getFreeUsageMonthly, reserveFreeUsageMonthly, resetFreeUsageMonthly } from "./billing.usage.server.js";

export async function getBillingContext(shop) {
  const planInfo = await getPlanForShop(shop);
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);
  return {
    ...planInfo,
    free: {
      monthlyLimit: freeLimit,
      ...usage,
    },
    plans: BILLING_PLANS,
  };
}

export async function reserveIfFreePlan({ shop, productCount }) {
  const ctx = await getPlanForShop(shop);
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  if (ctx.isPro) {
    return { ok: true, planKey: ctx.planKey, mode: ctx.mode, free: await getFreeUsageMonthly(shop, freeLimit) };
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
