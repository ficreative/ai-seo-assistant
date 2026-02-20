// app/billing.mock.server.js
// Server-only mock billing implementation.
//
// IMPORTANT:
// - Mock billing MUST NEVER be enabled in production.
// - Use ENABLE_BILLING_MOCK=true (and NODE_ENV !== "production") to allow local/dev testing.
// - In production, all shops are treated as FREE unless you wire in real Shopify Billing API logic.

import prisma from "./db.server.js";
import { BILLING_PLANS, DEFAULT_BILLING_MODE } from "./billing.plans.js";

export const BILLING_MOCK_ENABLED =
  process.env.ENABLE_BILLING_MOCK === "true" && process.env.NODE_ENV !== "production";

// Keep this for UI/debug display. In production we force it to "live".
export const BILLING_MODE = (BILLING_MOCK_ENABLED
  ? (process.env.BILLING_MODE || "mock")
  : (process.env.BILLING_MODE || DEFAULT_BILLING_MODE)
).toLowerCase();

export const PLAN_KEYS = {
  FREE: BILLING_PLANS.FREE.key,
  PRO: BILLING_PLANS.PRO.key,
};

export async function getMockSubscription(shop) {
  if (!shop) return null;
  return prisma.billingSubscription?.findUnique?.({ where: { shop } }) ?? null;
}

export async function getPlanForShop(shop) {
  // Production / mock-disabled: ALWAYS treat as Free here.
  // (Wire in real Shopify Billing API to compute PRO in production.)
  if (!BILLING_MOCK_ENABLED) {
    return { planKey: PLAN_KEYS.FREE, isPro: false, mode: "live" };
  }

  const sub = await prisma.billingSubscription.findUnique({ where: { shop } });
  const isPro = !!sub && sub.status === "active";
  return { planKey: isPro ? PLAN_KEYS.PRO : PLAN_KEYS.FREE, isPro, mode: "mock", subscription: sub };
}

function assertMockEnabled() {
  if (!BILLING_MOCK_ENABLED) {
    throw new Error("Mock billing is disabled. Configure real Shopify Billing for production.");
  }
}

export async function activatePro(shop, billingInterval = "monthly") {
  assertMockEnabled();
  if (!shop) throw new Error("Missing shop");
  const plan = billingInterval === "annual" ? "Pro Annual" : "Pro Monthly";
  return prisma.billingSubscription.upsert({
    where: { shop },
    update: { status: "active", plan, updatedAt: new Date() },
    create: { shop, status: "active", plan, createdAt: new Date(), updatedAt: new Date() },
  });
}

export async function cancelPro(shop) {
  assertMockEnabled();
  if (!shop) throw new Error("Missing shop");
  return prisma.billingSubscription.upsert({
    where: { shop },
    update: { status: "cancelled", updatedAt: new Date() },
    create: { shop, status: "cancelled", plan: "Pro Monthly", createdAt: new Date(), updatedAt: new Date() },
  });
}
