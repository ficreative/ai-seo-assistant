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

async function readBodyPreview(resp, max = 500) {
  try {
    const txt = await resp.text();
    return (txt || "").slice(0, max);
  } catch {
    return "";
  }
}

function getLocationHeader(resp) {
  if (!(resp instanceof Response)) return null;
  return resp.headers.get("Location") || resp.headers.get("location") || null;
}

/**
 * billing.request bazen:
 * - Response(302 + Location) döndürür
 * - {confirmationUrl/url} gibi bir obje döndürür
 * - hata fırlatır (Response veya Error)
 *
 * Bu helper hepsini normalize eder ve redirectUrl üretir.
 */
async function normalizeBillingRedirect(resultOrError) {
  // billing.request bazen Response fırlatır
  if (resultOrError instanceof Response) {
    const loc = getLocationHeader(resultOrError);
    const contentType = resultOrError.headers.get("content-type");
    const status = resultOrError.status;

    if (loc) {
      return { ok: true, redirectUrl: loc };
    }

    // Location yoksa body preview alalım (bazı edge-case’lerde faydalı)
    const bodyPreview = await readBodyPreview(resultOrError);
    return {
      ok: false,
      error: "Billing redirect response has no Location header.",
      debug: { status, contentType, bodyPreview },
    };
  }

  // Obje döndüyse (confirmationUrl vs)
  if (resultOrError && typeof resultOrError === "object") {
    const redirectUrl =
      resultOrError.confirmationUrl ||
      resultOrError.confirmation_url ||
      resultOrError.url ||
      null;

    if (redirectUrl) {
      return { ok: true, redirectUrl };
    }

    return {
      ok: false,
      error: "Billing response did not include a redirect URL.",
      debug: { keys: Object.keys(resultOrError) },
    };
  }

  return {
    ok: false,
    error: "Unknown billing response type.",
    debug: { value: String(resultOrError) },
  };
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

  // ✅ ReturnUrl KISA olmalı (255 sınırı). Query eklemiyoruz.
  const origin = process.env.SHOPIFY_APP_URL || new URL(request.url).origin;
  const returnUrl = `${origin}/app/billing`;

  try {
    if (!billing) {
      return jsonResponse(
        { ok: false, error: "Billing object is missing from authenticate.admin()." },
        500
      );
    }

    if (intent === "subscribe_monthly" || intent === "subscribe_annual") {
      const plan = intent === "subscribe_monthly" ? MONTHLY_PLAN : ANNUAL_PLAN;

      // Shopify tarafında plan bulunamaz / yetki yoksa bazen Response(401/4xx) döner/fırlatır
      let result;
      try {
        result = await billing.request({
          plan,
          isTest: isTestBilling(),
          returnUrl,
        });
      } catch (e) {
        // billing.request bazen Response fırlatır
        result = e;
      }

      const normalized = await normalizeBillingRedirect(result);

      if (!normalized.ok) {
        // 🔎 log için
        console.error("[BILLING] Missing redirect url", {
          plan,
          returnUrl,
          ...(normalized.debug ? normalized.debug : {}),
        });

        return jsonResponse(
          { ok: false, error: normalized.error, debug: normalized.debug },
          500
        );
      }

      // fetcher redirect yapamaz -> client tarafına redirectUrl gönderiyoruz
      return jsonResponse({ ok: true, redirectUrl: normalized.redirectUrl });
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
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[BILLING] action error", { msg, intent });

    return jsonResponse({ ok: false, error: msg }, 500);
  }
};

export default function Billing() {
  const { billing } = useLoaderData();
  const fetcher = useFetcher();

  // ✅ RedirectUrl geldiyse iframe dışına çıkıp Shopify sayfasına yönlendir
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

  const error = fetcher.data?.ok === false ? fetcher.data?.error : null;

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
            {/* Debug bilgisi gelirse ufak gösterelim */}
            {fetcher.data?.debug ? (
              <div style={{ marginTop: 12 }}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(fetcher.data.debug, null, 2)}
                </pre>
              </div>
            ) : null}
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
                  <Button
                    tone="critical"
                    variant="secondary"
                    loading={fetcher.state !== "idle"}
                  >
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
                    <Button
                      submit
                      tone="critical"
                      loading={fetcher.state !== "idle"}
                    >
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