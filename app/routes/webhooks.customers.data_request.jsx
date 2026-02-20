import { authenticate } from "../shopify.server";

/**
 * Mandatory compliance webhook: customers/data_request
 * If you don't store customer data, you can simply acknowledge the request (200).
 * If you do store customer data, you must provide it to the store owner within 30 days.
 */
export const action = async ({ request }) => {
  const { shop, topic, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // TODO: If your app stores customer data, collect it by IDs in payload and send to the shop owner.
  // This app currently does not store customer PII in our DB, so we only acknowledge.

  return new Response(null, { status: 200 });
};
