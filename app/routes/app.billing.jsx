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
 * Shopify Billing returnUrl max 255 karakter.
 * Query string eklemiyoruz.
 */
function buildShortReturnUrl(request) {
  const url = new URL(request.url);
  const origin = process.env.SHOPIFY_APP_URL || url.origin;
  return `${origin}/app/billing`;
}

/**
 * billing.request(...) farklı şekillerde dönebilir:
 * 1) Response (302 + Location)
 * 2) Response (200 + body'de confirmationUrl)
 * 3) Object: { confirmationUrl } veya { url }
 */
async function extractBillingRedirectUrl(maybe) {
  // 3) object return
  if (maybe && typeof maybe === "object" && !(maybe instanceof Response)) {
    const confirmationUrl =
      maybe.confirmationUrl ||
      maybe.confirmation_url ||
      maybe.url ||
      maybe.redirectUrl ||
      null;

    if (typeof confirmationUrl === "string" && confirmationUrl.startsWith("http")) {
      return confirmationUrl;
    }
  }

  // 1/2) Response
  if (maybe instanceof Response) {
    const loc = maybe.headers.get("Location") || maybe.headers.get("location");
    if (loc) return loc;

    // body JSON olabilir (content-type farklı olsa bile)
    try {
      const clone = maybe.clone();
      const text = await clone.text();
      if (!text) return null;

      // JSON parse dene
      try {
        const j = JSON.parse(text);
        const url =
          j?.confirmationUrl ||
          j?.confirmation_url ||
          j?.data?.confirmationUrl ||
          j?.data?.appSubscriptionCreate?.confirmationUrl ||
          j?.data?.appSubscriptionCreate?.confirmationUrl ||
          j?.data?.appPurchaseOneTimeCreate?.confirmationUrl ||
          j?.url ||
          null;

        if (typeof url === "string" && url.startsWith("http")) return url;
      } catch (_) {
        // JSON değilse, içinde http link geçiyor mu kaba şekilde yakala
        const m = text.match(/https?:\/\/[^\s"']+/);
        if (m?.[0]) return m[0];
      }
    } catch (_) {
      return null;
    }
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
    resetFreeUsageMonthly,
  } = await import("../billing.gating.server.js");

  const { session, billing } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "");
  const returnUrl = buildShortReturnUrl(request);

  const respondWithBillingRedirect = async (result) => {
    const redirectUrl = await extractBillingRedirectUrl(result);
    if (!redirectUrl) {
      // Debug (token basmadan)
      if (result instanceof Response) {
        let bodyPreview = "";
        try {
          const t = await result.clone().text();
          bodyPreview = (t || "").slice(0, 500);
        } catch (_) {}

        console.error("[BILLING] Missing redirect url", {
          status: result.status,
          contentType: result.headers.get("content-type"),
          headerNames: Array.from(result.headers.keys()).slice(0, 50),
          bodyPreview,
        });
      } else {
        console.error("[BILLING] Missing redirect url (non-response)", {
          type: typeof result,
          keys: result && typeof result === "object" ? Object.keys(result).slice(0, 50) : [],
        });
      }

      return jsonResponse(
        { ok: false, error: "Billing redirect response has no Location header." },
        500
      );
    }

    return jsonResponse({ ok: true, redirectUrl });
  };

  try {
    if (intent === "subscribe_monthly") {
      const result = await billing.request({
        plan: MONTHLY_PLAN,
        isTest: isTestBilling(),
        returnUrl,
      });
      return await respondWithBillingRedirect(result);
    }

    if (intent === "subscribe_annual") {
      const result = await billing.request({
        plan: ANNUAL_PLAN,
        isTest: isTestBilling(),
        returnUrl,
      });
      return await respondWithBillingRedirect(result);
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
      await resetFreeUsageMonthly(session.shop);
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: "Unknown intent" }, 400);
  } catch (e) {
    // billing.request bazen Response fırlatır (redirect)
    if (e instanceof Response) return await respondWithBillingRedirect(e);

    // Bazı Shopify billing error'ları response/stack içerir
    console.error("[BILLING] action error", {
      name: e?.name,
      message: e?.message,
      cause: e?.cause,
      response: e?.response ? "present" : undefined,
    });

    const msg = e instanceof Error ? e.message : String(e);
    return jsonResponse({ ok: false, error: msg }, 500);
  }
};

export default function Billing() {
  const { billing } = useLoaderData();
  const fetcher = useFetcher();

  const error = fetcher.data?.ok === false ? String(fetcher.data?.error || "Unknown error") : null;

  // Redirect gelirse embedded ortamda TOP window'a yönlendir
  useEffect(() => {
    const redirectUrl = fetcher.data?.redirectUrl;
    if (!redirectUrl) return;

    try {
      if (window?.top) window.top.location.href = redirectUrl;
      else window.location.href = redirectUrl;
    } catch (_e) {
      window.location.href = redirectUrl;
    }
  }, [fetcher.data]);

  // cancel / reset sonrası
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

                <fetcher.Form method="post">
                  <input type="hidden" name="intent" value="reset_usage" />
                  <Button tone="critical" variant="secondary" loading={isSubmitting}>
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