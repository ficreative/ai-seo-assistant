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

export const loader = async ({ request }) => {
  const { authenticate } = await import("../shopify.server.js");
  const { getBillingContext } = await import("../billing.gating.server.js");

  const { session, billing } = await authenticate.admin(request);

  const ctx = await getBillingContext({
    shop: session.shop,
    billing,
  });

  return jsonResponse({
    shop: session.shop,
    billing: {
      planKey: ctx.planKey,
      isPro: ctx.isPro,
      mode: ctx.mode,
      free: ctx.free,
      // cancel için lazım olabilir
      activeSubscription: ctx.activeSubscription || null,
    },
  });
};

export const action = async ({ request }) => {
  const { authenticate } = await import("../shopify.server.js");
  const { getBillingContext, MONTHLY_PLAN, ANNUAL_PLAN, isTestBilling } =
    await import("../billing.gating.server.js");

  const { session, billing } = await authenticate.admin(request);

  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  // ✅ Return URL kısa olmalı (<=255). Host/embedded/hmac taşımıyoruz.
  const origin = new URL(request.url).origin;
  const returnUrl = `${process.env.SHOPIFY_APP_URL || origin}/app/billing`;

  try {
    if (intent === "subscribe_monthly") {
      const resp = await billing.request({
        plan: MONTHLY_PLAN,
        isTest: isTestBilling(),
        returnUrl,
      });

      // ✅ fetcher redirect takip etmez → Location'ı JSON olarak dön
      if (resp instanceof Response) {
        const redirectUrl = resp.headers.get("Location");
        if (redirectUrl) {
          const abs = redirectUrl.startsWith("http")
            ? redirectUrl
            : `${origin}${redirectUrl}`;
          return jsonResponse({ ok: true, redirectUrl: abs });
        }
      }

      if (resp?.redirectUrl) return jsonResponse({ ok: true, redirectUrl: resp.redirectUrl });

      return jsonResponse({ ok: false, error: "Billing redirect URL not returned." }, 500);
    }

    if (intent === "subscribe_annual") {
      const resp = await billing.request({
        plan: ANNUAL_PLAN,
        isTest: isTestBilling(),
        returnUrl,
      });

      if (resp instanceof Response) {
        const redirectUrl = resp.headers.get("Location");
        if (redirectUrl) return jsonResponse({ ok: true, redirectUrl });
        return resp;
      }

      if (resp?.redirectUrl) return jsonResponse({ ok: true, redirectUrl: resp.redirectUrl });

      return jsonResponse({ ok: false, error: "Billing redirect URL not returned." }, 500);
    }

    if (intent === "cancel") {
      const ctx = await getBillingContext({ shop: session.shop, billing });
      const sub = ctx.activeSubscription;

      if (!sub?.id) {
        return jsonResponse({ ok: false, error: "No active subscription found." }, 400);
      }

      const resp = await billing.cancel({
        subscriptionId: sub.id,
        isTest: isTestBilling(),
        prorate: true,
      });

      // cancel bazı durumda Response döndürebilir
      if (resp instanceof Response) return resp;

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
    // billing.request bazı implementasyonlarda redirect Response fırlatabilir.
    if (e instanceof Response) {
      const redirectUrl = e.headers.get("Location");
      if (redirectUrl) return jsonResponse({ ok: true, redirectUrl });
      return e;
    }

    const msg = e instanceof Error ? e.message : String(e);
    // Log'a daha net düşmesi için:
    // eslint-disable-next-line no-console
    console.error("[BILLING] action error:", e);

    return jsonResponse({ ok: false, error: msg }, 500);
  }
};

export default function Billing() {
  const { billing } = useLoaderData();
  const fetcher = useFetcher();

useEffect(() => {
  const redirectUrl = fetcher.data?.redirectUrl;
  if (!redirectUrl) return;

  // ✅ Embedded + Safari'de en stabil yöntem
  try {
    window.open(redirectUrl, "_top");
  } catch (_e) {
    // fallback
    window.location.href = redirectUrl;
  }
}, [fetcher.data]);

  // Aksiyon success sonrası sayfayı yenile (plan değişimi için)
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok && !fetcher.data?.redirectUrl) {
      window.location.reload();
    }
  }, [fetcher.state, fetcher.data]);

  const error = fetcher.data?.ok === false ? fetcher.data?.error : null;

  const free = billing?.free || { used: 0, remaining: 0, limit: 0, month: "" };
  const usageText = `${free.used}/${free.limit} used · ${free.remaining} remaining`;
  const monthLabel = free.month ? `Resets monthly (period: ${free.month})` : "Resets monthly";

  const proActive = Boolean(billing?.isPro);

  const freeFeatures = useMemo(
    () => [
      "Up to 10 products / month",
      "Generate product meta title & description",
      "Generation history",
      "Basic support",
    ],
    [],
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
    [],
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

                {process.env.NODE_ENV !== "production" ? (
                  <fetcher.Form method="post">
                    <input type="hidden" name="intent" value="reset_usage" />
                    <Button tone="critical" variant="secondary">
                      Reset usage (dev)
                    </Button>
                  </fetcher.Form>
                ) : null}
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
                      <Button submit variant="primary" loading={fetcher.state !== "idle"}>
                        Start Monthly
                      </Button>
                    </fetcher.Form>

                    <fetcher.Form method="post">
                      <input type="hidden" name="intent" value="subscribe_annual" />
                      <Button submit variant="secondary" loading={fetcher.state !== "idle"}>
                        Start Annual
                      </Button>
                    </fetcher.Form>
                  </InlineStack>
                ) : (
                  <fetcher.Form method="post">
                    <input type="hidden" name="intent" value="cancel" />
                    <Button submit tone="critical" loading={fetcher.state !== "idle"}>
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