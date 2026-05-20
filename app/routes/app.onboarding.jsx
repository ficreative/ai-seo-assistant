import { useLoaderData, useLocation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import {
  Page,
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
    try {
      settings = JSON.parse(raw);
    } catch {
      settings = null;
    }
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

  const [totalJobs, productJobs, imageJobs, blogJobs] = await Promise.all([
    prisma.seoJob.count({
      where: { shop: session.shop },
    }),
    prisma.seoJob.count({
      where: { shop: session.shop, jobType: "PRODUCT_SEO" },
    }),
    prisma.seoJob.count({
      where: { shop: session.shop, jobType: "ALT_TEXT_IMAGES" },
    }),
    prisma.seoJob.count({
      where: { shop: session.shop, jobType: "BLOG_SEO_META" },
    }),
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

function DashboardCard({ children }) {
  return (
    <div className="gsCard">
      <Card>
        <div className="gsCardInner">{children}</div>
      </Card>
    </div>
  );
}

export default function Onboarding() {
  const { settings, billing, stats } = useLoaderData();
  const location = useLocation();

  const withSearch = (path) => {
    const search = location.search || "";
    if (!search) return path;

    return path.includes("?")
      ? `${path}&${search.replace(/^\?/, "")}`
      : `${path}${search}`;
  };

  const isConfigured =
    settings &&
    (settings.brandName ||
      settings.brandVoiceGuidelines ||
      settings.targetKeyword);

  const stepSettings = Boolean(isConfigured);
  const stepProduct = (stats?.productJobs || 0) > 0;
  const stepReview = (stats?.totalJobs || 0) > 0;
  const stepImages = (stats?.imageJobs || 0) > 0;
  const stepBlog = (stats?.blogJobs || 0) > 0;

  const steps = [
    {
      key: "settings",
      label: "Complete Settings",
      done: stepSettings,
      href: "/app/settings",
    },
    {
      key: "product",
      label: "Generate SEO for products",
      done: stepProduct,
      href: "/app/seo-tools?tab=products",
    },
    {
      key: "review",
      label: "Review results in Generation History",
      done: stepReview,
      href: "/app/generation-history",
    },
    {
      key: "images",
      label: "Generate ALT text for images",
      done: stepImages,
      href: "/app/seo-tools?tab=images",
      proOnly: true,
    },
    {
      key: "blog",
      label: "Generate SEO for blog articles",
      done: stepBlog,
      href: "/app/seo-tools?tab=blog",
      proOnly: true,
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const progress = clamp(Math.round((doneCount / steps.length) * 100), 0, 100);

  const planKey = String(billing?.planKey || "").toLowerCase();

  const isProPlan =
    Boolean(billing?.isPro) ||
    planKey.includes("pro") ||
    planKey.includes("monthly") ||
    planKey.includes("yearly") ||
    planKey.includes("annual");

  const freeUsed = billing?.free?.used || 0;
  const freeLimit = billing?.free?.limit || billing?.free?.monthlyLimit || 0;
  const freeRemaining =
    typeof billing?.free?.remaining === "number"
      ? billing.free.remaining
      : Math.max(0, freeLimit - freeUsed);

  return (
    <Page title="Get started" fullWidth>
      <style>{`
        .gsPage {
          width: 100%;
          box-sizing: border-box;
        }

        .gsGrid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          align-items: stretch;
          box-sizing: border-box;
        }

        .gsCard {
          width: 100%;
          min-width: 0;
          height: 100%;
          min-height: 300px;
          box-sizing: border-box;
        }

        .gsCard > .Polaris-Card {
          height: 100%;
          width: 100%;
          min-height: 300px;
          display: flex;
          flex-direction: column;
          border-radius: 18px;
          overflow: hidden;
        }

        .gsCard .Polaris-ShadowBevel {
          border-radius: 18px;
        }

        .gsCardInner {
          height: 100%;
          min-height: 300px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .gsCardInner > .Polaris-BlockStack {
          flex: 1;
        }

        .gsChecklistItem {
          width: 100%;
          min-width: 0;
        }

        .gsChecklistContent {
          flex: 1;
          min-width: 0;
        }

        @media (max-width: 768px) {
          .gsGrid {
            grid-template-columns: 1fr;
          }

          .gsCard,
          .gsCard > .Polaris-Card,
          .gsCardInner {
            min-height: auto;
          }
        }
      `}</style>

      <div className="gsPage">
        <div className="gsGrid">
          <DashboardCard>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text as="h2" variant="headingMd">
                    Onboarding checklist
                  </Text>
                  <Text as="p" variant="bodySm">
                    {doneCount} / {steps.length} completed
                  </Text>
                </BlockStack>

                <Badge tone={progress === 100 ? "success" : "info"}>
                  {progress}%
                </Badge>
              </InlineStack>

              <ProgressBar progress={progress} />

              <Divider />

              <List type="bullet">
                {steps.map((s) => {
                  const locked = Boolean(s.proOnly) && !isProPlan;

                  return (
                    <List.Item key={s.key}>
                      <div className="gsChecklistItem">
                        <InlineStack
                          align="space-between"
                          blockAlign="center"
                          gap="300"
                          wrap={false}
                        >
                          <div className="gsChecklistContent">
                            <InlineStack gap="200" blockAlign="center" wrap={false}>
                              <Badge
                                tone={
                                  s.done
                                    ? "success"
                                    : locked
                                      ? "critical"
                                      : "info"
                                }
                              >
                                {s.done ? "Done" : locked ? "Pro" : "Todo"}
                              </Badge>

                              <Text as="span" variant="bodyMd">
                                {s.label}
                              </Text>
                            </InlineStack>
                          </div>

                          <Button
                            size="slim"
                            disabled={locked}
                            url={withSearch(s.href)}
                            variant={s.done ? "secondary" : "primary"}
                          >
                            {s.done ? "Open" : locked ? "Upgrade" : "Start"}
                          </Button>
                        </InlineStack>
                      </div>
                    </List.Item>
                  );
                })}
              </List>
            </BlockStack>
          </DashboardCard>

          <DashboardCard>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Quick actions
              </Text>

              <InlineStack gap="300" wrap>
                <Button
                  variant="primary"
                  url={withSearch("/app/seo-tools?tab=products")}
                >
                  Generate for products
                </Button>

                <Button
                  disabled={!isProPlan}
                  url={withSearch("/app/seo-tools?tab=images")}
                >
                  Generate ALT for images
                </Button>

                <Button
                  disabled={!isProPlan}
                  url={withSearch("/app/seo-tools?tab=blog")}
                >
                  Generate for blog articles
                </Button>

                <Button url={withSearch("/app/generation-history")}>
                  View history
                </Button>
              </InlineStack>

              {!isProPlan ? (
                <Text as="p" variant="bodySm" tone="subdued">
                  Image ALT and Blog generators are Pro features.
                </Text>
              ) : (
                <Text as="p" variant="bodySm" tone="subdued">
                  Your Pro plan is active. Product SEO, Image ALT, and Blog SEO generators are unlocked.
                </Text>
              )}
            </BlockStack>
          </DashboardCard>

          <DashboardCard>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Plan & limits
              </Text>

              {!isProPlan ? (
                <Banner
                  tone="info"
                  title="Free plan limits"
                  action={{
                    content: "Upgrade to Pro",
                    url: withSearch("/app/billing"),
                  }}
                >
                  <Text as="p" variant="bodyMd">
                    Product SEO generation is available with a monthly limit.
                    Image ALT and Blog SEO are Pro features.
                  </Text>

                  {freeLimit ? (
                    <Text as="p" variant="bodyMd">
                      Monthly product usage: <b>{freeUsed}</b> /{" "}
                      <b>{freeLimit}</b>{" "}
                      (remaining: <b>{freeRemaining}</b>)
                    </Text>
                  ) : null}
                </Banner>
              ) : (
                <Banner tone="success" title="Pro plan active">
                  <BlockStack gap="200">
                    <Text as="p" variant="bodyMd">
                      Your Pro plan is active. All AI SEO generators are unlocked.
                    </Text>

                    <Text as="p" variant="bodyMd">
                      You can generate SEO titles and descriptions for products, ALT text for product images,
                      and SEO metadata for blog articles.
                    </Text>

                    <Text as="p" variant="bodySm" tone="subdued">
                      Plan: <b>{billing?.planKey || "Pro"}</b>
                    </Text>
                  </BlockStack>
                </Banner>
              )}
            </BlockStack>
          </DashboardCard>

          <DashboardCard>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Activity
              </Text>

              <Text as="p" variant="bodyMd">
                Product jobs: <b>{stats?.productJobs || 0}</b>
              </Text>

              <Text as="p" variant="bodyMd">
                Image jobs: <b>{stats?.imageJobs || 0}</b>
              </Text>

              <Text as="p" variant="bodyMd">
                Blog jobs: <b>{stats?.blogJobs || 0}</b>
              </Text>

              <Text as="p" variant="bodyMd">
                Total jobs: <b>{stats?.totalJobs || 0}</b>
              </Text>

              <Divider />

              <Text as="p" variant="bodySm" tone="subdued">
                Tip: Start with 5–10 products, review the results, then scale up.
              </Text>
            </BlockStack>
          </DashboardCard>

          <DashboardCard>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Best practices
              </Text>

              <List type="bullet">
                <List.Item>Keep titles under ~60 characters.</List.Item>
                <List.Item>Use one clear keyword, avoid stuffing.</List.Item>
                <List.Item>
                  Write descriptions that match the product and audience.
                </List.Item>
                <List.Item>
                  ALT text: describe what you see + product context.
                </List.Item>
              </List>
            </BlockStack>
          </DashboardCard>

          <DashboardCard>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Shortcuts
              </Text>

              <InlineStack gap="200" wrap>
                <Button url={withSearch("/app/seo-tools")}>SEO Tools</Button>
                <Button url={withSearch("/app/generation-history")}>
                  Generation History
                </Button>
                <Button url={withSearch("/app/settings")}>Settings</Button>
                <Button url={withSearch("/app/billing")}>Billing</Button>
              </InlineStack>

              {!isConfigured ? (
                <Text as="p" variant="bodySm" tone="subdued">
                  Complete Settings to get the best results.
                </Text>
              ) : null}
            </BlockStack>
          </DashboardCard>
        </div>
      </div>
    </Page>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);