import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const url = process.env.TERMS_URL || "https://example.com/terms";
  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
    },
  });
};

export const headers = (headersArgs) => boundary.headers(headersArgs);

export default function Redirect() {
  return null;
}
