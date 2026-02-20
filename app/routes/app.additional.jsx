import { Page, Layout, Card, Text, BlockStack, Link } from "@shopify/polaris";

export default function AdditionalPage() {
  return (
    <Page title="Additional page">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd">
                This is an example extra page, rendered with Shopify Polaris components.
              </Text>
              <Text as="p" variant="bodyMd">
                Learn more about embedded apps and navigation in{" "}
                <Link url="https://shopify.dev/docs/apps/tools/app-bridge" external>
                  Shopify App Bridge docs
                </Link>.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
