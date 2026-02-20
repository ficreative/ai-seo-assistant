// app/routes/app.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Outlet,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";

import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider as ShopifyAppProvider } from "@shopify/shopify-app-react-router/react";
import { NavMenu } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

import { Page, Banner, Text, BlockStack, Box, Button, InlineStack } from "@shopify/polaris";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const url = new URL(request.url);
  const host = url.searchParams.get("host") || "";
  const embedded = url.searchParams.get("embedded") || "";

  const { getBillingContext } = await import("../billing.gating.server.js");
  const billing = await getBillingContext(session.shop);

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

function ClientCrashCatcher({ children }) {
  const [err, setErr] = useState(null);

  useEffect(() => {
    const onError = (e) => {
      const error = e?.error || e;
      console.error("ClientCrashCatcher error:", error);
      setErr(error instanceof Error ? error : new Error(String(error)));
    };
    const onRejection = (e) => {
      console.error("ClientCrashCatcher rejection:", e?.reason);
      const r = e?.reason;
      setErr(r instanceof Error ? r : new Error(String(r)));
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  if (!err) return children;

  return (
    <Page title="Render error">
      <Banner tone="critical" title="Render crashed">
        <BlockStack gap="200">
          <Text as="p" variant="bodyMd">
            {err.message}
          </Text>
          {err.stack ? (
            <Box padding="200" background="bg-surface-secondary" borderRadius="200">
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{err.stack}</pre>
            </Box>
          ) : null}
        </BlockStack>
      </Banner>
    </Page>
  );
}


function FloatingEmailButton() {
  const subject = encodeURIComponent("FiDevTeam Support");
  const body = encodeURIComponent(
    "Hello,\n\nI need support with the app:\n\n- Store: \n- Issue: \n- Related page: \n- Additional details: \n\nThanks."
  );

  const href = `mailto:hello@fidevteam.com?subject=${subject}&body=${body}`;

  
  const handleClick = (e) => {
    e.preventDefault();
    try {
      if (window.top) {
        window.top.location.href = href;
      } else {
        window.location.href = href;
      }
    } catch (_err) {
      window.location.href = href;
    }
  };

return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        width: 56,
        height: 56,
        borderRadius: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
        background: "linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)",
        zIndex: 9999,
border: "1px solid rgba(255,255,255,0.25)",
      }}
      aria-label="Mail support"
      title="Mail support"
    >
      {/* Simple mail icon (SVG) */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4 7.5C4 6.12 5.12 5 6.5 5H17.5C18.88 5 20 6.12 20 7.5V16.5C20 17.88 18.88 19 17.5 19H6.5C5.12 19 4 17.88 4 16.5V7.5Z"
          stroke="white"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M5.5 7L12 12L18.5 7"
          stroke="white"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

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

      <ClientCrashCatcher>
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
                  <Button url={`/app/billing${navQuery}`} variant="primary">
                    Upgrade to Pro
                  </Button>
                </InlineStack>
              </BlockStack>
            </Banner>
          </Box>
        ) : null}
        <Outlet />
      </ClientCrashCatcher>

      <FloatingEmailButton />
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
        <Text as="p" variant="bodyMd">
          {message}
        </Text>
      </Banner>
    </Page>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);