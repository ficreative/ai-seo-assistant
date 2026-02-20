import { Link as RouterLink, useLoaderData, useLocation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  List,
  Banner,
  Badge,
  ProgressBar,
  Divider,
} from "@shopify/polaris";

import prisma from "../db.server.js";
import { authenticate } from "../shopify.server";
import { getBillingContext } from "../billing.gating.server.js";

const SETTINGS_NAMESPACE = "ai_seo_assistant";
const SETTINGS_KEY = "settings";

async function getSettingsFromMetafield(admin) {
  const query = `#graphql
    query GetAiSeoAssistantSettings($namespace: String!, $key: String!) {
      shop {
        id
        metafield(namespace: $namespace, key: $key) {
          id
          type
          value
        }
      }
    }`;

  const res = await admin.graphql(query, {
    variables: { namespace: SETTINGS_NAMESPACE, key: SETTINGS_KEY },
  });
  const json = await res.json();
  const raw = json?.data?.shop?.metafield?.value;

  let settings = null;
  if (raw) {
    try { settings = JSON.parse(raw); } catch { settings = null; }
  }
  return settings || {};
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const settings = await getSettingsFromMetafield(admin);

  const billingCtx = await getBillingContext(session.shop);
  const billing = {
    planKey: billingCtx.planKey,
    isPro: billingCtx.isPro,
    mode: billingCtx.mode,
    free: billingCtx.free,
  };

  // Basic onboarding stats
  const [totalJobs, productJobs, imageJobs, blogJobs] = await Promise.all([
    prisma.seoJob.count({ where: { shop: session.shop } }),
    prisma.seoJob.count({ where: { shop: session.shop, jobType: "PRODUCT_SEO" } }),
    prisma.seoJob.count({ where: { shop: session.shop, jobType: "ALT_TEXT_IMAGES" } }),
    prisma.seoJob.count({ where: { shop: session.shop, jobType: "BLOG_SEO_META" } }),
  ]);

  return jsonResponse({
    shop: session.shop,
    settings,
    billing,
    stats: {
      totalJobs,
      productJobs,
      imageJobs,
      blogJobs,
    },
  });
};

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// Make cards in the 2-column layout equal height per row
function StretchCard({ children }) {
  return (
    <div className="gsCardWrap">
      <Card>{children}</Card>
    </div>
  );
}

export default function Onboarding() {
  const { settings, billing, stats } = useLoaderData();
  const location = useLocation();
  const withSearch = (path) => `${path}${location.search || ""}`;

  const isConfigured =
    settings &&
    (settings.brandName || settings.brandVoiceGuidelines || settings.targetKeyword);

  const stepSettings = Boolean(isConfigured);
  const stepProduct = (stats?.productJobs || 0) > 0;
  const stepReview = (stats?.totalJobs || 0) > 0;
  const stepImages = (stats?.imageJobs || 0) > 0;
  const stepBlog = (stats?.blogJobs || 0) > 0;

  const steps = [
    { key: "settings", label: "Complete Settings", done: stepSettings, href: "/app/settings" },
    { key: "product", label: "Generate SEO for products", done: stepProduct, href: "/app/seo-tools?tab=products" },
    { key: "review", label: "Review results in Generation History", done: stepReview, href: "/app/generation-history" },
    { key: "images", label: "Generate ALT text for images", done: stepImages, href: "/app/seo-tools?tab=images", proOnly: true },
    { key: "blog", label: "Generate SEO for blog articles", done: stepBlog, href: "/app/seo-tools?tab=blog", proOnly: true },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const progress = clamp(Math.round((doneCount / steps.length) * 100), 0, 100);

  const freeUsed = billing?.free?.used || 0;
  const freeLimit = billing?.free?.limit || billing?.free?.monthlyLimit || 0;
  const freeRemaining = typeof billing?.free?.remaining === "number"
    ? billing.free.remaining
    : Math.max(0, freeLimit - freeUsed);

  return (
    <Page title="Get started" fullWidth>
      {/* Full-width dashboard layout */}
      <div style={{ width: "100%", padding: "0" }}>
        {/*
          NOTE: Polaris Layout doesn't guarantee equal-height cards per row across versions.
          Using a small CSS grid gives consistent 2-column layout + equal heights.
        */}
        <style>{`

.gsRows {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}
.gsRow {
  display: flex;
  gap: 16px;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
}
.gsCol {
  /* Strict 50/50 columns (gap-aware) */
  flex: 0 0 calc(50% - 8px);
  max-width: calc(50% - 8px);
  min-width: 0;
  display: flex;
  box-sizing: border-box;
}

.gsCardWrap {
  flex: 1;
  display: flex;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}
.gsCardWrap .Polaris-Card {
  flex: 1;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.gsCardWrap .Polaris-Card__Section { flex: 1; }

@media (max-width: 768px) {
  .gsRow { flex-direction: column; }
  .gsCol { flex: 0 0 100%; max-width: 100%; }
}
`}</style>
        <div className="gsRows">
          <div className="gsRow">
            <div className="gsCol">
            <StretchCard>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="100">
                    <Text as="h2" variant="headingMd">Onboarding checklist</Text>
                    <Text as="p" variant="bodySm">
                      {doneCount} / {steps.length} completed
                    </Text>
                  </BlockStack>
                  <Badge tone={progress === 100 ? "success" : "info"}>{progress}%</Badge>
                </InlineStack>

                <ProgressBar progress={progress} />

                <Divider />

                <List type="bullet">
                  {steps.map((s) => {
                    const locked = Boolean(s.proOnly) && !billing?.isPro;
                    return (
                      <List.Item key={s.key}>
                        <InlineStack align="space-between" blockAlign="center">
                          <InlineStack gap="200" blockAlign="center">
                            <Badge tone={s.done ? "success" : locked ? "critical" : "info"}>
                              {s.done ? "Done" : locked ? "Pro" : "Todo"}
                            </Badge>
                            <Text as="span" variant="bodyMd">{s.label}</Text>
                          </InlineStack>

                          <Button
                            size="slim"
                            disabled={locked}
                            url={withSearch(s.href)}
                            variant={s.done ? "secondary" : "primary"}
                          >
                            {s.done ? "Open" : locked ? "Upgrade" : "Start"}
                          </Button>
                        </InlineStack>
                      </List.Item>
                    );
                  })}
                </List>
              </BlockStack>
            </StretchCard>
          </div>
            <div className="gsCol">
            <StretchCard>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Quick actions</Text>

                <InlineStack gap="300" wrap>
                  <Button variant="primary" url={withSearch("/app/seo-tools?tab=products")}>
                    Generate for products
                  </Button>

                  <Button disabled={!billing?.isPro} url={withSearch("/app/seo-tools?tab=images")}>
                    Generate ALT for images
                  </Button>

                  <Button disabled={!billing?.isPro} url={withSearch("/app/seo-tools?tab=blog")}>
                    Generate for blog articles
                  </Button>

                  <Button url={withSearch("/app/generation-history")}>View history</Button>
                </InlineStack>

                {!billing?.isPro ? (
                  <Text as="p" variant="bodySm" tone="subdued">
                    Image ALT and Blog generators are Pro features.
                  </Text>
                ) : null}
              </BlockStack>
            </StretchCard>
          </div>
          </div>
          <div className="gsRow">
            <div className="gsCol">
            <StretchCard>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">Plan & limits</Text>
                {!billing?.isPro ? (
                  <Banner
                    tone="info"
                    title="Free plan limits"
                    action={{ content: "Upgrade to Pro", url: withSearch("/app/billing") }}
                  >
                    <Text as="p" variant="bodyMd">
                      Product SEO generation is available with a monthly limit. Image ALT and Blog SEO are Pro features.
                    </Text>
                    {freeLimit ? (
                      <Text as="p" variant="bodyMd">
                        Monthly product usage: <b>{freeUsed}</b> / <b>{freeLimit}</b> (remaining: <b>{freeRemaining}</b>)
                      </Text>
                    ) : null}
                  </Banner>
                ) : (
                  <Banner tone="success" title="Pro plan active">
                    <Text as="p" variant="bodyMd">All generators are unlocked.</Text>
                  </Banner>
                )}
              </BlockStack>
            </StretchCard>
          </div>
            <div className="gsCol">
            <StretchCard>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">Activity</Text>
                <Text as="p" variant="bodyMd">Product jobs: <b>{stats?.productJobs || 0}</b></Text>
                <Text as="p" variant="bodyMd">Image jobs: <b>{stats?.imageJobs || 0}</b></Text>
                <Text as="p" variant="bodyMd">Blog jobs: <b>{stats?.blogJobs || 0}</b></Text>
                <Text as="p" variant="bodyMd">Total jobs: <b>{stats?.totalJobs || 0}</b></Text>
                <Divider />
                <Text as="p" variant="bodySm" tone="subdued">
                  Tip: Start with 5–10 products, review the results, then scale up.
                </Text>
              </BlockStack>
            </StretchCard>
          </div>
          </div>
          <div className="gsRow">
            <div className="gsCol">
            <StretchCard>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">Best practices</Text>
                <List type="bullet">
                  <List.Item>Keep titles under ~60 characters.</List.Item>
                  <List.Item>Use one clear keyword, avoid stuffing.</List.Item>
                  <List.Item>Write descriptions that match the product and audience.</List.Item>
                  <List.Item>ALT text: describe what you see + product context.</List.Item>
                </List>
              </BlockStack>
            </StretchCard>
          </div>
            <div className="gsCol">
            <StretchCard>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">Shortcuts</Text>
                <InlineStack gap="200" wrap>
                  <Button url={withSearch("/app/seo-tools")}>SEO Tools</Button>
                  <Button url={withSearch("/app/generation-history")}>Generation History</Button>
                  <Button url={withSearch("/app/settings")}>Settings</Button>
                  <Button url={withSearch("/app/billing")}>Billing</Button>
                </InlineStack>
                {!isConfigured ? (
                  <Text as="p" variant="bodySm" tone="subdued">
                    Complete Settings to get the best results.
                  </Text>
                ) : null}
              </BlockStack>
            </StretchCard>
          </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);
