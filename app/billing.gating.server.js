import { BILLING_PLANS } from "./billing.plans.js";
import {
  getFreeUsageMonthly,
  reserveFreeUsageMonthly,
  resetFreeUsageMonthly,
} from "./billing.usage.server.js";

import { MONTHLY_PLAN, ANNUAL_PLAN } from "./shopify.server.js";
export { MONTHLY_PLAN, ANNUAL_PLAN };

export function isTestBilling() {
  return String(process.env.SHOPIFY_BILLING_TEST || "").toLowerCase() === "true";
}

/**
 * ✅ getBillingContext({ shop, admin })
 * admin: authenticate.admin(request) içinden gelen admin client
 */
export async function getBillingContext({ shop, admin }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  if (!admin) {
    return {
      planKey: "free",
      isPro: false,
      mode: "no_admin",
      activeSubscription: null,
      free: { monthlyLimit: freeLimit, ...usage },
      plans: BILLING_PLANS,
    };
  }

  // Active subscriptions çek
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

  const subs = json?.data?.currentAppInstallation?.activeSubscriptions || [];

  // Pro saymak için: adı planlarımızdan biri + status ACTIVE
  const active = subs.find(
    (s) =>
      (s?.name === MONTHLY_PLAN || s?.name === ANNUAL_PLAN) &&
      String(s?.status || "").toUpperCase() === "ACTIVE"
  );

  const isPro = Boolean(active);
  const planKey = active?.name || "free";

  return {
    planKey,
    isPro,
    mode: "shopify_graphql",
    activeSubscription: active || null,
    free: { monthlyLimit: freeLimit, ...usage },
    plans: BILLING_PLANS,
    raw: { subs },
  };
}

export async function reserveIfFreePlan({ shop, productCount, admin }) {
  const ctx = await getBillingContext({ shop, admin });
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