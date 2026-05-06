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

import { BILLING_PLANS } from "../billing.plans.js";
import { MONTHLY_PLAN, ANNUAL_PLAN } from "../shopify.server.js";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function isTestBilling() {
  return String(process.env.SHOPIFY_BILLING_TEST || "").toLowerCase() === "true";
}

export const loader = async ({ request }) => {
  const { authenticate } = await import("../shopify.server.js");
  const { getBillingContext } = await import("../billing.gating.server.js");

  const { session, billing } = await authenticate.admin(request);
  const ctx = await getBillingContext({ shop: session.shop, billing });

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

  const { session, billing } = await authenticate.admin(request);

  const url = new URL(request.url);
  const returnUrl = `${process.env.SHOPIFY_APP_URL || url.origin}/app/billing?${url.searchParams.toString()}`;

  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  try {
    if (intent === "subscribe_monthly") {
      // ✅ This will usually REDIRECT by throwing/returning a Response
      return await billing.request({
        plan: MONTHLY_PLAN,
        isTest: isTestBilling(),
        returnUrl,
      });
    }

    if (intent === "subscribe_annual") {
      return await billing.request({
        plan: ANNUAL_PLAN,
        isTest: isTestBilling(),
        returnUrl,
      });
    }

    if (intent === "cancel") {
      const ctx = await getBillingContext({ shop: session.shop, billing });
      const sub = ctx.activeSubscription;

      if (!sub?.id) {
        return jsonResponse({ ok: false, error: "No active subscription found." }, 400);
      }

      await billing.cancel({
        subscriptionId: sub.id,
        isTest: isTestBilling(),
        prorate: true,
      });

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
    // ✅ IMPORTANT: billing.request can throw a Response (redirect). Don't swallow it.
    if (e instanceof Response) return e;

    const msg = e instanceof Error ? e.message : String(e);
    return jsonResponse({ ok: false, error: msg }, 500);
  }

  return jsonResponse({ ok: false, error: "Unknown intent" }, 400);
};

export default function Billing() {
  const { billing } = useLoaderData();
  const fetcher = useFetcher();

  const error = fetcher.data?.ok === false ? fetcher.data?.error : null;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
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

  const proActive = billing?.isPro;

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
                  <Badge tone={!proActive ? "success" : undefined}>
                    {!proActive ? "Current" : "Available"}
                  </Badge>
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