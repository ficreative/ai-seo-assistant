import { useEffect, useMemo, useState } from "react";
import {
  useFetcher,
  useLoaderData,
  useLocation,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";
import { authenticate } from "../shopify.server";
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  Select,
  Text,
  Button,
  Banner,
  BlockStack,
  Divider,
  Checkbox,
} from "@shopify/polaris";

/**
 * Settings (Sprint 2 - Paket 1)
 * - Per-shop settings persisted in Shopify Metafield.
 * - Removes localStorage dependency (multi-device friendly).
 */

const SETTINGS_NAMESPACE = "ai_seo_assistant";
const SETTINGS_KEY = "settings";

/** ----------------------- server helpers ----------------------- **/
async function getSettingsFromMetafield(admin) {
  const query = `#graphql
    query GetAiSeoAssistantSettings($namespace: String!, $key: String!) {
      shop {
        id
        metafield(namespace: $namespace, key: $key) {
          id
          type
          value
        }
      }
    }`;

  const res = await admin.graphql(query, {
    variables: { namespace: SETTINGS_NAMESPACE, key: SETTINGS_KEY },
  });
  const json = await res.json();
  const shop = json?.data?.shop;
  const raw = shop?.metafield?.value;

  let settings = null;
  if (raw) {
    try {
      settings = JSON.parse(raw);
    } catch {
      settings = null;
    }
  }
  return { shopId: shop?.id, settings };
}

async function setSettingsMetafield(admin, shopId, settingsObj) {
  const mutation = `#graphql
    mutation SetAiSeoAssistantSettings($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id }
        userErrors { field message }
      }
    }`;

  const value = JSON.stringify(settingsObj ?? {});
  const base = {
    ownerId: shopId,
    namespace: SETTINGS_NAMESPACE,
    key: SETTINGS_KEY,
    value,
  };

  // Try json first, fallback to json_string if needed
  for (const type of ["json", "json_string"]) {
    const res = await admin.graphql(mutation, {
      variables: { metafields: [{ ...base, type }] },
    });
    const json = await res.json();
    const errs = json?.data?.metafieldsSet?.userErrors || [];
    if (!errs.length) return { ok: true };
    // If type is invalid, try next type; otherwise return errors
    const typeErr = errs.some((e) => String(e?.message || "").toLowerCase().includes("type"));
    if (!typeErr) return { ok: false, errors: errs };
  }

  return { ok: false, errors: [{ message: "Failed to save settings metafield" }] };
}

/** ----------------------- Remix/Router loaders ----------------------- **/
export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const { settings } = await getSettingsFromMetafield(admin);
  return { settings: settings || null };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  if (intent !== "save_settings") {
    return { ok: false, error: "Unknown intent" };
  }

  const raw = String(form.get("settingsJson") || "{}");
  let settings = {};
  try {
    settings = JSON.parse(raw);
  } catch {
    settings = {};
  }

  const { shopId } = await getSettingsFromMetafield(admin);
  if (!shopId) return { ok: false, error: "Shop not found" };

  const result = await setSettingsMetafield(admin, shopId, settings);
  if (!result.ok) {
    return { ok: false, error: "Failed to save settings", details: result.errors || [] };
  }

  return { ok: true };
};

export default function Settings() {
  const { settings } = useLoaderData();
  const fetcher = useFetcher();

  const location = useLocation();
  const q = location.search || "";

  const defaults = useMemo(
    () => ({
      language: "tr",
      tone: "default",
      maxLength: "standard",
      apiMode: "auto",

      // Brand voice & rules (Sprint D)
      brandName: "",
      brandVoice: "",
      targetKeyword: "",
      requiredKeywords: "", // comma-separated
      bannedWords: "", // comma-separated
      allowEmojis: false,
      capitalization: "titlecase", // titlecase | sentence | uppercase | none
      titleMaxChars: "70",
      descriptionMaxChars: "160",

      // Optional templates (use placeholders: {productTitle}, {brand}, {keyword})
      titleTemplate: "",
      descriptionTemplate: "",
    }),
    [],
  );

  const [form, setForm] = useState(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) setForm({ ...defaults, ...settings });
  }, [defaults, settings]);

  useEffect(() => {
    if (fetcher?.data?.ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    }
  }, [fetcher?.data]);

  const set = (key) => (value) => {
    setSaved(false);
    setForm((p) => ({ ...p, [key]: value }));
  };

  const onSave = () => {
    const fd = new FormData();
    fd.set("intent", "save_settings");
    fd.set("settingsJson", JSON.stringify(form || {}));
    fetcher.submit(fd, { method: "post" });
  };

  return (
    <Page title="Settings" fullWidth>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              {saved && (
                <Banner tone="success" title="Saved">
                  Settings saved successfully.
                </Banner>
              )}

              {fetcher?.data?.ok === false && (
                <Banner tone="critical" title="Save failed">
                  {fetcher?.data?.error || "Unknown error"}
                </Banner>
              )}

              <FormLayout>
                <Select
                  label="Language"
                  options={[
                    { label: "Turkish (tr)", value: "tr" },
                    { label: "English (en)", value: "en" },
                    { label: "German (de)", value: "de" },
                    { label: "French (fr)", value: "fr" },
                    { label: "Spanish (es)", value: "es" },
                    { label: "Italian (it)", value: "it" },
                    { label: "Dutch (nl)", value: "nl" },
                    { label: "Portuguese (pt)", value: "pt" },
                  ]}
                  value={form.language}
                  onChange={set("language")}
                />

                <Select
                  label="Tone"
                  options={[
                    { label: "Default", value: "default" },
                    { label: "Professional", value: "professional" },
                    { label: "Friendly", value: "friendly" },
                    { label: "Luxury", value: "luxury" },
                    { label: "Playful", value: "playful" },
                  ]}
                  value={form.tone}
                  onChange={set("tone")}
                />

                <Select
                  label="Max length"
                  options={[
                    { label: "Standard", value: "standard" },
                    { label: "Short", value: "short" },
                    { label: "Long", value: "long" },
                  ]}
                  value={form.maxLength}
                  onChange={set("maxLength")}
                />

                <Select
                  label="API mode"
                  options={[
                    { label: "Auto", value: "auto" },
                    { label: "Fast", value: "fast" },
                    { label: "Quality", value: "quality" },
                  ]}
                  value={form.apiMode}
                  onChange={set("apiMode")}
                />

                <Divider />
                <Text as="h3" variant="headingMd">
                  Brand voice & rules
                </Text>

                <TextField
                  label="Brand name"
                  value={form.brandName}
                  onChange={set("brandName")}
                  autoComplete="off"
                  helpText="Optional. Used in prompts and templates."
                />

                <TextField
                  label="Brand voice (guidelines)"
                  value={form.brandVoice}
                  onChange={set("brandVoice")}
                  autoComplete="off"
                  multiline={4}
                  helpText="Write your tone, style rules, do/don't, example phrases, etc."
                />

                <TextField
                  label="Target keyword"
                  value={form.targetKeyword}
                  onChange={set("targetKeyword")}
                  autoComplete="off"
                  helpText="Optional. The assistant will try to include it naturally."
                />

                <TextField
                  label="Required keywords (comma-separated)"
                  value={form.requiredKeywords}
                  onChange={set("requiredKeywords")}
                  autoComplete="off"
                  helpText="Example: drawer slide, telescopic rail, soft close"
                />

                <TextField
                  label="Banned words (comma-separated)"
                  value={form.bannedWords}
                  onChange={set("bannedWords")}
                  autoComplete="off"
                  helpText="Words that should not appear in title/description."
                />

                <Checkbox
                  label="Allow emojis"
                  checked={Boolean(form.allowEmojis)}
                  onChange={(v) => set("allowEmojis")(Boolean(v))}
                />

                <Select
                  label="Capitalization"
                  options={[
                    { label: "Title Case", value: "titlecase" },
                    { label: "Sentence case", value: "sentence" },
                    { label: "UPPERCASE", value: "uppercase" },
                    { label: "No preference", value: "none" },
                  ]}
                  value={form.capitalization}
                  onChange={set("capitalization")}
                />

                <FormLayout.Group condensed>
                  <TextField
                    label="SEO title max chars"
                    type="number"
                    value={String(form.titleMaxChars || "70")}
                    onChange={set("titleMaxChars")}
                    autoComplete="off"
                  />
                  <TextField
                    label="SEO description max chars"
                    type="number"
                    value={String(form.descriptionMaxChars || "160")}
                    onChange={set("descriptionMaxChars")}
                    autoComplete="off"
                  />
                </FormLayout.Group>

                <Divider />
                <Text as="h3" variant="headingMd">
                  Templates (optional)
                </Text>

                <TextField
                  label="Title template"
                  value={form.titleTemplate}
                  onChange={set("titleTemplate")}
                  autoComplete="off"
                  helpText="Use placeholders: {productTitle}, {brand}, {keyword}"
                />

                <TextField
                  label="Description template"
                  value={form.descriptionTemplate}
                  onChange={set("descriptionTemplate")}
                  autoComplete="off"
                  multiline={3}
                  helpText="Use placeholders: {productTitle}, {brand}, {keyword}"
                />

                <Button variant="primary" onClick={onSave} loading={fetcher.state !== "idle"}>
                  Save settings
                </Button>
              </FormLayout>

              <Text as="p" variant="bodySm" tone="subdued">
                These settings are stored per-shop and apply across devices. (Query string preserved: {q})
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

/** ---------------- error boundary ---------------- */
export function ErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    title = `Error ${error.status}`;
    message = error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <Page title="Settings" fullWidth>
      <Layout>
        <Layout.Section>
          <Banner tone="critical" title={title}>
            {message}
          </Banner>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
