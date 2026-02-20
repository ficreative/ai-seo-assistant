// app/billing.plans.js
// Client-safe plan metadata (NO server-only imports here).

export const BILLING_PLANS = {
  FREE: {
    key: "FREE",
    title: "Free Plan",
    subtitle: "For trying the app",
    monthlyProductLimit: 10,
    features: [
      "Up to 10 products / month",
      "Generate product meta title & description",
      "Generation history",
      "Basic support",
    ],
  },
  PRO: {
    key: "PRO",
    title: "Pro Plan",
    subtitle: "Unlimited + advanced tools",
    features: [
      "Unlimited product generations",
      "Image ALT text generation",
      "Blog article SEO generation",
      "Bulk generate + bulk apply/publish",
      "Advanced filters & interactive tables",
      "Priority queue processing",
      "Retry failed items",
      "Detailed error insights",
      "Debug report export",
      "Priority support",
    ],
    // Display-only (mock billing). Real billing can override later.
    priceMonthlyText: "$19.90 / month",
    priceAnnualText: "$200 / year",
  },
};

export const DEFAULT_BILLING_MODE = "mock"; // "mock" | "shopify"
