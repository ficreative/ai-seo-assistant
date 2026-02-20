import { useState } from "react";
import { Form, useActionData, useLoaderData } from "react-router";
import { Page, Layout, Card, TextField, Button, BlockStack, Banner, Text } from "@shopify/polaris";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

export const loader = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return { errors };
};

export const action = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return { errors };
};

export default function Login() {
  const { errors } = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");

  const mergedErrors = actionData?.errors || errors || {};
  const hasError = Boolean(mergedErrors?.shop);

  return (
    <Page title="Log in">
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

              <Form method="post">
                <BlockStack gap="300">
                  <TextField
                    label="Shop domain"
                    value={shop}
                    onChange={setShop}
                    name="shop"
                    autoComplete="on"
                    helpText="example.myshopify.com"
                    error={mergedErrors.shop}
                  />
                  <Button submit variant="primary">
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