// app/routes/webhooks.jsx
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    // ✅ HMAC doğrulama burada yapılır
    const { topic, shop } = await authenticate.webhook(request);

    // Bu üç mandatory compliance webhook için 200 dönmek yeterli
    if (
      topic === "CUSTOMERS_DATA_REQUEST" ||
      topic === "CUSTOMERS_REDACT" ||
      topic === "SHOP_REDACT"
    ) {
      console.log(`[COMPLIANCE] ${topic} received for ${shop}`);
      return new Response("OK", { status: 200 });
    }

    // Diğer topic gelirse de 200 dönelim (zararsız)
    return new Response("OK", { status: 200 });
  } catch (err) {
    // ❗ Shopify bu testte invalid HMAC için 401 bekler
    console.error("Webhook verification failed:", err);
    return new Response("Unauthorized", { status: 401 });
  }
};