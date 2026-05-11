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
 * Shopify billing.request() bazen Response(302) döndürür veya fırlatır.
 * Fetcher içinde redirect çalışmayabildiği için:
 * -> Location header'ı yakala
 * -> client'a redirectUrl olarak JSON dön
 */
function responseToRedirectJson(resp, origin) {
  const location = resp?.headers?.get?.("Location") || resp?.headers?.get?.("location");
  if (!location) return null;

  const abs = location.startsWith("http") ? location : `${origin}${location}`;
  return jsonResponse({ ok: true, redirectUrl: abs }, 200);
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
  const { getBillingContext, MONTHLY_PLAN, ANNUAL_PLAN, isTestBilling } = await import(
    "../billing.gating.server.js"
  );

  const url = new URL(request.url);
  const origin = url.origin;

  const { session, billing } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  // ✅ returnUrl 255 limitine takılmasın: sadece gerekli paramlar
  const host = url.searchParams.get("host") || "";
  const qs = new URLSearchParams();
  if (session.shop) qs.set("shop", session.shop);
  if (host) qs.set("host", host);
  qs.set("embedded", "1");

  const returnUrl = `${process.env.SHOPIFY_APP_URL || origin}/app/billing?${qs.toString()}`;

  try {
    if (intent === "subscribe_monthly") {
      const resp = await billing.request({
        plan: MONTHLY_PLAN,
        isTest: isTestBilling(),
        returnUrl,
      });

      // billing.request() Response döndürürse -> JSON'a çevir
      if (resp instanceof Response) {
        const out = responseToRedirectJson(resp, origin);
        if (out) return out;
      }

      // bazı sürümlerde burada normal obje dönebilir
      return jsonResponse({ ok: true });
    }

    if (intent === "subscribe_annual") {
      const resp = await billing.request({
        plan: ANNUAL_PLAN,
        isTest: isTestBilling(),
        returnUrl,
      });

      if (resp instanceof Response) {
        const out = responseToRedirectJson(resp, origin);
        if (out) return out;
      }

      return jsonResponse({ ok: true });
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

    return jsonResponse({ ok: false, error: "Unknown intent" }, 400);
  } catch (e) {
    // ✅ EN KRİTİK NOKTA:
    // billing.request() redirect Response'u "throw" edebilir.
    // Bunu client'a JSON redirectUrl olarak çeviriyoruz.
    if (e instanceof Response) {
      const out = responseToRedirectJson(e, origin);
      if (out) return out;
      return jsonResponse({ ok: false, error: "Billing redirect response has no Location header." }, 500);
    }

    const msg = e instanceof Error ? e.message : String(e);
    return jsonResponse({ ok: false, error: msg }, 500);
  }
};

export default function Billing() {
  const { billing } = useLoaderData();
  const fetcher = useFetcher();

  const error = fetcher.data?.ok === false ? fetcher.data?.error : null;
  const redirectUrl = fetcher.data?.redirectUrl || null;

  // ✅ Redirect URL geldiyse en stabil yöntem: _top
  useEffect(() => {
    if (!redirectUrl) return;
    try {
      window.open(redirectUrl, "_top");
    } catch (_e) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  // Normal “ok” durumunda sayfayı yenile
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok && !fetcher.data?.redirectUrl) {
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
                      <Button
                        submit
                        variant="primary"
                        loading={fetcher.state !== "idle"}
                      >
                        Start Monthly
                      </Button>
                    </fetcher.Form>

                    <fetcher.Form method="post">
                      <input type="hidden" name="intent" value="subscribe_annual" />
                      <Button
                        submit
                        variant="secondary"
                        loading={fetcher.state !== "idle"}
                      >
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