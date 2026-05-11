// app/routes/app.billing.jsx
import { useEffect, useMemo } from "react";
import {
  Form,
  useLoaderData,
  useFetcher,
  useLocation,
} from "react-router";

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
 * returnUrl Shopify tarafında 255 karakter limitine takılabiliyor.
 * Bu yüzden sadece shop + host + embedded gibi minimum paramlarla döndür.
 */
function buildShortReturnUrl({ appUrl, shop, host }) {
  const base = (appUrl || "").replace(/\/$/, "");
  const qs = new URLSearchParams();
  if (shop) qs.set("shop", shop);
  if (host) qs.set("host", host);
  qs.set("embedded", "1");

  const url = `${base}/app/billing?${qs.toString()}`;

  // Shopify limiti: 255
  if (url.length <= 255) return url;

  // host çok uzunsa sadece shop ile dön (genelde yeterli)
  const qs2 = new URLSearchParams();
  if (shop) qs2.set("shop", shop);
  qs2.set("embedded", "1");
  const url2 = `${base}/app/billing?${qs2.toString()}`;

  // Yine uzunsa en kısa: /app/billing
  if (url2.length <= 255) return url2;

  return `${base}/app/billing`;
}

export const loader = async ({ request }) => {
  const { authenticate } = await import("../shopify.server.js");
  const { getBillingContext } = await import("../billing.gating.server.js");

  const { session, billing } = await authenticate.admin(request);

  // Billing context (aktif abonelik var mı vs.)
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
    resetFreeUsage,
  } = await import("../billing.gating.server.js");

  const { session, billing } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  const url = new URL(request.url);
  const host = url.searchParams.get("host") || "";
  const appUrl = process.env.SHOPIFY_APP_URL || url.origin;

  const returnUrl = buildShortReturnUrl({
    appUrl,
    shop: session.shop,
    host,
  });

  try {
    // ✅ IMPORTANT:
    // Subscribe işlemi TOP-LEVEL redirect ister.
    // Bu yüzden bu action response'u redirect dönecek ve
    // client tarafında da fetcher değil normal <Form> kullanılmalı.
    if (intent === "subscribe_monthly") {
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
      await resetFreeUsage({ shop: session.shop });
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: "Unknown intent" }, 400);
  } catch (e) {
    // billing.request çoğu zaman Response döndürür/fırlatır
    if (e instanceof Response) return e;

    // Log'a daha faydalı bilgi basalım
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[BILLING] action error:", {
      name: e?.name,
      message: msg,
      cause: e?.cause,
      response: e?.response,
    });
    if (e?.stack) console.error("[BILLING] action error stack:", e.stack);

    return jsonResponse({ ok: false, error: msg }, 500);
  }
};

export default function Billing() {
  const { billing } = useLoaderData();
  const location = useLocation();
  const cancelFetcher = useFetcher();
  const resetFetcher = useFetcher();

  const error =
    (cancelFetcher.data?.ok === false && cancelFetcher.data?.error) ||
    (resetFetcher.data?.ok === false && resetFetcher.data?.error) ||
    null;

  useEffect(() => {
    if (cancelFetcher.state === "idle" && cancelFetcher.data?.ok) {
      window.location.reload();
    }
  }, [cancelFetcher.state, cancelFetcher.data]);

  useEffect(() => {
    if (resetFetcher.state === "idle" && resetFetcher.data?.ok) {
      window.location.reload();
    }
  }, [resetFetcher.state, resetFetcher.data]);

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

                <resetFetcher.Form method="post">
                  <input type="hidden" name="intent" value="reset_usage" />
                  <Button
                    tone="critical"
                    variant="secondary"
                    loading={resetFetcher.state !== "idle"}
                  >
                    Reset usage (dev)
                  </Button>
                </resetFetcher.Form>
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
                    {/* ✅ SUBSCRIBE: fetcher değil, normal Form olmalı */}
                    <Form method="post" action={`${location.pathname}${location.search}`}>
                      <input type="hidden" name="intent" value="subscribe_monthly" />
                      <Button submit variant="primary">
                        Start Monthly
                      </Button>
                    </Form>

                    <Form method="post" action={`${location.pathname}${location.search}`}>
                      <input type="hidden" name="intent" value="subscribe_annual" />
                      <Button submit variant="secondary">
                        Start Annual
                      </Button>
                    </Form>
                  </InlineStack>
                ) : (
                  <cancelFetcher.Form method="post">
                    <input type="hidden" name="intent" value="cancel" />
                    <Button
                      submit
                      tone="critical"
                      loading={cancelFetcher.state !== "idle"}
                    >
                      Cancel subscription
                    </Button>
                  </cancelFetcher.Form>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}