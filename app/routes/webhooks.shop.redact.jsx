import { authenticate } from "../shopify.server";
import db from "../db.server";

/**
 * Mandatory compliance webhook: shop/redact
 * Delete/redact all shop data that your app stored for this shop.
 *
 * Note: We intentionally do not log webhook payloads to avoid accidentally logging PII.
 */
export const action = async ({ request }) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Best-effort cleanup for our app data. Always return 200 so Shopify marks it received.
  try {
    await db.$transaction([
      // App billing record (mock for now)
      db.billingSubscription.deleteMany({ where: { shop } }),

      // Free plan usage counters
      db.freePlanUsageMonthly.deleteMany({ where: { shop } }),

      // SEO jobs (cascades to SeoJobItem via onDelete: Cascade)
      db.seoJob.deleteMany({ where: { shop } }),

      // OAuth sessions
      db.session.deleteMany({ where: { shop } }),
    ]);
  } catch (e) {
    console.error("shop/redact cleanup error:", e);
  }

  return new Response(null, { status: 200 });
};
