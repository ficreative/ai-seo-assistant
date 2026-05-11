// app/routes/app.jsx
import { useEffect, useMemo, useState } from "react";
import { Outlet, useLoaderData, useRouteError, isRouteErrorResponse } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider as ShopifyAppProvider } from "@shopify/shopify-app-react-router/react";
import { NavMenu } from "@shopify/app-bridge-react";
import { Page, Banner, Text, BlockStack, Box, Button, InlineStack } from "@shopify/polaris";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { getBillingContext } = await import("../billing.gating.server.js");
  const { session, admin } = await authenticate.admin(request);

  const url = new URL(request.url);
  const host = url.searchParams.get("host") || "";
  const embedded = url.searchParams.get("embedded") || "";

  const billing = await getBillingContext({ shop: session.shop, admin });

  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
    shop: session.shop || "",
    host,
    embedded,
    billing: {
      isPro: billing.isPro,
      planKey: billing.planKey,
      free: billing.free,
    },
  };
};

// (Aşağısı senin mevcut componentlerin aynı kalabilir)
export default function App() {
  const { apiKey, shop, host, embedded, billing } = useLoaderData();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (shop) window.sessionStorage.setItem("shopifyShop", shop);
    if (host) window.sessionStorage.setItem("shopifyHost", host);
    if (embedded) window.sessionStorage.setItem("shopifyEmbedded", embedded);
  }, [shop, host, embedded]);

  const navQuery = useMemo(() => {
    const out = new URLSearchParams();
    if (shop) out.set("shop", shop);
    if (host) out.set("host", host);
    if (embedded) out.set("embedded", embedded);
    const qs = out.toString();
    return qs ? `?${qs}` : "";
  }, [shop, host, embedded]);

  return (
    <ShopifyAppProvider apiKey={apiKey} embedded={true}>
      <NavMenu>
        <a href={`/app${navQuery}`} rel="home">Home</a>
        <a href={`/app/onboarding${navQuery}`}>Get started</a>
        <a href={`/app/seo-tools${navQuery}`}>SEO Tools</a>
        <a href={`/app/generation-history${navQuery}`}>Generation History</a>
        <a href={`/app/billing${navQuery}`}>Billing</a>
        <a href={`/app/settings${navQuery}`}>Settings</a>
      </NavMenu>

      {!billing?.isPro ? (
        <Box padding="300">
          <Banner tone="warning" title="Free plan limits">
            <BlockStack gap="200">
              <Text as="p" variant="bodyMd">
                You are currently on the Free plan. Some features are limited.
              </Text>
              {billing?.free ? (
                <Text as="p" variant="bodySm" tone="subdued">
                  Monthly usage: {billing.free.used}/{billing.free.limit} used · {billing.free.remaining} remaining
                </Text>
              ) : null}
              <InlineStack gap="200" wrap>
                <Button url={`/app/billing${navQuery}`} variant="primary">Upgrade to Pro</Button>
              </InlineStack>
            </BlockStack>
          </Banner>
        </Box>
      ) : null}

      <Outlet />
    </ShopifyAppProvider>
  );
}

export function ErrorBoundary() {
  const err = useRouteError();
  console.error("Route ErrorBoundary:", err);

  let title = "Route error";
  let message = "Unknown error";

  if (isRouteErrorResponse(err)) {
    title = `Error ${err.status}`;
    message = err.data || err.statusText;
  } else if (err instanceof Error) {
    message = err.message;
  } else {
    message = String(err);
  }

  return (
    <Page title={title}>
      <Banner tone="critical" title={title}>
        <Text as="p" variant="bodyMd">{message}</Text>
      </Banner>
    </Page>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);