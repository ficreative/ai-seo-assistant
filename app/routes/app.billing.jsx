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

import { authenticate } from "../shopify.server";
import { BILLING_PLANS } from "../shopify.server"; // yukarıda export ettiğimiz

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function adminReturnUrl(shop) {
  const handle = process.env.SHOPIFY_APP_HANDLE;
  if (!handle) {
    // handle yoksa bile en azından Admin home’a dönsün
    return `https://${shop}/admin`;
  }
  return `https://${shop}/admin/apps/${handle}`;
}

// Dev store ise test charge kullan (reviewer test store ile denerken şart)
function isTestShop(shop) {
  // Basit: dev mağazalarda genelde *.myshopify.com ve ödeme aktif değil.
  // İstersen burada daha sağlam “isDevelopmentStore” kontrolü ekleriz.
  return process.env.SHOPIFY_BILLING_TEST === "true";
}

export const loader = async ({ request }) => {
  const { session, billing } = await authenticate.admin(request);

  // ✅ Shopify’dan gerçek durum okunuyor
  const check = await billing.check({
    plans: [BILLING_PLANS.PRO_MONTHLY, BILLING_PLANS.PRO_ANNUAL],
    isTest: isTestShop(session.shop),
  });

  const active = check?.hasActivePayment ?? false;
  const activeSubs = check?.appSubscriptions ?? [];
  const activePlan =
    activeSubs?.[0]?.name || (active ? "PRO" : "FREE");

  return jsonResponse({
    shop: session.shop,
    billing: {
      isPro: active,
      activePlan,
      subscriptions: activeSubs.map((s) => ({
        id: s.id,
        name: s.name,
        status: s.status,
      })),
    },
  });
};

export const action = async ({ request }) => {
  const { session, billing } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  const test = isTestShop(session.shop);
  const returnUrl = adminReturnUrl(session.shop);

  try {
    if (intent === "subscribe_monthly") {
      // Eğer yoksa onay iste ve Shopify confirm ekranına yönlendirir (throws/redirect)
      await billing.request({
        plan: BILLING_PLANS.PRO_MONTHLY,
        isTest: test,
        returnUrl,
      });
      return jsonResponse({ ok: true }); // normalde buraya düşmez
    }

    if (intent === "subscribe_annual") {
      await billing.request({
        plan: BILLING_PLANS.PRO_ANNUAL,
        isTest: test,
        returnUrl,
      });
      return jsonResponse({ ok: true });
    }

    if (intent === "cancel") {
      // Aktif subscription id’sini Shopify’dan al
      const check = await billing.check({
        plans: [BILLING_PLANS.PRO_MONTHLY, BILLING_PLANS.PRO_ANNUAL],
        isTest: test,
      });
      const subId = check?.appSubscriptions?.[0]?.id;
      if (!subId) return jsonResponse({ ok: false, error: "No active subscription found." }, 400);

      await billing.cancel({
        subscriptionId: subId,
        isTest: test,
        prorate: false,
      });

      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: "Unknown intent" }, 400);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return jsonResponse({ ok: false, error: msg }, 500);
  }
};

export default function Billing() {
  const { billing } = useLoaderData();
  const fetcher = useFetcher();

  const error = fetcher.data?.ok === false ? fetcher.data?.error : null;

  // Shopify approve ekranından dönünce sayfayı tazele
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      window.location.reload();
    }
  }, [fetcher.state, fetcher.data]);

  const isPro = Boolean(billing?.isPro);
  const activePlan = billing?.activePlan || "FREE";

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
                  <Badge tone={!isPro ? "success" : undefined}>
                    {!isPro ? "Current" : "Available"}
                  </Badge>
                </InlineStack>

                <Divider />

                <BlockStack gap="150">
                  <Text as="p" variant="bodyMd"><b>Monthly limit:</b> 10 products</Text>
                </BlockStack>

                <Divider />

                <BlockStack gap="150">
                  <Text as="h3" variant="headingSm">Features</Text>
                  <List>
                    {freeFeatures.map((f) => <List.Item key={f}>{f}</List.Item>)}
                  </List>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="100">
                    <Text variant="headingMd" as="h2">Pro Plan</Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Unlimited + advanced tools
                    </Text>
                  </BlockStack>

                  <Badge tone={isPro ? "success" : undefined}>
                    {isPro ? `Active (${activePlan})` : "Upgrade"}
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

                {!isPro ? (
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