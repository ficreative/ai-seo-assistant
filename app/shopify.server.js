import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
  BillingInterval,
} from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server.js";

export const MONTHLY_PLAN = "pro_monthly";
export const ANNUAL_PLAN = "pro_annual";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October25,

  // SCOPES env: "read_products,write_products,..."
  scopes: (process.env.SCOPES || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",

  sessionStorage: new PrismaSessionStorage(prisma),

  // App Store dağıtımı
  distribution: AppDistribution.AppStore,

  // ✅ Shopify Billing API plan config (handle'lar: pro_monthly, pro_annual)
  billing: {
    [MONTHLY_PLAN]: {
      lineItems: [
        {
          amount: 19.9,
          currencyCode: "USD",
          interval: BillingInterval.Every30Days,
        },
      ],
    },
    [ANNUAL_PLAN]: {
      lineItems: [
        {
          amount: 200,
          currencyCode: "USD",
          interval: BillingInterval.Annual,
        },
      ],
    },
  },

  webhooks: {
    CUSTOMERS_DATA_REQUEST: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks/customers/data_request",
    },
    CUSTOMERS_REDACT: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks/customers/redact",
    },
    SHOP_REDACT: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks/shop/redact",
    },
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks/app/uninstalled",
    },
    APP_SCOPES_UPDATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks/app/scopes_update",
    },
  },

  future: {
    expiringOfflineAccessTokens: true,
  },

  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;

export const apiVersion = ApiVersion.October25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;