// app/billing.gating.server.js
// Central gating helpers used by routes (server-only).

import { BILLING_PLANS } from "./billing.plans.js";
import { getPlanForShop } from "./billing.mock.server.js";
import {
  getFreeUsageMonthly,
  reserveFreeUsageMonthly,
  resetFreeUsageMonthly,
} from "./billing.usage.server.js";

export async function getBillingContext(shop) {
  if (!shop) {
    return {
      planKey: "free",
      isPro: false,
      mode: "unknown",
      free: await getFreeUsageMonthly("", BILLING_PLANS.FREE.monthlyProductLimit),
      plans: BILLING_PLANS,
    };
  }

  const planInfo = await getPlanForShop(shop); // <-- burası ileride gerçek billing ile değişecek
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
  const planInfo = await getPlanForShop(shop);
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;

  if (planInfo.isPro) {
    return {
      ok: true,
      planKey: planInfo.planKey,
      mode: planInfo.mode,
      free: await getFreeUsageMonthly(shop, freeLimit),
    };
  }

  const reservation = await reserveFreeUsageMonthly(shop, productCount, freeLimit);

  return {
    ok: reservation.ok,
    code: reservation.code,
    planKey: planInfo.planKey,
    mode: planInfo.mode,
    free: reservation,
  };
}

export async function resetFreeUsage({ shop }) {
  return resetFreeUsageMonthly(shop);
}