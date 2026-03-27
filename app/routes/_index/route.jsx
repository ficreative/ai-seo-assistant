// app/routes/_index/route.jsx
import { useState } from "react";
import { redirect, Form, useLoaderData } from "react-router";
import {
  Page,
  Layout,
  Card,
  Text,
  TextField,
  Button,
  BlockStack,
} from "@shopify/polaris";
import { login } from "../../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  // Eğer shop paramı varsa direkt embedded app'e yönlendir
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  // login fonksiyonu tanımlıysa formu göster
  return { showForm: Boolean(login) };
};

export default function Index() {
  const { showForm } = useLoaderData();
  const [shop, setShop] = useState("");

  return (
    <Page title="AI SEO Assistant">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="p" variant="bodyMd">
                Enter your <strong>.myshopify.com</strong> domain to log in.
              </Text>

              {showForm ? (
                <Form method="post" action="/auth/login">
                  <BlockStack gap="300">
                    <TextField
                      label="Shop domain"
                      name="shop"
                      value={shop}
                      onChange={setShop}
                      autoComplete="off"
                      placeholder="my-shop-domain.myshopify.com"
                    />
                    <Button submit variant="primary">
                      Log in
                    </Button>
                  </BlockStack>
                </Form>
              ) : (
                <Text as="p" variant="bodyMd">
                  Login route is not configured.
                </Text>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}