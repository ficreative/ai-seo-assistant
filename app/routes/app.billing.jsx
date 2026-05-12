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
 * billing.request() genelde Response(302 Location) döndürür (bazı sürümlerde throw da edebilir).
 * fetcher (XHR) bu redirect'i top-level'a taşımadığı için biz redirectUrl'i JSON olarak client'a taşıyoruz.
 */
async function extractRedirectUrlFromBillingResult(resultOrError) {
  // billing.request bazen Response döndürür
  if (resultOrError instanceof Response) {
    const loc =
      resultOrError.headers.get("Location") ||
      resultOrError.headers.get("location");
    if (loc) return loc;

    // Bazı durumlarda body json olabilir (confirmationUrl/url)
    try {
      const clone = resultOrError.clone();
      const ct = clone.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const j = await clone.json();
        return j?.confirmationUrl || j?.url || null;
      }
    } catch (_) {
      // ignore
    }
    return null;
  }

  // billing.request bazı implementasyonlarda {confirmationUrl} döndürebiliyor
  if (resultOrError && typeof resultOrError === "object") {
    const url =
      resultOrError.confirmationUrl ||
      resultOrError.url ||
      resultOrError.redirectUrl;
    if (typeof url === "string" && url.startsWith("http")) return url;
  }

  return null;
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
  const {
    getBillingContext,
    MONTHLY_PLAN,
    ANNUAL_PLAN,
    isTestBilling,
  } = await import("../billing.gating.server.js");

  const { session, billing } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  // Return URL kesinlikle kısa olmalı (<=255). Querystring ekleme.
  // Shopify dönüşte zaten app'i yeniden açar; /app/billing yeterli.
  const origin =
    process.env.SHOPIFY_APP_URL ||
    new URL(request.url).origin ||
    "https://example.com";
  const returnUrl = `${origin}/app/billing`;

  try {
    if (intent === "subscribe_monthly") {
      try {
        const res = await billing.request({
          plan: MONTHLY_PLAN,
          isTest: isTestBilling(),
          returnUrl,
        });

        const redirectUrl = await extractRedirectUrlFromBillingResult(res);
        if (!redirectUrl) {
          return jsonResponse(
            {
              ok: false,
              error:
                "Billing redirect response has no Location header (or confirmationUrl).",
            },
            500
          );
        }

        return jsonResponse({ ok: true, redirectUrl });
      } catch (e) {
        const redirectUrl = await extractRedirectUrlFromBillingResult(e);
        if (redirectUrl) return jsonResponse({ ok: true, redirectUrl });

        const msg = e instanceof Error ? e.message : String(e);
        return jsonResponse({ ok: false, error: msg }, 500);
      }
    }

    if (intent === "subscribe_annual") {
      try {
        const res = await billing.request({
          plan: ANNUAL_PLAN,
          isTest: isTestBilling(),
          returnUrl,
        });

        const redirectUrl = await extractRedirectUrlFromBillingResult(res);
        if (!redirectUrl) {
          return jsonResponse(
            {
              ok: false,
              error:
                "Billing redirect response has no Location header (or confirmationUrl).",
            },
            500
          );
        }

        return jsonResponse({ ok: true, redirectUrl });
      } catch (e) {
        const redirectUrl = await extractRedirectUrlFromBillingResult(e);
        if (redirectUrl) return jsonResponse({ ok: true, redirectUrl });

        const msg = e instanceof Error ? e.message : String(e);
        return jsonResponse({ ok: false, error: msg }, 500);
      }
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

      return jsonResponse({ ok: true, revalidate: true });
    }

    return jsonResponse({ ok: false, error: "Unknown intent" }, 400);
  } catch (e) {
    // fallback
    const msg = e instanceof Error ? e.message : String(e);
    return jsonResponse({ ok: false, error: msg }, 500);
  }
};

export default function Billing() {
  const { billing } = useLoaderData();
  const fetcher = useFetcher();

  const error = fetcher.data?.ok === false ? fetcher.data?.error : null;
  const isSubmitting = fetcher.state !== "idle";

  // ✅ Action JSON ile redirectUrl döndüğünde top-level yönlendir.
  useEffect(() => {
    const redirectUrl = fetcher.data?.redirectUrl;
    if (!redirectUrl) return;

    try {
      // iframe içindeyiz -> top level'a çık
      window.open(redirectUrl, "_top");
    } catch (_) {
      window.top.location.href = redirectUrl;
    }
  }, [fetcher.data]);

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
                      <Button submit variant="primary" loading={isSubmitting}>
                        Start Monthly
                      </Button>
                    </fetcher.Form>

                    <fetcher.Form method="post">
                      <input type="hidden" name="intent" value="subscribe_annual" />
                      <Button submit variant="secondary" loading={isSubmitting}>
                        Start Annual
                      </Button>
                    </fetcher.Form>
                  </InlineStack>
                ) : (
                  <fetcher.Form method="post">
                    <input type="hidden" name="intent" value="cancel" />
                    <Button submit tone="critical" loading={isSubmitting}>
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