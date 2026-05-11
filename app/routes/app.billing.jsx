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
 * Reads error details from a Response body safely.
 */
async function extractErrorFromResponse(resp) {
  try {
    const ct = resp.headers?.get?.("content-type") || "";
    const text = await resp.text();

    if (ct.includes("application/json")) {
      try {
        const j = JSON.parse(text);
        const msg =
          j?.error ||
          j?.errors?.[0]?.message ||
          j?.errors?.message ||
          j?.message ||
          j?.data?.appSubscriptionCreate?.userErrors?.[0]?.message ||
          null;

        return msg || text.slice(0, 800);
      } catch {
        return text.slice(0, 800);
      }
    }

    return text.slice(0, 800);
  } catch {
    return `Billing failed (status ${resp.status}). Could not read response body.`;
  }
}

/**
 * Turn a Response (thrown/returned) into either:
 * - {ok:true, redirectUrl} if we can detect a redirect/confirmationUrl
 * - {ok:false, error} otherwise (includes parsed body)
 */
async function responseToRedirectJson(resp, origin) {
  const location = resp?.headers?.get?.("Location") || resp?.headers?.get?.("location");
  if (location) {
    const abs = location.startsWith("http") ? location : `${origin}${location}`;
    return jsonResponse({ ok: true, redirectUrl: abs }, 200);
  }

  const errText = await extractErrorFromResponse(resp);

  // Sometimes confirmationUrl is returned inside JSON body
  try {
    const maybeJson = JSON.parse(errText);
    const confirmationUrl =
      maybeJson?.confirmationUrl ||
      maybeJson?.data?.confirmationUrl ||
      maybeJson?.data?.appSubscriptionCreate?.confirmationUrl ||
      null;

    if (confirmationUrl) {
      return jsonResponse({ ok: true, redirectUrl: confirmationUrl }, 200);
    }
  } catch {
    // not json
  }

  return jsonResponse(
    {
      ok: false,
      error: `Billing request failed (status ${resp.status}). ${errText}`,
    },
    500
  );
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

  const url = new URL(request.url);
  const origin = process.env.SHOPIFY_APP_URL || url.origin;

  // ✅ Keep returnUrl SHORT (Shopify limit 255 chars)
  // Do NOT append the entire query string (host, embedded, hmac, id_token...).
  const returnUrl = `${origin}/app/billing`;

  try {
    if (intent === "subscribe_monthly") {
      // billing.request often returns/throws a Response (redirect)
      const resp = await billing.request({
        plan: MONTHLY_PLAN,
        isTest: isTestBilling(),
        returnUrl,
      });

      // If it returns a Response, convert it
      if (resp instanceof Response) {
        return await responseToRedirectJson(resp, origin);
      }

      // Some SDK versions may return nothing (rare). Still return ok.
      return jsonResponse({ ok: true });
    }

    if (intent === "subscribe_annual") {
      const resp = await billing.request({
        plan: ANNUAL_PLAN,
        isTest: isTestBilling(),
        returnUrl,
      });

      if (resp instanceof Response) {
        return await responseToRedirectJson(resp, origin);
      }

      return jsonResponse({ ok: true });
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

      // Some implementations may return Response
      if (resp instanceof Response) {
        // Usually cancel is not a redirect, but handle gracefully
        const errText = await extractErrorFromResponse(resp);
        return jsonResponse({ ok: false, error: errText }, resp.status || 500);
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
    // ✅ If the billing library throws a Response (redirect or error), parse it
    if (e instanceof Response) {
      return await responseToRedirectJson(e, origin);
    }

    const msg = e instanceof Error ? e.message : String(e);
    return jsonResponse({ ok: false, error: msg }, 500);
  }
};

export default function Billing() {
  const { billing } = useLoaderData();
  const fetcher = useFetcher();

  const actionError = fetcher.data?.ok === false ? fetcher.data?.error : null;
  const redirectUrl = fetcher.data?.ok === true ? fetcher.data?.redirectUrl : null;

  // ✅ If action returns redirectUrl, navigate the top window (embedded safe)
  useEffect(() => {
    if (!redirectUrl) return;

    try {
      if (window.top) {
        window.top.location.href = redirectUrl;
      } else {
        window.location.href = redirectUrl;
      }
    } catch {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  // Refresh after non-redirect OK actions (cancel/reset)
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

  const isSubmitting = fetcher.state !== "idle";

  return (
    <Page title="Billing">
      <BlockStack gap="400">
        {actionError ? (
          <Banner tone="critical" title="Billing error">
            <Text as="p" variant="bodyMd">
              {actionError}
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