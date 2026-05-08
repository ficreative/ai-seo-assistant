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
  return String(process.env.SHOPIFY_BILLING_TEST || "")
    .toLowerCase()
    .trim() === "true";
}

/**
 * Reads current app subscriptions via Admin GraphQL (Billing API).
 * This avoids relying on `billing.check` helper which is the source of your crash.
 */
async function fetchActiveSubscriptions(admin) {
  const query = `#graphql
    query ActiveSubscriptions {
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
  return subs;
}

export async function getBillingContext({ shop, admin }) {
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;
  const usage = await getFreeUsageMonthly(shop, freeLimit);

  const subs = await fetchActiveSubscriptions(admin);
  const active = subs.find(
    (s) =>
      (s?.status || "").toUpperCase() === "ACTIVE" &&
      (s?.name === MONTHLY_PLAN || s?.name === ANNUAL_PLAN)
  );

  const isPro = Boolean(active);
  const planKey = active?.name || "free";

  return {
    shop,
    isPro,
    planKey,
    mode: "shopify",
    activeSubscription: active || null,
    free: { monthlyLimit: freeLimit, ...usage },
    plans: BILLING_PLANS,
  };
}

/**
 * Create subscription + return confirmationUrl (Billing API).
 */
export async function requestSubscription({
  admin,
  plan,
  returnUrl,
  test = false,
}) {
  const isMonthly = plan === MONTHLY_PLAN;

  const mutation = `#graphql
    mutation AppSubscriptionCreate(
      $name: String!
      $returnUrl: URL!
      $test: Boolean
      $lineItems: [AppSubscriptionLineItemInput!]!
    ) {
      appSubscriptionCreate(
        name: $name
        returnUrl: $returnUrl
        test: $test
        lineItems: $lineItems
      ) {
        confirmationUrl
        userErrors { field message }
      }
    }
  `;

  const lineItems = isMonthly
    ? [
        {
          plan: {
            appRecurringPricingDetails: {
              price: { amount: 19.9, currencyCode: "USD" },
              interval: "EVERY_30_DAYS",
            },
          },
        },
      ]
    : [
        {
          plan: {
            appRecurringPricingDetails: {
              price: { amount: 200, currencyCode: "USD" },
              interval: "ANNUAL",
            },
          },
        },
      ];

  const resp = await admin.graphql(mutation, {
    variables: {
      name: plan,
      returnUrl,
      test: Boolean(test),
      lineItems,
    },
  });

  const json = await resp.json();
  const payload = json?.data?.appSubscriptionCreate;

  const errors = payload?.userErrors || [];
  if (errors.length) {
    const msg = errors.map((e) => e.message).join(" | ");
    throw new Error(msg);
  }

  const confirmationUrl = payload?.confirmationUrl;
  if (!confirmationUrl) throw new Error("Missing confirmationUrl from Shopify");

  return confirmationUrl;
}

export async function cancelSubscription({
  admin,
  subscriptionId,
  prorate = true,
}) {
  const mutation = `#graphql
    mutation AppSubscriptionCancel($id: ID!, $prorate: Boolean) {
      appSubscriptionCancel(id: $id, prorate: $prorate) {
        appSubscription { id status }
        userErrors { field message }
      }
    }
  `;

  const resp = await admin.graphql(mutation, {
    variables: { id: subscriptionId, prorate: Boolean(prorate) },
  });

  const json = await resp.json();
  const payload = json?.data?.appSubscriptionCancel;
  const errors = payload?.userErrors || [];
  if (errors.length) {
    const msg = errors.map((e) => e.message).join(" | ");
    throw new Error(msg);
  }

  return payload?.appSubscription || null;
}

export async function reserveIfFreePlan({ shop, admin, productCount }) {
  const ctx = await getBillingContext({ shop, admin });
  const freeLimit = BILLING_PLANS.FREE.monthlyProductLimit;

  if (ctx.isPro) {
    return { ok: true, planKey: ctx.planKey, mode: ctx.mode, free: ctx.free };
  }

  const reservation = await reserveFreeUsageMonthly(
    shop,
    productCount,
    freeLimit
  );

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