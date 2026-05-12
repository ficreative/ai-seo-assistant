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

// Fetcher redirect'leri takip etmez.
// Shopify billing.request() bazen Response(redirect) döndürür, bazen JSON.
// Burada her iki durumda da redirect URL'yi yakalayıp client'a JSON ile dönüyoruz.
async function extractRedirectUrl(resp) {
  if (!resp) return null;

  // 1) Response redirect ise: Location header
  if (resp instanceof Response) {
    const loc = resp.headers.get("Location") || resp.headers.get("location");
    if (loc) return loc;

    // Bazı durumlarda body JSON olabilir (nadiren)
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

  // 2) Object döndüyse: {confirmationUrl} veya {url}
  if (typeof resp === "object") {
    return resp.confirmationUrl || resp.url || resp.redirectUrl || null;
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
  const { getBillingContext, MONTHLY_PLAN, ANNUAL_PLAN, isTestBilling } = await import(
    "../billing.gating.server.js"
  );

  const { session, billing } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  const url = new URL(request.url);

  // ✅ Return URL 255 limitine takılmasın: host/hmac/id_token vs. eklemiyoruz
  // (Billing onayı sonrası buraya dönecek)
  const base =
    process.env.SHOPIFY_APP_URL ||
    `${url.protocol}//${url.host}`;

  const returnUrl = `${base}/app/billing`;

  try {
    if (intent === "subscribe_monthly") {
      const resp = await billing.request({
        plan: MONTHLY_PLAN,
        isTest: isTestBilling(),
        returnUrl,
      });

      const redirectUrl = await extractRedirectUrl(resp);
      if (!redirectUrl) {
        return jsonResponse(
          {
            ok: false,
            error: "Billing redirect response has no Location header.",
            debug: { status: resp?.status, returnUrl },
          },
          500
        );
      }
      return jsonResponse({ ok: true, redirectUrl });
    }

    if (intent === "subscribe_annual") {
      const resp = await billing.request({
        plan: ANNUAL_PLAN,
        isTest: isTestBilling(),
        returnUrl,
      });

      const redirectUrl = await extractRedirectUrl(resp);
      if (!redirectUrl) {
        return jsonResponse(
          {
            ok: false,
            error: "Billing redirect response has no Location header.",
            debug: { status: resp?.status, returnUrl },
          },
          500
        );
      }
      return jsonResponse({ ok: true, redirectUrl });
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
    // billing.request bazen Response fırlatabilir (redirect).
    // Fetcher bunu takip etmez; yine redirectUrl yakalayıp JSON dönelim.
    if (e instanceof Response) {
      const redirectUrl = await extractRedirectUrl(e);
      if (redirectUrl) return jsonResponse({ ok: true, redirectUrl });

      // Response var ama redirect yoksa: detaylı hata metni yakalamaya çalış
      let bodyPreview = "";
      try {
        bodyPreview = await e.clone().text();
        if (bodyPreview.length > 500) bodyPreview = bodyPreview.slice(0, 500);
      } catch (_) {}

      return jsonResponse(
        {
          ok: false,
          error: "Billing redirect response has no Location header.",
          debug: {
            status: e.status,
            contentType: e.headers.get("content-type"),
            bodyPreview,
            returnUrl,
          },
        },
        500
      );
    }

    const msg = e instanceof Error ? e.message : String(e);
    return jsonResponse({ ok: false, error: msg }, 500);
  }
};

export default function Billing() {
  const { billing } = useLoaderData();
  const fetcher = useFetcher();

  const error = fetcher.data?.ok === false ? fetcher.data?.error : null;
  const redirectUrl = fetcher.data?.ok === true ? fetcher.data?.redirectUrl : null;

  // ✅ Redirect varsa top window'a çık
  useEffect(() => {
    if (!redirectUrl) return;
    try {
      window.open(redirectUrl, "_top");
    } catch (_) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  // Cancel / reset sonrası reload
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok && !fetcher.data?.redirectUrl) {
      window.location.reload();
    }
  }, [fetcher.state, fetcher.data]);

  const free = billing?.free || { used: 0, remaining: 0, limit: 0, month: "" };
  const usageText = `${free.used}/${free.limit} used · ${free.remaining} remaining`;
  const monthLabel = free.month ? `Resets monthly (period: ${free.month})` : "Resets monthly";

  const proActive = billing?.isPro;
  const busy = fetcher.state !== "idle";

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
            <BlockStack gap="200">
              <Text as="p" variant="bodyMd">{error}</Text>
              {fetcher.data?.debug ? (
                <Text as="p" variant="bodySm" tone="subdued">
                  {JSON.stringify(fetcher.data.debug)}
                </Text>
              ) : null}
            </BlockStack>
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
                  <Button tone="critical" variant="secondary" loading={busy} disabled={busy}>
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
                      <Button submit variant="primary" loading={busy} disabled={busy}>
                        Start Monthly
                      </Button>
                    </fetcher.Form>

                    <fetcher.Form method="post">
                      <input type="hidden" name="intent" value="subscribe_annual" />
                      <Button submit variant="secondary" loading={busy} disabled={busy}>
                        Start Annual
                      </Button>
                    </fetcher.Form>
                  </InlineStack>
                ) : (
                  <fetcher.Form method="post">
                    <input type="hidden" name="intent" value="cancel" />
                    <Button submit tone="critical" loading={busy} disabled={busy}>
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