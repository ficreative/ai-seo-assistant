// app/billing.gating.server.js
import { BILLING_PLANS } from "./billing.plans.js";
import {
  getFreeUsageMonthly,
  reserveFreeUsageMonthly,
  resetFreeUsageMonthly,
} from "./billing.usage.server.js";

// ⚠️ Plan adları shopify.server.js billing config ile aynı olmalı
export const MONTHLY_PLAN = "pro_monthly";
export const ANNUAL_PLAN = "pro_annual";

export function isTestBilling() {
  return String(process.env.SHOPIFY_BILLING_TEST || "").toLowerCase() === "true";
}

function serializeError(e) {
  if (!e) return { message: "Unknown error" };
  if (e instanceof Error) {
    return {
      name: e.name,
      message: e.message,
      stack: e.stack,
      cause: e.cause,
    };
  }
  return { message: String(e) };
}

/**
 * billing: authenticate.admin(request) içinden gelen billing objesi olmalı.
 * billing undefined gelirse crash etmeyelim; free plan fallback dönelim.
 */
export async function getBillingContext({ shop, billing }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  const ctx = {
    planKey: "free",
    isPro: false,
    mode: "unconfigured", // "shopify" | "unconfigured"
    free: {
      monthlyLimit: freeLimit,
      ...usage,
    },
    activeSubscription: null,
    plans: BILLING_PLANS,
  };

  if (!billing || typeof billing.check !== "function") {
    return ctx;
  }

  ctx.mode = "shopify";

  try {
    const check = await billing.check({
      plans: [MONTHLY_PLAN, ANNUAL_PLAN],
      isTest: isTestBilling(),
    });

    ctx.isPro = Boolean(check?.hasActivePayment);

    if (ctx.isPro) {
      const subs = check?.appSubscriptions || [];
      const active =
        subs.find((s) => s.status === "ACTIVE") ||
        subs.find((s) => s.status === "ACCEPTED") ||
        subs[0];

      if (active) {
        ctx.activeSubscription = {
          id: active.id,
          name: active.name,
          status: active.status,
          test: active.test,
        };

        ctx.planKey = active.name === ANNUAL_PLAN ? "annual" : "monthly";
      } else {
        ctx.planKey = "monthly";
      }
    }
  } catch (e) {
    console.error("[BILLING] check error:", serializeError(e));
  }

  return ctx;
}

export async function reserveIfFreePlan({ shop, productCount }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const reservation = await reserveFreeUsageMonthly(shop, productCount, freeLimit);

  return {
    ok: reservation.ok,
    code: reservation.code,
    planKey: "free",
    mode: "free",
    free: reservation,
  };
}

export async function resetFreeUsage({ shop }) {
  return resetFreeUsageMonthly(shop);
}