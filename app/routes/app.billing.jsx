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
 * Managed Pricing plan selection page:
 * https://admin.shopify.com/store/:store_handle/charges/:app_handle/pricing_plans
 * Docs: Shopify hosts plan selection page for managed pricing.
 */
function getPlanSelectionUrl({ shop, appHandle }) {
  const storeHandle = String(shop || "").replace(".myshopify.com", "");
  return `https://admin.shopify.com/store/${storeHandle}/charges/${appHandle}/pricing_plans`;
}

export const loader = async ({ request }) => {
  const { authenticate } = await import("../shopify.server.js");
  const { getBillingContext } = await import("../billing.gating.server.js");

  const { session, admin } = await authenticate.admin(request);
  const ctx = await getBillingContext({ shop: session.shop, admin });

  return jsonResponse({
    shop: session.shop,
    billing: {
      planKey: ctx.planKey,
      isPro: ctx.isPro,
      mode: ctx.mode,
      free: ctx.free,
    },
  });
};

export const action = async ({ request }) => {
  const { authenticate } = await import("../shopify.server.js");
  const { getBillingContext } = await import("../billing.gating.server.js");

  const { session, admin } = await authenticate.admin(request);

  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  // Managed pricing için handle env'den geliyor (Shopify Partner Dashboard -> App handle)
  const appHandle =
    process.env.SHOPIFY_APP_HANDLE ||
    process.env.SHOPIFY_APP_HANDLE?.trim() ||
    "ai-seo-assistant"; // fallback (istersen kaldır)

  try {
    // ✅ Start Monthly / Start Annual -> aynı Shopify plan seçim sayfasına gider
    if (intent === "subscribe_monthly" || intent === "subscribe_annual") {
      if (!process.env.SHOPIFY_APP_HANDLE) {
        return jsonResponse(
          {
            ok: false,
            error:
              "Missing SHOPIFY_APP_HANDLE env. Set it to your app handle (e.g. ai-seo-assistant).",
          },
          500
        );
      }

      const redirectUrl = getPlanSelectionUrl({
        shop: session.shop,
        appHandle: process.env.SHOPIFY_APP_HANDLE,
      });

      return jsonResponse({ ok: true, redirectUrl });
    }

    // ✅ Cancel / Manage Plan: Managed pricing'te iptal/upgrade/downgrade Shopify sayfasından yapılır.
    if (intent === "manage_plan") {
      if (!process.env.SHOPIFY_APP_HANDLE) {
        return jsonResponse(
          {
            ok: false,
            error:
              "Missing SHOPIFY_APP_HANDLE env. Set it to your app handle (e.g. ai-seo-assistant).",
          },
          500
        );
      }

      const redirectUrl = getPlanSelectionUrl({
        shop: session.shop,
        appHandle: process.env.SHOPIFY_APP_HANDLE,
      });

      return jsonResponse({ ok: true, redirectUrl });
    }

    if (intent === "reset_usage") {
      if (process.env.NODE_ENV === "production") {
        return jsonResponse({ ok: false, error: "Not allowed in production" }, 403);
      }
      const { resetFreeUsageMonthly } = await import("../billing.usage.server.js");
      await resetFreeUsageMonthly(session.shop);
      return jsonResponse({ ok: true });
    }

    // refresh / re-check (opsiyonel)
    if (intent === "refresh") {
      const ctx = await getBillingContext({ shop: session.shop, admin });
      return jsonResponse({
        ok: true,
        billing: {
          planKey: ctx.planKey,
          isPro: ctx.isPro,
          mode: ctx.mode,
          free: ctx.free,
        },
      });
    }

    return jsonResponse({ ok: false, error: "Unknown intent" }, 400);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[BILLING] action error:", e);
    return jsonResponse({ ok: false, error: msg }, 500);
  }
};

export default function Billing() {
  const { billing } = useLoaderData();
  const fetcher = useFetcher();

  const error = fetcher.data?.ok === false ? fetcher.data?.error : null;

  // ✅ Redirect gerekiyorsa embedded olduğu için top-window'a yönlendir
  useEffect(() => {
    const redirectUrl = fetcher.data?.redirectUrl;
    if (!redirectUrl) return;

    try {
      if (window.top) window.top.location.href = redirectUrl;
      else window.location.href = redirectUrl;
    } catch (_e) {
      window.location.href = redirectUrl;
    }
  }, [fetcher.data]);

  const free = billing?.free || { used: 0, remaining: 0, limit: 0, month: "" };
  const usageText = `${free.used}/${free.limit} used · ${free.remaining} remaining`;
  const monthLabel = free.month ? `Resets monthly (period: ${free.month})` : "Resets monthly";

  const proActive = billing?.isPro;
  const isSubmitting = fetcher.state !== "idle";

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
              {String(error)}
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
                  <Button tone="critical" variant="secondary" disabled={isSubmitting}>
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

                {!proActive ? (
                  <InlineStack gap="200">
                    <fetcher.Form method="post">
                      <input type="hidden" name="intent" value="subscribe_monthly" />
                      <Button submit variant="primary" loading={isSubmitting} disabled={isSubmitting}>
                        Start Monthly
                      </Button>
                    </fetcher.Form>

                    <fetcher.Form method="post">
                      <input type="hidden" name="intent" value="subscribe_annual" />
                      <Button submit variant="secondary" loading={isSubmitting} disabled={isSubmitting}>
                        Start Annual
                      </Button>
                    </fetcher.Form>
                  </InlineStack>
                ) : (
                  <fetcher.Form method="post">
                    <input type="hidden" name="intent" value="manage_plan" />
                    <Button submit variant="primary" loading={isSubmitting} disabled={isSubmitting}>
                      Manage plan
                    </Button>
                  </fetcher.Form>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}