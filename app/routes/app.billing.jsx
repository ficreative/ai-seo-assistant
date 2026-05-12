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
 * billing.request() bazen Response(302) döner (Location header ile),
 * bazen JSON (confirmationUrl/url) döndürebilir.
 */
async function extractRedirectUrl(resp) {
  if (!(resp instanceof Response)) return null;

  const loc = resp.headers.get("Location") || resp.headers.get("location");
  if (loc) return loc;

  // Bazı durumlarda body json olabilir
  try {
    const clone = resp.clone();
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

// ✅ Shopify App Pricing (Managed pricing) için tek plan handle:
const PRO_PLAN = "pro";

export const loader = async ({ request }) => {
  const { authenticate } = await import("../shopify.server.js");
  const { getBillingContext } = await import("../billing.gating.server.js");

  // authenticate.admin redirect atabilir (Response throw/return). React Router bunu handle eder.
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
  const { getBillingContext, isTestBilling } = await import("../billing.gating.server.js");

  const { session, billing } = await authenticate.admin(request);

  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  // ✅ returnUrl kısa olmalı (max 255). Query ekleme.
  const base = process.env.SHOPIFY_APP_URL || new URL(request.url).origin;
  const returnUrl = new URL("/app/billing", base).toString();

  try {
    // Shopify App Pricing modunda monthly/annual ayrı plan değil.
    // İki buton da aynı sayfaya götürebilir; merchant orada monthly/yearly seçer.
    if (intent === "subscribe_monthly" || intent === "subscribe_annual") {
      const resp = await billing.request({
        plan: PRO_PLAN,
        isTest: isTestBilling(),
        returnUrl,
      });

      // billing.request çoğunlukla Response döndürür
      if (resp instanceof Response) {
        const redirectUrl = await extractRedirectUrl(resp);

        if (!redirectUrl) {
          const status = resp.status;
          const contentType = resp.headers.get("content-type");
          let bodyPreview = "";
          try {
            bodyPreview = await resp.clone().text();
            bodyPreview = bodyPreview?.slice(0, 500) || "";
          } catch (_) {}

          // Bu log satırı sende gördüğün “Missing redirect url …” debug’ını tamamlar.
          console.error("[BILLING] Missing redirect url", {
            plan: PRO_PLAN,
            returnUrl,
            status,
            contentType,
            bodyPreview,
          });

          return jsonResponse(
            {
              ok: false,
              error: "Billing redirect response has no Location header.",
              details: { status, contentType, bodyPreview, returnUrl },
            },
            500
          );
        }

        // ✅ fetcher redirect’i otomatik takip etmez; client’a url veriyoruz
        return jsonResponse({ ok: true, redirectUrl });
      }

      // Eğer library JSON döndürdüyse:
      if (resp && typeof resp === "object") {
        const redirectUrl = resp.confirmationUrl || resp.url;
        if (redirectUrl) return jsonResponse({ ok: true, redirectUrl });
      }

      return jsonResponse({ ok: false, error: "Unknown billing response shape." }, 500);
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
      const { resetFreeUsageMonthly } = await import("../billing.usage.server.js");
      await resetFreeUsageMonthly(session.shop);
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: "Unknown intent" }, 400);
  } catch (e) {
    // Shopify libs bazen Response throw edebilir
    if (e instanceof Response) {
      const redirectUrl = await extractRedirectUrl(e);
      if (redirectUrl) return jsonResponse({ ok: true, redirectUrl });
      return e;
    }

    const msg = e instanceof Error ? e.message : String(e);
    console.error("[BILLING] action error:", e);
    return jsonResponse({ ok: false, error: msg }, 500);
  }
};

export default function Billing() {
  const { billing } = useLoaderData();
  const fetcher = useFetcher();

  const error = fetcher.data?.ok === false ? fetcher.data?.error : null;

  // ✅ redirectUrl geldiyse top window’a yönlendir (embedded içinde şart)
  useEffect(() => {
    const redirectUrl = fetcher.data?.redirectUrl;
    if (!redirectUrl) return;

    try {
      if (window.top) window.top.location.href = redirectUrl;
      else window.location.href = redirectUrl;
    } catch (_e) {
      window.location.href = redirectUrl;
    }
  }, [fetcher.data]);

  // Cancel / reset sonrası refresh
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok && !fetcher.data?.redirectUrl) {
      window.location.reload();
    }
  }, [fetcher.state, fetcher.data]);

  const free = billing?.free || { used: 0, remaining: 0, limit: 0, month: "" };
  const usageText = `${free.used}/${free.limit} used · ${free.remaining} remaining`;
  const monthLabel = free.month ? `Resets monthly (period: ${free.month})` : "Resets monthly";

  const proActive = billing?.isPro;

  const isSubmitting = fetcher.state !== "idle";

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
            <Text as="p" variant="bodyMd">{String(error)}</Text>
            {fetcher.data?.details ? (
              <Text as="p" variant="bodySm" tone="subdued">
                {JSON.stringify(fetcher.data.details)}
              </Text>
            ) : null}
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
                  <Button tone="critical" variant="secondary" disabled={isSubmitting}>
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
                      <Button submit variant="primary" loading={isSubmitting} disabled={isSubmitting}>
                        Start Monthly
                      </Button>
                    </fetcher.Form>

                    <fetcher.Form method="post">
                      <input type="hidden" name="intent" value="subscribe_annual" />
                      <Button submit variant="secondary" loading={isSubmitting} disabled={isSubmitting}>
                        Start Annual
                      </Button>
                    </fetcher.Form>
                  </InlineStack>
                ) : (
                  <fetcher.Form method="post">
                    <input type="hidden" name="intent" value="cancel" />
                    <Button submit tone="critical" loading={isSubmitting} disabled={isSubmitting}>
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