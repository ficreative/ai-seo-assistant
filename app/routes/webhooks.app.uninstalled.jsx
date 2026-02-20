import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Fully remove all shop data from our database on uninstall.
  // Webhook requests can trigger multiple times; these deletes are idempotent.
  try {
    await db.$transaction([
      db.seoJob.deleteMany({ where: { shop } }),
      db.freePlanUsageMonthly.deleteMany({ where: { shop } }),
      db.billingSubscription.deleteMany({ where: { shop } }),
      db.session.deleteMany({ where: { shop } }),
    ]);
  } catch (err) {
    // If tables were already cleared or the DB is temporarily unavailable,
    // don't fail the uninstall webhook.
    console.error("Uninstall cleanup error:", err);
  }

  return new Response();
};
