import { authenticate } from "../shopify.server";

/**
 * Mandatory compliance webhook: customers/redact
 * If you store customer data, delete/redact it.
 */
export const action = async ({ request }) => {
  const { shop, topic, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // TODO: If your app stores customer data, delete/redact it using IDs in payload.
  // This app currently does not store customer PII, so we only acknowledge.

  return new Response(null, { status: 200 });
};
