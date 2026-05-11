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

async function fetchActiveSubs(admin) {
  const query = `#graphql
    query ActiveSubs {
      currentAppInstallation {
        activeSubscriptions {
          id
          name
          status
          test
        }
      }
    }
  `;

  const resp = await admin.graphql(query);
  const json = await resp.json();

  const subs =
    json?.data?.currentAppInstallation?.activeSubscriptions || [];

  return Array.isArray(subs) ? subs : [];
}

export async function getBillingContext({ shop, admin }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  // admin gelmezse crash etmeyelim
  if (!admin) {
    return {
      planKey: "free",
      isPro: false,
      mode: "shopify",
      free: { monthlyLimit: freeLimit, ...usage },
      activeSubscription: null,
    };
  }

  let subs = [];
  try {
    subs = await fetchActiveSubs(admin);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[BILLING] fetchActiveSubs error:", {
      name: e?.name,
      message: e?.message,
      stack: e?.stack,
    });
  }

  const active = subs.find((s) => s?.status === "ACTIVE") || null;
  const isPro = Boolean(active);

  return {
    planKey: isPro ? "pro" : "free",
    isPro,
    mode: "shopify",
    free: { monthlyLimit: freeLimit, ...usage },
    activeSubscription: active,
  };
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
    free: {
      monthlyLimit: freeLimit,
      ...usage,
      ...reservation,
    },
  };
}

export async function resetFreeUsage({ shop }) {
  return resetFreeUsageMonthly(shop);
}