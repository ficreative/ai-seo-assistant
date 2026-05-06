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

import { authenticate } from "../shopify.server";
import { BILLING_PLANS } from "../billing.plans.js";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const { session, admin } = await authenticate.admin(request);
  const ctx = await getBillingContext({ shop: session.shop, admin });

  return jsonResponse({
    shop: session.shop,
    billing: {
      planKey: ctx.planKey,
      isPro: ctx.isPro,
      mode: ctx.mode,
      free: ctx.free,
      subscription: ctx.subscription,
    },
  });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  const shopify = (await import("../shopify.server.js")).default;
  const { MONTHLY_PLAN, ANNUAL_PLAN } = await import("../shopify.server.js");

  const isTest = process.env.SHOPIFY_BILLING_TEST === "true" || process.env.NODE_ENV !== "production";

  try {
    if (intent === "subscribe_monthly") {
      const confirmationUrl = await shopify.billing.request({
        session,
        plan: MONTHLY_PLAN,
        isTest,
        // returnUrl opsiyonel; boş bırakınca embedded için doğru URL’yi seçer
      });
      return jsonResponse({ ok: true, confirmationUrl });
    }

    if (intent === "subscribe_annual") {
      const confirmationUrl = await shopify.billing.request({
        session,
        plan: ANNUAL_PLAN,
        isTest,
      });
      return jsonResponse({ ok: true, confirmationUrl });
    }

    if (intent === "cancel") {
      const check = await shopify.billing.check({
        session,
        plans: [MONTHLY_PLAN, ANNUAL_PLAN],
        isTest,
        returnObject: true,
      });

      const subscriptionId = check?.appSubscriptions?.[0]?.id;
      if (!subscriptionId) return jsonResponse({ ok: false, error: "No active subscription found" }, 400);

      await shopify.billing.cancel({ session, subscriptionId });
      return jsonResponse({ ok: true });
    }

    if (intent === "reset_usage") {
      if (process.env.NODE_ENV === "production") {
        return jsonResponse({ ok: false, error: "Not allowed in production" }, 403);
      }
      const { resetFreeUsage } = await import("../billing.gating.server.js");
      await resetFreeUsage({ shop: session.shop });
      return jsonResponse({ ok: true });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return jsonResponse({ ok: false, error: msg }, 500);
  }

  return jsonResponse({ ok: false, error: "Unknown intent" }, 400);
};

export default function Billing() {
  const { billing } = useLoaderData();
  const fetcher = useFetcher();

  const error = fetcher.data?.ok === false ? fetcher.data?.error : null;

  // ✅ Shopify confirmation URL geldiyse top-level redirect yap
  useEffect(() => {
    const url = fetcher.data?.confirmationUrl;
    if (!url) return;

    try {
      window.top.location.href = url;
    } catch {
      window.location.href = url;
    }
  }, [fetcher.data]);

  // ✅ Cancel sonrası sayfayı yenile
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok && !fetcher.data?.confirmationUrl) {
      window.location.reload();
    }
  }, [fetcher.state, fetcher.data]);

  const free = billing?.free || {
    used: 0,
    remaining: BILLING_PLANS.FREE.monthlyProductLimit,
    limit: BILLING_PLANS.FREE.monthlyProductLimit,
    month: "",
  };

  const usageText = `${free.used}/${free.limit} used · ${free.remaining} remaining`;
  const monthLabel = free.month ? `Resets monthly (period: ${free.month})` : "Resets monthly";

  const proActive = Boolean(billing?.isPro);

  const freeFeatures = useMemo(() => BILLING_PLANS.FREE.features, []);
  const proFeatures = useMemo(() => BILLING_PLANS.PRO.features, []);

  return (
    <Page title="Billing">
      <BlockStack gap="400">
        {error ? (
          <Banner tone="critical" title="Billing error">
            <Text as="p" variant="bodyMd">{error}</Text>
          </Banner>
        ) : null}

        <Layout>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="100">
                    <Text variant="headingMd" as="h2">{BILLING_PLANS.FREE.title}</Text>
                    <Text as="p" variant="bodySm" tone="subdued">{BILLING_PLANS.FREE.subtitle}</Text>
                  </BlockStack>
                  <Badge tone={!proActive ? "success" : undefined}>{!proActive ? "Current" : "Available"}</Badge>
                </InlineStack>

                <Divider />

                <BlockStack gap="150">
                  <Text as="p" variant="bodyMd"><b>Monthly limit:</b> {BILLING_PLANS.FREE.monthlyProductLimit} products</Text>
                  <Text as="p" variant="bodyMd"><b>Usage:</b> {usageText}</Text>
                  <Text as="p" variant="bodySm" tone="subdued">{monthLabel}</Text>
                </BlockStack>

                <Divider />

                <BlockStack gap="150">
                  <Text as="h3" variant="headingSm">Features</Text>
                  <List>
                    {freeFeatures.map((f) => <List.Item key={f}>{f}</List.Item>)}
                  </List>
                </BlockStack>

                <Divider />

                <fetcher.Form method="post">
                  <input type="hidden" name="intent" value="reset_usage" />
                  <Button tone="critical" variant="secondary">Reset usage (dev)</Button>
                </fetcher.Form>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="100">
                    <Text variant="headingMd" as="h2">{BILLING_PLANS.PRO.title}</Text>
                    <Text as="p" variant="bodySm" tone="subdued">{BILLING_PLANS.PRO.subtitle}</Text>
                  </BlockStack>
                  <Badge tone={proActive ? "success" : undefined}>{proActive ? "Active" : "Upgrade"}</Badge>
                </InlineStack>

                <Divider />

                <BlockStack gap="200">
                  <Text as="p" variant="bodyMd"><b>Monthly:</b> {BILLING_PLANS.PRO.priceMonthlyText}</Text>
                  <Text as="p" variant="bodyMd"><b>Annual:</b> {BILLING_PLANS.PRO.priceAnnualText}</Text>
                </BlockStack>

                <Divider />

                <BlockStack gap="150">
                  <Text as="h3" variant="headingSm">Features</Text>
                  <List>
                    {proFeatures.map((f) => <List.Item key={f}>{f}</List.Item>)}
                  </List>
                </BlockStack>

                <Divider />

                {!proActive ? (
                  <InlineStack gap="200">
                    <fetcher.Form method="post">
                      <input type="hidden" name="intent" value="subscribe_monthly" />
                      <Button submit variant="primary">Start Monthly</Button>
                    </fetcher.Form>
                    <fetcher.Form method="post">
                      <input type="hidden" name="intent" value="subscribe_annual" />
                      <Button submit variant="secondary">Start Annual</Button>
                    </fetcher.Form>
                  </InlineStack>
                ) : (
                  <fetcher.Form method="post">
                    <input type="hidden" name="intent" value="cancel" />
                    <Button submit tone="critical">Cancel subscription</Button>
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