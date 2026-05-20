// app/routes/app._index.jsx
import {
  redirect,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";

import { boundary } from "@shopify/shopify-app-react-router/server";
import { Page, Banner, Text } from "@shopify/polaris";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  const url = new URL(request.url);

  // Keep Shopify embedded query params such as shop, host, embedded, etc.
  return redirect(`/app/onboarding${url.search || ""}`);
};

export default function AppIndex() {
  return null;
}

export const headers = (headersArgs) => boundary.headers(headersArgs);

/** ---------------- route ErrorBoundary ---------------- */
export function ErrorBoundary() {
  const err = useRouteError();

  // eslint-disable-next-line no-console
  console.error("App index redirect ErrorBoundary:", err);

  let bannerTitle = "Something went wrong";
  let message = "Unknown error";

  if (isRouteErrorResponse(err)) {
    bannerTitle = `Error ${err.status}`;
    message = err.data || err.statusText;
  } else if (err instanceof Error) {
    message = err.message;
  } else {
    message = String(err);
  }

  return (
    <Page title="AI SEO Assistant" fullWidth>
      <Banner tone="critical" title={bannerTitle}>
        <Text as="p" variant="bodyMd">
          {message}
        </Text>
      </Banner>
    </Page>
  );
}