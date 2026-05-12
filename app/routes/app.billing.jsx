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
 * Shopify Billing redirect'inin Location header'ını yakalayıp
 * embedded ortamda client'ın window.top üzerinden yönlendirmesini sağlıyoruz.
 */
function responseToRedirectJson(res) {
  if (!(res instanceof Response)) return null;
  const location = res.headers.get("Location") || res.headers.get("location");
  if (!location) return null;
  return jsonResponse({ ok: true, redirectUrl: location });
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

  const { session, billing } = await authenticate.admin(request);

  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  // ✅ Return URL max 255 olmalı → SADECE gerekli parametreler:
  // shop + host + embedded=1 (hmac/id_token/session/timestamp ekleme!)
  const reqUrl = new URL(request.url);
  const appOrigin = process.env.SHOPIFY_APP_URL || reqUrl.origin;

  const returnUrlObj = new URL("/app/billing", appOrigin);
  const host = reqUrl.searchParams.get("host");
  if (host) returnUrlObj.searchParams.set("host", host);
  returnUrlObj.searchParams.set("shop", session.shop);
  returnUrlObj.searchParams.set("embedded", "1");

  const returnUrl = returnUrlObj.toString();

  try {
    if (intent === "subscribe_monthly") {
      const res = await billing.request({
        plan: MONTHLY_PLAN,
        isTest: isTestBilling(),
        returnUrl,
      });

      // billing.request genelde 302 Response döndürür → Location yakala
      const redirectJson = responseToRedirectJson(res);
      if (redirectJson) return redirectJson;

      // fallback
      return res;
    }

    if (intent === "subscribe_annual") {
      const res = await billing.request({
        plan: ANNUAL_PLAN,
        isTest: isTestBilling(),
        returnUrl,
      });

      const redirectJson = responseToRedirectJson(res);
      if (redirectJson) return redirectJson;

      return res;
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
    // ✅ billing.request bazen Response throw edebilir (redirect)
    if (e instanceof Response) {
      const redirectJson = responseToRedirectJson(e);
      if (redirectJson) return redirectJson;
      return e;
    }

    const msg = e instanceof Error ? e.message : String(e);
    return jsonResponse({ ok: false, error: msg }, 500);
  }
};

export default function Billing() {
  const { billing } = useLoaderData();
  const fetcher = useFetcher();

  const error = fetcher.data?.ok === false ? fetcher.data?.error : null;

  // ✅ Redirect URL geldiyse embedded üst pencerede yönlendir
  useEffect(() => {
    const redirectUrl = fetcher.data?.redirectUrl;
    if (!redirectUrl) return;

    try {
      if (window.top) window.top.location.href = redirectUrl;
      else window.location.href = redirectUrl;
    } catch {
      window.location.href = redirectUrl;
    }
  }, [fetcher.data]);

  // Cancel / reset gibi işlemlerden sonra refresh
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