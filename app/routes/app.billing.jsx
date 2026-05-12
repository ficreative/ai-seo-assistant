// app/routes/app.billing.jsx
import { useEffect, useMemo } from "react";
import { useFetcher, useLoaderData } from "react-router";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Badge,
  Button,
  List,
  InlineStack,
  Banner,
  Divider,
} from "@shopify/polaris";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

/**
 * Managed pricing plan selection page:
 * https://admin.shopify.com/store/:store_handle/charges/:app_handle/pricing_plans
 */
function getManagedPricingUrl({ shop, appHandle }) {
  const storeHandle = String(shop || "").replace(".myshopify.com", "");
  const handle = appHandle || process.env.SHOPIFY_APP_HANDLE || "ai-seo-assistant";
  return `https://admin.shopify.com/store/${storeHandle}/charges/${handle}/pricing_plans`;
}

export const loader = async ({ request }) => {
  const { authenticate } = await import("../shopify.server.js");
  const { getBillingContext } = await import("../billing.gating.server.js");

  const { session, billing } = await authenticate.admin(request);
  const ctx = await getBillingContext({ shop: session.shop, billing });

  const pricingUrl = getManagedPricingUrl({
    shop: session.shop,
    appHandle: process.env.SHOPIFY_APP_HANDLE,
  });

  return jsonResponse({
    shop: session.shop,
    billing: {
      planKey: ctx.planKey,
      isPro: ctx.isPro,
      mode: ctx.mode,
      free: ctx.free,
    },
    managedPricingUrl: pricingUrl,
  });
};

export const action = async ({ request }) => {
  const { authenticate } = await import("../shopify.server.js");

  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  const pricingUrl = getManagedPricingUrl({
    shop: session.shop,
    appHandle: process.env.SHOPIFY_APP_HANDLE,
  });

  // Managed pricing: Billing API ile charge oluşturmayacağız.
  // Upgrade / plan change / cancel hepsi Shopify’ın pricing page’inde.
  if (
    intent === "subscribe_monthly" ||
    intent === "subscribe_annual" ||
    intent === "manage_plans" ||
    intent === "cancel"
  ) {
    return jsonResponse({ ok: true, redirectUrl: pricingUrl });
  }

  if (intent === "reset_usage") {
    if (process.env.NODE_ENV === "production") {
      return jsonResponse({ ok: false, error: "Not allowed in production" }, 403);
    }
    const { resetFreeUsageMonthly } = await import("../billing.usage.server.js");
    await resetFreeUsageMonthly(session.shop);
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ ok: false, error: "Unknown intent" }, 400);
};

export default function Billing() {
  const { billing, managedPricingUrl } = useLoaderData();
  const fetcher = useFetcher();

  const error = fetcher.data?.ok === false ? fetcher.data?.error : null;

  // fetcher ile redirect gelirse top-level redirect yap (embedded admin içinde çalışır)
  useEffect(() => {
    const url = fetcher.data?.redirectUrl;
    if (!url) return;

    try {
      // Shopify admin içinde tam sayfa yönlendirme
      window.top.location.href = url;
    } catch (_e) {
      window.location.href = url;
    }
  }, [fetcher.data]);

  const free = billing?.free || { used: 0, remaining: 0, limit: 0, month: "" };
  const usageText = `${free.used}/${free.limit} used · ${free.remaining} remaining`;
  const monthLabel = free.month ? `Resets monthly (period: ${free.month})` : "Resets monthly";

  const proActive = !!billing?.isPro;

  const freeFeatures = useMemo(
    () => [
      "Up to 10 products / month",
      "Generate product meta title & description",
      "Generation history",
      "Basic support",
    ],
    []
  );

  const proFeatures = useMemo(
    () => [
      "Unlimited product generations",
      "Image ALT text generation",
      "Blog article SEO generation",
      "Bulk generate + bulk apply/publish",
      "Advanced filters & interactive tables",
      "Priority queue processing",
      "Retry failed items",
      "Detailed error insights",
    ],
    []
  );

  return (
    <Page title="Billing">
      <BlockStack gap="400">
        {error ? (
          <Banner tone="critical" title="Billing error">
            <Text as="p" variant="bodyMd">
              {error}
            </Text>
          </Banner>
        ) : null}

        <Layout>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="100">
                    <Text variant="headingMd" as="h2">
                      Free Plan
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      For trying the app
                    </Text>
                  </BlockStack>
                  <Badge tone={!proActive ? "success" : undefined}>
                    {!proActive ? "Current" : "Available"}
                  </Badge>
                </InlineStack>

                <Divider />

                <BlockStack gap="150">
                  <Text as="p" variant="bodyMd">
                    <b>Monthly limit:</b> {free.limit} products
                  </Text>
                  <Text as="p" variant="bodyMd">
                    <b>Usage:</b> {usageText}
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    {monthLabel}
                  </Text>
                </BlockStack>

                <Divider />

                <BlockStack gap="150">
                  <Text as="h3" variant="headingSm">
                    Features
                  </Text>
                  <List>
                    {freeFeatures.map((f) => (
                      <List.Item key={f}>{f}</List.Item>
                    ))}
                  </List>
                </BlockStack>

                <Divider />

                <fetcher.Form method="post">
                  <input type="hidden" name="intent" value="reset_usage" />
                  <Button tone="critical" variant="secondary">
                    Reset usage (dev)
                  </Button>
                </fetcher.Form>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="100">
                    <Text variant="headingMd" as="h2">
                      Pro Plan
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Unlimited + advanced tools
                    </Text>
                  </BlockStack>
                  <Badge tone={proActive ? "success" : undefined}>
                    {proActive ? "Active" : "Upgrade"}
                  </Badge>
                </InlineStack>

                <Divider />

                <BlockStack gap="200">
                  <Text as="p" variant="bodyMd">
                    <b>Monthly:</b> $19.90 / month
                  </Text>
                  <Text as="p" variant="bodyMd">
                    <b>Annual:</b> $200 / year
                  </Text>
                </BlockStack>

                <Divider />

                <BlockStack gap="150">
                  <Text as="h3" variant="headingSm">
                    Features
                  </Text>
                  <List>
                    {proFeatures.map((f) => (
                      <List.Item key={f}>{f}</List.Item>
                    ))}
                  </List>
                </BlockStack>

                <Divider />

                {/* Managed pricing: butonlar Shopify pricing page’e gider */}
                <InlineStack gap="200">
                  <fetcher.Form method="post">
                    <input type="hidden" name="intent" value="manage_plans" />
                    <Button submit variant="primary">
                      Start Monthly
                    </Button>
                  </fetcher.Form>

                  <fetcher.Form method="post">
                    <input type="hidden" name="intent" value="manage_plans" />
                    <Button submit variant="secondary">
                      Start Annual
                    </Button>
                  </fetcher.Form>
                </InlineStack>

                {/* Ayrıca direkt link (debug için faydalı) */}
                <Text as="p" tone="subdued" variant="bodySm">
                  If redirect is blocked, open:{" "}
                  <a href={managedPricingUrl} target="_top" rel="noreferrer">
                    Manage plans
                  </a>
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}