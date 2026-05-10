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
  const { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } = await import("../shopify.server.js");
  const { getBillingContext, isTestBilling } = await import("../billing.gating.server.js");

  const { session, admin } = await authenticate.admin(request);

  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  const url = new URL(request.url);
  const base = process.env.SHOPIFY_APP_URL || url.origin;

  const returnUrlObj = new URL(`${base}/app/billing`);
  for (const [k, v] of url.searchParams.entries()) returnUrlObj.searchParams.set(k, v);
  returnUrlObj.searchParams.set("shop", session.shop);
  returnUrlObj.searchParams.set("embedded", "1");
  const returnUrl = returnUrlObj.toString();

  try {
    if (!admin) {
      return jsonResponse({ ok: false, error: "Admin client missing." }, 500);
    }

    const test = isTestBilling();

    if (intent === "subscribe_monthly" || intent === "subscribe_annual") {
      const planName = intent === "subscribe_monthly" ? MONTHLY_PLAN : ANNUAL_PLAN;
      const interval = intent === "subscribe_monthly" ? "EVERY_30_DAYS" : "ANNUAL";
      const amount = intent === "subscribe_monthly" ? 19.9 : 200;

      const mutation = `#graphql
        mutation CreateSub(
          $name: String!
          $returnUrl: URL!
          $test: Boolean!
          $lineItems: [AppSubscriptionLineItemInput!]!
        ) {
          appSubscriptionCreate(
            name: $name
            returnUrl: $returnUrl
            test: $test
            lineItems: $lineItems
          ) {
            confirmationUrl
            userErrors { field message }
            appSubscription { id name status }
          }
        }
      `;

      const variables = {
        name: planName,
        returnUrl,
        test,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                interval,
                price: { amount, currencyCode: "USD" },
              },
            },
          },
        ],
      };

      const resp = await admin.graphql(mutation, { variables });
      const json = await resp.json();

      const payload = json?.data?.appSubscriptionCreate;
      const userErrors = payload?.userErrors || [];

      if (userErrors.length) {
        console.error("[BILLING] appSubscriptionCreate userErrors:", userErrors);
        return jsonResponse({ ok: false, error: userErrors.map((u) => u.message).join(" | ") }, 400);
      }

      const confirmationUrl = payload?.confirmationUrl;
      if (!confirmationUrl) {
        console.error("[BILLING] Missing confirmationUrl. Full response:", json);
        return jsonResponse({ ok: false, error: "Missing confirmationUrl from Shopify." }, 500);
      }

      return Response.redirect(confirmationUrl, 302);
    }

    if (intent === "cancel") {
      const ctx = await getBillingContext({ shop: session.shop, admin });
      const sub = ctx.activeSubscription;

      if (!sub?.id) {
        return jsonResponse({ ok: false, error: "No active subscription found." }, 400);
      }

      const mutation = `#graphql
        mutation CancelSub($id: ID!, $prorate: Boolean) {
          appSubscriptionCancel(id: $id, prorate: $prorate) {
            userErrors { field message }
            appSubscription { id status }
          }
        }
      `;

      const resp = await admin.graphql(mutation, { variables: { id: sub.id, prorate: true } });
      const json = await resp.json();

      const payload = json?.data?.appSubscriptionCancel;
      const userErrors = payload?.userErrors || [];
      if (userErrors.length) {
        console.error("[BILLING] appSubscriptionCancel userErrors:", userErrors);
        return jsonResponse({ ok: false, error: userErrors.map((u) => u.message).join(" | ") }, 400);
      }

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

    return jsonResponse({ ok: false, error: "Unknown intent" }, 400);
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    console.error("[BILLING] action error:", {
      name: err.name,
      message: err.message,
      cause: err.cause,
    });
    console.error("[BILLING] action error stack:", err.stack);
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
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

  const free = billing?.free || { used: 0, remaining: 0, limit: 0, month: "" };
  const usageText = `${free.used}/${free.limit} used · ${free.remaining} remaining`;
  const monthLabel = free.month ? `Resets monthly (period: ${free.month})` : "Resets monthly";

  const proActive = billing?.isPro;

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
            <Text as="p" variant="bodyMd">{error}</Text>
          </Banner>
        ) : null}

        <Layout>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="100">
                    <Text variant="headingMd" as="h2">Free Plan</Text>
                    <Text as="p" variant="bodySm" tone="subdued">For trying the app</Text>
                  </BlockStack>
                  <Badge tone={!proActive ? "success" : undefined}>
                    {!proActive ? "Current" : "Available"}
                  </Badge>
                </InlineStack>

                <Divider />

                <BlockStack gap="150">
                  <Text as="p" variant="bodyMd"><b>Monthly limit:</b> {free.limit} products</Text>
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
                    <Text variant="headingMd" as="h2">Pro Plan</Text>
                    <Text as="p" variant="bodySm" tone="subdued">Unlimited + advanced tools</Text>
                  </BlockStack>
                  <Badge tone={proActive ? "success" : undefined}>
                    {proActive ? "Active" : "Upgrade"}
                  </Badge>
                </InlineStack>

                <Divider />

                <BlockStack gap="200">
                  <Text as="p" variant="bodyMd"><b>Monthly:</b> $19.90 / month</Text>
                  <Text as="p" variant="bodyMd"><b>Annual:</b> $200 / year</Text>
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