import { useMemo } from "react";
import {
  useFetcher,
  Link as RouterLink,
  useLocation,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Banner,
  TextField,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return jsonResponse({ ok: true });
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");

  if (intent !== "create_sample_product") {
    return jsonResponse({ ok: false, error: "Unknown intent" }, 400);
  }

  const color = ["Red", "Orange", "Yellow", "Green"][Math.floor(Math.random() * 4)];
  const title = `${color} Snowboard (AI SEO Assistant)`;

  const mutation = `#graphql
    mutation CreateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product { id title handle }
        userErrors { field message }
      }
    }
  `;

  const resp = await admin.graphql(mutation, {
    variables: { input: { title } },
  });
  const json = await resp.json();
  const payload = json?.data?.productCreate;

  const userErrors = payload?.userErrors || [];
  if (userErrors.length) {
    return jsonResponse({ ok: false, userErrors }, 200);
  }

  return jsonResponse({ ok: true, product: payload?.product }, 200);
};

export default function AppHome() {
  const location = useLocation();
  const withSearch = (path) => `${path}${location.search || ""}`;
  const fetcher = useFetcher();
  const data = fetcher.data;

  const hasErrors = Array.isArray(data?.userErrors) && data.userErrors.length > 0;

  const jsonPretty = useMemo(() => {
    if (!data) return "";
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }, [data]);

  return (
    <Page title="AI SEO Assistant">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="p" variant="bodyMd">
                This app uses Shopify Polaris for a native Admin look & feel.
              </Text>

              <InlineStack gap="300" align="start">
                <Button
                  variant="primary"
                  loading={fetcher.state !== "idle"}
                  onClick={() => fetcher.submit({ intent: "create_sample_product" }, { method: "post" })}
                >
                  Create a sample product
                </Button>

                <Button
                  url="https://shopify.dev/docs/api/admin-graphql"
                  external
                >
                  Admin GraphQL docs
                </Button>
              </InlineStack>

              {data && (
                <>
                  {hasErrors ? (
                    <Banner title="Shopify returned errors" tone="critical">
                      <BlockStack gap="200">
                        {data.userErrors.map((e, i) => (
                          <Text as="p" key={i} variant="bodyMd">
                            {e.message}
                          </Text>
                        ))}
                      </BlockStack>
                    </Banner>
                  ) : data.ok ? (
                    <Banner title="Done" tone="success">
                      <Text as="p" variant="bodyMd">
                        Sample product created successfully.
                      </Text>
                    </Banner>
                  ) : null}

                  <Card>
                    <BlockStack gap="200">
                      <Text as="h2" variant="headingMd">
                        Response
                      </Text>
                      <TextField
                        label=""
                        value={jsonPretty}
                        multiline={10}
                        readOnly
                        monospaced
                        autoComplete="off"
                      />
                    </BlockStack>
                  </Card>
                </>
              )}

              <Text as="p" variant="bodySm" tone="subdued">
                Tip: Use the <RouterLink to={withSearch("/app/seo-tools")}>SEO Tools</RouterLink> page to generate SEO titles/descriptions with Polaris UI.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};


/** ---------------- route ErrorBoundary ---------------- */
export function ErrorBoundary() {
  const err = useRouteError();
  // eslint-disable-next-line no-console
  console.error("Dashboard ErrorBoundary:", err);

  let bannerTitle = "Something went wrong";
  let message = "Unknown error";

  if (isRouteErrorResponse(err)) {
    bannerTitle = `Error ${err.status}`;
    message = err.data || err.statusText;
  } else if (err instanceof Error) {
    message = err.message;
  } else {
    message = String(err);
  }

  return (
    <Page title="Dashboard" fullWidth>
      <Banner tone="critical" title={bannerTitle}>
        <Text as="p" variant="bodyMd">
          {message}
        </Text>
      </Banner>
    </Page>
  );
}
