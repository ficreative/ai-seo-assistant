import { useState } from "react";
import { redirect, Form, useLoaderData, useActionData } from "react-router";
import { Page, Layout, Card, TextField, Button, BlockStack, Banner, Text } from "@shopify/polaris";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "../auth.login/error.server"; // path gerekirse düzelt

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  // Root'a shop paramı ile gelinirse direkt /auth (OAuth başlangıcı)
  if (url.searchParams.get("shop")) {
    throw redirect(`/auth?${url.searchParams.toString()}`);
  }

  // loginErrorMessage, login() içinden gelen hatayı düzgün basmak için
  const errors = loginErrorMessage(await login(request));
  return { errors };
};

export const action = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return { errors };
};

export default function Index() {
  const { errors } = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");

  const mergedErrors = actionData?.errors || errors || {};
  const hasError = Boolean(mergedErrors?.shop);

  return (
    <Page title="AI SEO Assistant">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              {hasError && (
                <Banner title="Login error" tone="critical">
                  <Text as="p" variant="bodyMd">
                    {mergedErrors.shop}
                  </Text>
                </Banner>
              )}

              <Text as="p" variant="bodyMd">
                Enter your <strong>.myshopify.com</strong> domain to log in.
              </Text>

              <Form method="post">
                <BlockStack gap="300">
                  <TextField
                    label="Shop domain"
                    value={shop}
                    onChange={setShop}
                    name="shop"
                    autoComplete="on"
                    placeholder="my-shop-domain.myshopify.com"
                    helpText="example.myshopify.com"
                    error={mergedErrors.shop}
                  />
                  <Button submit variant="primary" disabled={!shop.trim()}>
                    Log in
                  </Button>
                </BlockStack>
              </Form>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}