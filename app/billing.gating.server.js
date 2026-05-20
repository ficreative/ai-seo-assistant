// app/billing.gating.server.js
import { BILLING_PLANS } from "./billing.plans.js";
import {
  getFreeUsageMonthly,
  reserveFreeUsageMonthly,
  resetFreeUsageMonthly,
} from "./billing.usage.server.js";

export const PRO_PLAN = "pro";

export function isTestBilling() {
  return String(process.env.SHOPIFY_BILLING_TEST || "").toLowerCase() === "true";
}

function isDevForceProEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    String(process.env.DEV_FORCE_PRO || "").toLowerCase() === "true"
  );
}

function devForceProContext({ freeLimit, usage }) {
  return {
    planKey: "pro_dev",
    isPro: true,
    mode: "dev_force_pro",
    free: {
      monthlyLimit: freeLimit,
      limit: freeLimit,
      used: usage?.used || 0,
      remaining: freeLimit,
      ...usage,
    },
    activeSubscription: {
      id: "dev_force_pro",
      name: "Pro Dev",
      status: "ACTIVE",
      test: true,
    },
  };
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

export async function getBillingContext(input = {}) {
  const params =
    typeof input === "string"
      ? { shop: input, admin: null }
      : input || {};

  const { shop, admin } = params;

  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  if (isDevForceProEnabled()) {
    return devForceProContext({ freeLimit, usage });
  }

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

export async function reserveIfFreePlan({ shop, productCount, admin = null }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  if (isDevForceProEnabled()) {
    return {
      ok: true,
      code: "DEV_FORCE_PRO",
      planKey: "pro_dev",
      isPro: true,
      mode: "dev_force_pro",
      free: {
        monthlyLimit: freeLimit,
        limit: freeLimit,
        ...usage,
        remaining: freeLimit,
      },
    };
  }

  // Worker-side Pro protection:
  // If an admin client is available, check Shopify active subscriptions.
  // Pro stores must NOT be blocked by free monthly limits.
  if (admin) {
    let subs = [];

    try {
      subs = await fetchActiveSubs(admin);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[BILLING] reserveIfFreePlan fetchActiveSubs error:", {
        shop,
        name: e?.name,
        message: e?.message,
      });
    }

    const active = subs.find((s) => s?.status === "ACTIVE") || null;

    if (active) {
      return {
        ok: true,
        code: "PRO_ACTIVE",
        planKey: "pro",
        isPro: true,
        mode: "shopify",
        free: {
          monthlyLimit: freeLimit,
          limit: freeLimit,
          ...usage,
          remaining: freeLimit,
        },
        activeSubscription: active,
      };
    }
  }

  const reservation = await reserveFreeUsageMonthly(shop, productCount, freeLimit);

  return {
    ok: reservation.ok,
    code: reservation.code,
    planKey: "free",
    isPro: false,
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