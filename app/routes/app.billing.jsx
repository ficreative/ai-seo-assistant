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

import { BILLING_PLANS } from "../billing.plans.js";

/** Client-safe JSON response helper */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export const loader = async ({ request }) => {
  // ✅ Server-only imports MUST be inside loader/action
  const { authenticate } = await import("../shopify.server.js");
  const { getBillingContext } = await import("../billing.gating.server.js");

  const { session } = await authenticate.admin(request);
  const ctx = await getBillingContext(session.shop);

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
  // ✅ Server-only imports MUST be inside loader/action
  const { authenticate } = await import("../shopify.server.js");

  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  try {
    // NOTE:
    // Şimdilik mevcut sistemin hangi “real billing” fonksiyonlarını sağladığına göre
    // burada çağıracağız. Eğer hâlâ mock fonksiyonlar kullanıyorsan, onları da
    // dynamic import ile burada çağırmalısın.
    //
    // Aşağıdaki satırlar sende varsa çalışır:
    // - billing.real.server.js gibi bir dosyada request/cancel/check fonksiyonları
    // - veya shopify.server.js içinde export edilen helper’lar
    //
    // Şimdilik güvenli davranıp “mock disabled” uyarısını server’dan dönelim.

    if (intent === "subscribe_monthly" || intent === "subscribe_annual" || intent === "cancel") {
      // Burayı senin “A seçeneği (real billing)” implementasyonuna bağlayacağız.
      // Şu an prod’da mock kapalı olduğu için net mesaj dönüyorum:
      return jsonResponse({
        ok: false,
        error: "Mock billing is disabled. Configure real Shopify Billing for production.",
      }, 400);
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

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      window.location.reload();
    }
  }, [fetcher.state, fetcher.data]);

  const free =
    billing?.free || {
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
                      {BILLING_PLANS.FREE.title}
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      {BILLING_PLANS.FREE.subtitle}
                    </Text>
                  </BlockStack>
                  <Badge tone={!proActive ? "success" : undefined}>
                    {!proActive ? "Current" : "Available"}
                  </Badge>
                </InlineStack>

                <Divider />

                <BlockStack gap="150">
                  <Text as="p" variant="bodyMd">
                    <b>Monthly limit:</b> {BILLING_PLANS.FREE.monthlyProductLimit} products
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
                      {BILLING_PLANS.PRO.title}
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      {BILLING_PLANS.PRO.subtitle}
                    </Text>
                  </BlockStack>
                  <Badge tone={proActive ? "success" : undefined}>
                    {proActive ? "Active" : "Upgrade"}
                  </Badge>
                </InlineStack>

                <Divider />

                <BlockStack gap="200">
                  <Text as="p" variant="bodyMd">
                    <b>Monthly:</b> {BILLING_PLANS.PRO.priceMonthlyText}
                  </Text>
                  <Text as="p" variant="bodyMd">
                    <b>Annual:</b> {BILLING_PLANS.PRO.priceAnnualText}
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
                      <Button submit variant="primary">
                        Start Monthly
                      </Button>
                    </fetcher.Form>
                    <fetcher.Form method="post">
                      <input type="hidden" name="intent" value="subscribe_annual" />
                      <Button submit variant="secondary">
                        Start Annual
                      </Button>
                    </fetcher.Form>
                  </InlineStack>
                ) : (
                  <fetcher.Form method="post">
                    <input type="hidden" name="intent" value="cancel" />
                    <Button submit tone="critical">
                      Cancel subscription
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