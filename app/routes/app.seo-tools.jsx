import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";
import { authenticate } from "../shopify.server";
import {
  Page,
  Layout,
  Card,
  Modal,
  IndexTable,
  IndexFilters,
  IndexFiltersMode,
  Text,
  Badge,
  Button,
  ButtonGroup,
  Icon,
  Thumbnail,
  BlockStack,
  InlineStack,
  Banner,
  Box,
  useIndexResourceState,
  TextField,
  ChoiceList,
  Checkbox,
  Popover,
  Pagination,
  Select,
} from "@shopify/polaris";
import { SearchIcon, FilterIcon, SortIcon, PlusIcon } from "@shopify/polaris-icons";

import { createAltTextJob, createGenerateJob, createBlogMetaJob } from "../jobs.server";
import { enqueueSeoJob } from "../queue.server";
import { BILLING_PLANS } from "../billing.plans.js";
import { getBillingContext, reserveIfFreePlan } from "../billing.gating.server.js";
const SETTINGS_NAMESPACE = "ai_seo_assistant";
const SETTINGS_KEY = "settings";

async function getSettingsFromMetafield(admin) {
  const query = `#graphql
    query GetAiSeoAssistantSettings($namespace: String!, $key: String!) {
      shop {
        metafield(namespace: $namespace, key: $key) { value }
      }
    }`;
  const res = await admin.graphql(query, {
    variables: { namespace: SETTINGS_NAMESPACE, key: SETTINGS_KEY },
  });
  const json = await res.json();
  const raw = json?.data?.shop?.metafield?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}


/** ----------------------- Response helper ----------------------- **/
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function sanitizeLanguage(input) {
  const raw = String(input || "").trim().toLowerCase();
  const m = raw.match(/^[a-z]{2}/);
  return m ? m[0] : "tr";
}


/** ----------------------- Shopify helpers ----------------------- **/
async function listProducts(admin, q, opts = {}) {
  const limit = Number(opts.limit || 25);
  const after = opts.after || null;
  const before = opts.before || null;

  const query = `#graphql
    query Products($first: Int, $after: String, $last: Int, $before: String, $query: String) {
      productsCount(query: $query) {
        count
      }
      products(first: $first, after: $after, last: $last, before: $before, query: $query) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            id
            title
            description
            status
            featuredImage { url altText }
            seo { title description }
            tags
            productType
          }
        }
      }
    }
  `;

  const variables = {
    query: q || null,
    // Use "before" for prev page, otherwise "after" for next/first page
    first: before ? null : limit,
    after: before ? null : after,
    last: before ? limit : null,
    before: before,
  };

  const resp = await admin.graphql(query, { variables });
  const json = await resp.json();
  const connection = json?.data?.products;
  const edges = connection?.edges || [];
  return {
    items: edges.map((e) => e.node),
    pageInfo: connection?.pageInfo || {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
    // Shopify Admin API returns productsCount as a Count object.
    totalCount: Number(json?.data?.productsCount?.count ?? 0),
  };
}


async function listCollections(admin) {
  const query = `#graphql
    query Collections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `;
  const resp = await admin.graphql(query, { variables: { first: 50 } });
  const json = await resp.json();
  const edges = json?.data?.collections?.edges || [];
  return edges.map((e) => ({ id: e.node.id, title: e.node.title }));
}
async function listProductImages(admin, q) {
  const query = `#graphql
    query ProductsWithImages($first: Int!, $query: String) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            description
            status
            featuredImage { url altText }
            media(first: 20) {
              edges {
                node {
                  __typename
                  ... on MediaImage {
                    id
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const resp = await admin.graphql(query, { variables: { first: 25, query: q || null } });
  const json = await resp.json();
  const edges = json?.data?.products?.edges || [];

  return edges
    .map((e) => e.node)
    .map((p) => {
      const mediaEdges = p?.media?.edges || [];
      const images = mediaEdges
        .map((me) => me?.node)
        .filter((n) => n?.__typename === "MediaImage" && n?.image?.url)
        .map((n) => ({
          mediaId: String(n.id),
          url: String(n.image.url),
          altText: n.image.altText ? String(n.image.altText) : "",
        }));
      return {
        id: String(p.id),
        title: p.title,
        status: p.status,
        featuredImage: p.featuredImage || null,
        images,
      };
    });
}


async function listBlogArticles(admin) {
  const query = `#graphql
    query BlogsWithArticles($blogsFirst: Int!, $articlesFirst: Int!) {
      blogs(first: $blogsFirst) {
        edges {
          node {
            id
            title
            articles(first: $articlesFirst) {
              edges {
                node {
                  id
                  title
                  handle
                  publishedAt
                  titleTag: metafield(namespace: "global", key: "title_tag") { value }
                  descriptionTag: metafield(namespace: "global", key: "description_tag") { value }
                }
              }
            }
          }
        }
      }
    }
  `;

  const resp = await admin.graphql(query, { variables: { blogsFirst: 10, articlesFirst: 50 } });
  const json = await resp.json();

  // If scopes are missing or fields are invalid, Shopify returns GraphQL errors and data may be null.
  if (json?.errors?.length) {
    const message = json.errors.map((e) => e.message).join(" | ");
    throw new Error(`Blog articles fetch failed: ${message}`);
  }

  const blogs = json?.data?.blogs?.edges?.map((e) => e.node) || [];

  const out = [];
  for (const b of blogs) {
    const edges = b?.articles?.edges || [];
    for (const e of edges) {
      const a = e.node;
      const titleTag = a?.titleTag?.value || "";
      const descTag = a?.descriptionTag?.value || "";
      out.push({
        id: String(a.id),
        title: a.title,
        blogTitle: b.title,
        isPublished: Boolean(a.publishedAt),
        publishedAt: a.publishedAt,
        seoTitle: titleTag,
        seoDescription: descTag,
      });
    }
  }
  return out;
}


function buildShopifyProductQuery({ queryValue, statusTab, tag, category, collection, meta }) {
  const parts = [];
  const q = String(queryValue || "").trim();
  if (q) parts.push(q);

  if (statusTab === "active") parts.push("status:active");
  if (statusTab === "draft") parts.push("status:draft");
  if (statusTab === "archived") parts.push("status:archived");

  const normList = (val) =>
    String(val || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const qVal = (v) => (/[\s"]/g.test(v) ? `"${v.replace(/"/g, '\\"')}"` : v);

  const orGroup = (prefix, values) => {
    const vs = normList(values);
    if (!vs.length) return "";
    if (vs.length === 1) return `${prefix}${qVal(vs[0])}`;
    return `(${vs.map((x) => `${prefix}${qVal(x)}`).join(" OR ")})`;
  };

  const tagPart = orGroup("tag:", tag);
  if (tagPart) parts.push(tagPart);

  const catPart = orGroup("product_type:", category);
  if (catPart) parts.push(catPart);

  const colPart = orGroup("collection:", collection);
  if (colPart) parts.push(colPart);

  // meta is handled client-side in this route; keep it out of Shopify query
  return parts.filter(Boolean).join(" ");
}

/** ----------------------- Loader / Action ----------------------- **/
export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const url = new URL(request.url);

  const tab = url.searchParams.get("tab") || "products";


  const queryValue = url.searchParams.get("q") || "";
  const statusTab = url.searchParams.get("status") || "all";
  const tag = url.searchParams.get("tag") || "";
  const category = url.searchParams.get("category") || "";
  const collection = url.searchParams.get("collection") || "";
  const meta = url.searchParams.get("meta") || "";

  // Pagination (Products)
  const limit = Math.max(1, Math.min(250, Number(url.searchParams.get("limit") || 25)));
  const after = url.searchParams.get("after") || "";
  const before = url.searchParams.get("before") || "";

  const settings = await getSettingsFromMetafield(admin);

    // Language should primarily follow Settings page.
  // We keep `lang` in URL only for persistence/back-forward, but settings win.
  const lang = sanitizeLanguage(settings?.language || url.searchParams.get("lang") || "tr");

  const shopifyQuery = buildShopifyProductQuery({
    queryValue,
    statusTab,
    tag,
    category,
    collection,
    meta,
  });

  const productsResult = tab === "products" ? await listProducts(admin, shopifyQuery, { limit, after: after || null, before: before || null }) : { items: [], pageInfo: null, totalCount: 0 };
  const products = productsResult.items;
  const productsPageInfo = productsResult.pageInfo;
  const collections = tab === "products" ? await listCollections(admin) : [];
  const imageProducts = tab === "images" ? await listProductImages(admin, shopifyQuery) : [];
  let blogArticles = [];
  let blogError = "";
  if (tab === "articles") {
    try {
      blogArticles = await listBlogArticles(admin);
    } catch (e) {
      blogError = e?.message || String(e);
      blogArticles = [];
    }
  }

  const billing = await getBillingContext(session.shop);

  return jsonResponse({
    shop: session.shop,
    tab,
    lang,
    settings,
    products,
    productsPageInfo,
    productsPageSize: limit,
    productsTotalCount: productsResult.totalCount,
    collections,
    imageProducts,
    blogArticles,
    blogError,
    billing: {
      isPro: billing.isPro,
      planKey: billing.planKey,
      mode: billing.mode,
      free: billing.free,
    },
    filters: { queryValue, statusTab, tag, category, collection, meta },
  });
};

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  // Billing context (used for plan gating)
  const billing = await getBillingContext(session.shop);

  // --- Images: update ALT text directly from preview modal (Sprint D)
  if (intent === "update_image_alt") {
    const productId = String(form.get("productId") || "").trim();
    const mediaId = String(form.get("mediaId") || "").trim();
    const altText = String(form.get("altText") || "");

    if (!productId || !mediaId) {
      return jsonResponse({ ok: false, error: "Missing productId or mediaId" }, 400);
    }

    const mutation = `#graphql
      mutation UpdateMediaAltText($productId: ID!, $media: [UpdateMediaInput!]!) {
        productUpdateMedia(productId: $productId, media: $media) {
          media {
            __typename
            ... on MediaImage {
              id
              image { altText }
            }
          }
          mediaUserErrors { field message }
          userErrors { field message }
        }
      }
    `;

    const variables = {
      productId,
      media: [
        {
          id: mediaId,
          alt: altText,
        },
      ],
    };

    const resp = await admin.graphql(mutation, { variables });
    const json = await resp.json();

    const payload = json?.data?.productUpdateMedia;
    const errors = [
      ...(payload?.mediaUserErrors || []),
      ...(payload?.userErrors || []),
      ...(json?.errors || []),
    ]
      .map((e) => e?.message || (typeof e === "string" ? e : null))
      .filter(Boolean);

    if (errors.length) {
      return jsonResponse({ ok: false, error: errors.join(" | ") }, 400);
    }

    const updated = (payload?.media || []).find((m) => String(m?.id || "") === mediaId);
    const updatedAlt = updated?.image?.altText ?? altText;

    return jsonResponse({ ok: true, mediaId, altText: String(updatedAlt || "") });
  }

  if (intent === "start_generate") {
    const rawProductIds = String(form.get("productIds") || "[]");
    const productIds = safeParse(rawProductIds, [])
      .map(String)
      .filter(Boolean);

    if (!productIds.length) {
      return jsonResponse({ ok: false, error: "No selected items" }, 400);
    }

    // P2-12: Free plan monthly limit (10 products / month)
    const reservation = await reserveIfFreePlan({
      shop: session.shop,
      productCount: productIds.length,
    });
    if (!reservation.ok) {
      return jsonResponse(
        {
          ok: false,
          code: reservation.code || "FREE_LIMIT_EXCEEDED",
          error: "Free plan limit exceeded",
          billing: {
            planKey: reservation.planKey,
            mode: reservation.mode,
            free: reservation.free,
            limit: BILLING_PLANS.FREE.monthlyProductLimit,
          },
        },
        402,
      );
    }

    const metaTitle = String(form.get("metaTitle") || "true") === "true";
    const metaDescription = String(form.get("metaDescription") || "true") === "true";

    const settingsJson = String(form.get("settingsJson") || "{}");
    const formSettings = safeParse(settingsJson, {});
    const storedSettings = await getSettingsFromMetafield(admin);
    const settings = storedSettings || formSettings || {};

    const language = sanitizeLanguage(settings?.language || form.get("language") || "tr");

    const titlesByIdJson = String(form.get("titlesByIdJson") || "{}");
    const titlesById = safeParse(titlesByIdJson, {});

    const job = await createGenerateJob({
      shop: session.shop,
      seed: {
        language,
        settings,
        fields: { metaTitle, metaDescription },
      },
      usageReserved: true,
      productIds,
      productTitlesById: titlesById,
    });

    await enqueueSeoJob(job.id);

    return jsonResponse({ ok: true, jobId: job.id });
  }

  if (intent === "start_generate_images") {
    // Pro-only: image ALT generation
    if (!billing.isPro) {
      return jsonResponse(
        {
          ok: false,
          code: "PRO_REQUIRED",
          error: "Image ALT text generation is available on Pro.",
          billing: {
            planKey: billing.planKey,
            mode: billing.mode,
            free: billing.free,
          },
        },
        402,
      );
    }
    const rawImagesJson = String(form.get("imagesJson") || "[]");
    const imagesRaw = safeParse(rawImagesJson, [])
      .map((x) => ({
        productId: x?.productId ? String(x.productId) : null,
        productTitle: x?.productTitle ? String(x.productTitle) : null,
        mediaId: x?.mediaId ? String(x.mediaId) : "",
        imageUrl: x?.imageUrl ? String(x.imageUrl) : null,
        currentAltText: x?.currentAltText ? String(x.currentAltText) : "",
      }))
      .filter((x) => Boolean(x.mediaId));

    // Defensive dedupe by mediaId to avoid unique constraint errors
    // (jobId, targetType, targetId) is unique for SeoJobItem
    const images = Array.from(
      new Map(imagesRaw.map((img) => [String(img.mediaId), img])).values(),
    );

    if (!images.length) {
      return jsonResponse({ ok: false, error: "No selected images" }, 400);
    }

    // Free plan monthly limit (we count images as units)
    const reservation = await reserveIfFreePlan({
      shop: session.shop,
      productCount: images.length,
    });
    if (!reservation.ok) {
      return jsonResponse(
        {
          ok: false,
          code: reservation.code || "FREE_LIMIT_EXCEEDED",
          error: "Free plan limit exceeded",
          billing: {
            planKey: reservation.planKey,
            mode: reservation.mode,
            free: reservation.free,
            limit: BILLING_PLANS.FREE.monthlyProductLimit,
          },
        },
        402,
      );
    }

    const settingsJson = String(form.get("settingsJson") || "{}");
    const formSettings = safeParse(settingsJson, {});
    const storedSettings = await getSettingsFromMetafield(admin);
    const settings = storedSettings || formSettings || {};

    const language = sanitizeLanguage(settings?.language || form.get("language") || "tr");

    const job = await createAltTextJob({
      shop: session.shop,
      seed: { language, settings },
      usageReserved: true,
      images,
    });

    await enqueueSeoJob(job.id);
    return jsonResponse({ ok: true, jobId: job.id });
  }

  
  if (intent === "start_generate_blog") {
    // Pro-only: blog articles generation
    if (!billing.isPro) {
      return jsonResponse(
        {
          ok: false,
          code: "PRO_REQUIRED",
          error: "Blog article generation is available on Pro.",
          billing: {
            planKey: billing.planKey,
            mode: billing.mode,
            free: billing.free,
          },
        },
        402,
      );
    }
    const rawArticleIds = String(form.get("articleIds") || "[]");
    const articleIds = safeParse(rawArticleIds, [])
      .map(String)
      .filter(Boolean);

    if (!articleIds.length) {
      return jsonResponse({ ok: false, error: "No selected articles" }, 400);
    }

    // Free plan monthly limit (count articles as units)
    const reservation = await reserveIfFreePlan({
      shop: session.shop,
      productCount: articleIds.length,
    });
    if (!reservation.ok) {
      return jsonResponse(
        {
          ok: false,
          code: reservation.code || "FREE_LIMIT_EXCEEDED",
          error: "Free plan limit exceeded",
          billing: {
            planKey: reservation.planKey,
            mode: reservation.mode,
            free: reservation.free,
            limit: BILLING_PLANS.FREE.monthlyProductLimit,
          },
        },
        402,
      );
    }

    const settingsJson = String(form.get("settingsJson") || "{}");
    const formSettings = safeParse(settingsJson, {});
    const storedSettings = await getSettingsFromMetafield(admin);
    const settings = storedSettings || formSettings || {};

    const language = sanitizeLanguage(settings?.language || form.get("language") || "tr");

    // Load titles for selected articles from the already fetched list if provided
    const rawTitles = String(form.get("titlesJson") || "{}");
    const titlesById = safeParse(rawTitles, {});

    const articles = articleIds.map((id) => ({
      articleId: id,
      title: titlesById?.[id] || null,
    }));

    const job = await createBlogMetaJob({
      shop: session.shop,
      seed: { language, settings },
      usageReserved: true,
      articles,
    });

    await enqueueSeoJob(job.id);
    return jsonResponse({ ok: true, jobId: job.id });
  }


return jsonResponse({ ok: false, error: "Unknown intent" }, 400);
};

/** ----------------------- UI helpers ----------------------- **/
function toStoreHandle(shopDomain) {
  if (!shopDomain) return "";
  return String(shopDomain).replace(/\.myshopify\.com$/i, "");
}
function gidToNumericId(gid) {
  const m = String(gid || "").match(/\/Product\/(\d+)$/);
  return m ? m[1] : "";
}
function productAdminUrl({ shopDomain, productGid }) {
  const handle = toStoreHandle(shopDomain);
  const id = gidToNumericId(productGid);
  if (!handle || !id) return "";
  return `https://admin.shopify.com/store/${handle}/products/${id}`;
}

function normalizeStatus(raw) {
  const s = String(raw || "").trim().toUpperCase();
  if (s === "AKTIF" || s === "AKTİF") return "ACTIVE";
  if (s === "TASLAK") return "DRAFT";
  if (s === "ARŞİVLENMİŞ" || s === "ARSIVLENMIS" || s === "ARŞIVLENMIŞ") return "ARCHIVED";
  return s;
}
function statusLabelTr(norm) {
  // NOTE: Kept the function name for compatibility, but UI labels are now English.
  if (norm === "ACTIVE") return "Active";
  if (norm === "DRAFT") return "Draft";
  if (norm === "ARCHIVED") return "Archived";
  return "—";
}
function truncate(value, max = 80) {
  if (value == null) return "";
  const s = String(value);
  if (s.length <= max) return s;
  const cut = Math.max(0, max - 1);
  return s.slice(0, cut).trimEnd() + "…";
}

function statusTone(norm) {
  if (norm === "ACTIVE") return "success";
  if (norm === "DRAFT") return "attention";
  if (norm === "ARCHIVED") return "subdued";
  return "subdued";
}


function truncateText(text, maxLen = 80) {
  const s = String(text || "");
  if (s.length <= maxLen) return s;
  return s.slice(0, Math.max(0, maxLen - 1)) + "…";
}

/** ----------------------- Component ----------------------- **/
export default function SeoTools() {
  const data = useLoaderData();
  const blogError = data?.blogError || null;
  const startGenFetcher = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Avoid URL-sync loops when hydrating state from loader (loader itself is driven by URL)
  const suppressUrlSyncRef = useRef(false);
  const productsUrlSyncTimerRef = useRef(null);
  const blogUrlSyncTimerRef = useRef(null);

  const shopDomain = useMemo(() => {
    try {
      return new URLSearchParams(location.search || "").get("shop") || "";
    } catch {
      return "";
    }
  }, [location.search]);

  // job oluşunca generation history list’e git
  useEffect(() => {
    if (startGenFetcher.state !== "idle") return;
    if (!startGenFetcher.data?.ok || !startGenFetcher.data?.jobId) return;

    const next = new URLSearchParams(location.search || "");
    navigate(`/app/generation-history?${next.toString()}`);
  }, [startGenFetcher.state, startGenFetcher.data, navigate, location.search]);

  const selectedTab = data.tab || "products";
  const tabs = useMemo(
    () => [
      { id: "products", content: "Products" },
      { id: "images", content: "Images" },
      { id: "articles", content: "Blog articles" },
    ],
    [],
  );

  const products = data.products || [];
  const collections = data.collections || [];
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products, { resourceIDResolver: (p) => p.id });

  // Images: products that have images (loaded from loader when tab === "images")
  const imageProducts = data.imageProducts || [];

  // Images: flatten product->images into a single list for IndexTable
  const imageRows = useMemo(() => {
    const rows = [];
    for (const p of imageProducts || []) {
      const productId = String(p?.id || "");
      const productTitle = String(p?.title || "");
      const productStatus = normalizeStatus(p?.status);
      for (const img of p?.images || []) {
        const mediaId = String(img?.mediaId || "");
        const url = String(img?.url || "");
        if (!mediaId || !url) continue;
        rows.push({
          mediaId,
          url,
          altText: String(img?.altText || ""),
          productId,
          productTitle,
          productStatus,
        });
      }
    }
    return rows;
  }, [imageProducts]);

  // Images: local overrides after quick edit (mediaId -> altText)
  const [imageAltOverrides, setImageAltOverrides] = useState({});


  // Images: Search/filters toggle (Shopify Admin style)
  const [imageFiltersMode, setImageFiltersMode] = useState(IndexFiltersMode.Default);
  const [imageQueryValue, setImageQueryValue] = useState(String(searchParams.get("img_q") || ""));
  const [imageAltTab, setImageAltTab] = useState(String(searchParams.get("img_alt") || "all"));
  const [imageStatusSelected, setImageStatusSelected] = useState(() => {
    const raw = String(searchParams.get("img_status") || "").trim();
    return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  });
  const imageSearchInputRef = useRef(null);

  // Images: preview modal
  const [imagePreviewRow, setImagePreviewRow] = useState(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [imageAltDraft, setImageAltDraft] = useState("");
  const [imageAltSaveError, setImageAltSaveError] = useState(null);
  const updateAltFetcher = useFetcher();

  // Apply server updates to local table + modal
  useEffect(() => {
    if (updateAltFetcher.state !== "idle") return;
    if (!updateAltFetcher.data) return;
    if (!updateAltFetcher.data.ok) {
      setImageAltSaveError(updateAltFetcher.data.error || "Failed to update ALT text");
      return;
    }

    const mediaId = String(updateAltFetcher.data.mediaId || "");
    const nextAlt = String(updateAltFetcher.data.altText || "");
    if (!mediaId) return;

    setImageAltOverrides((prev) => ({ ...prev, [mediaId]: nextAlt }));
    setImagePreviewRow((prev) => {
      if (!prev || String(prev.mediaId) !== mediaId) return prev;
      return { ...prev, altText: nextAlt };
    });
    setImageAltDraft(nextAlt);
    setImageAltSaveError(null);

    // UX: close modal automatically after successful save
    setIsImagePreviewOpen(false);
  }, [updateAltFetcher.state, updateAltFetcher.data]);
  const openImagePreview = useCallback((row) => {
    const r = row || null;
    setImagePreviewRow(r);
    const mediaId = r?.mediaId ? String(r.mediaId) : "";
    const effectiveAlt = mediaId && Object.prototype.hasOwnProperty.call(imageAltOverrides, mediaId)
      ? String(imageAltOverrides[mediaId] || "")
      : String(r?.altTextEffective ?? r?.altText ?? "");
    setImageAltDraft(effectiveAlt);
    setImageAltSaveError(null);
    setIsImagePreviewOpen(true);
  }, [imageAltOverrides]);
  const closeImagePreview = useCallback(() => {
    setIsImagePreviewOpen(false);
    // keep row for a moment in case modal animates; fine either way
  }, []);

  const imageTabs = useMemo(
    () => [
      { id: "all", content: "All" },
      { id: "empty", content: "ALT Empty" },
      { id: "filled", content: "ALT Filled" },
    ],
    [],
  );

  
  const onImageAltTabClick = useCallback(
    (key) => {
      setImageAltTab(key);
      const next = new URLSearchParams(searchParams);
      next.set("tab", "images");
      if (key && key !== "all") next.set("img_alt", key);
      else next.delete("img_alt");
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const onImageQueryChange = useCallback(
    (value) => {
      setImageQueryValue(value);
      const next = new URLSearchParams(searchParams);
      next.set("tab", "images");
      if (value) next.set("img_q", value);
      else next.delete("img_q");
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const onImageStatusChange = useCallback(
    (values) => {
      const arr = Array.isArray(values) ? values : [];
      setImageStatusSelected(arr);
      const next = new URLSearchParams(searchParams);
      next.set("tab", "images");
      if (arr.length) next.set("img_status", arr.join(","));
      else next.delete("img_status");
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const imageFilters = useMemo(() => {
    return [
      {
        key: "imgStatus",
        label: "Product status",
        filter: (
          <ChoiceList
            title="Product status"
            choices={[
              { label: "Active", value: "ACTIVE" },
              { label: "Draft", value: "DRAFT" },
              { label: "Archived", value: "ARCHIVED" },
            ]}
            selected={imageStatusSelected}
            allowMultiple
            onChange={onImageStatusChange}
          />
        ),
        shortcut: true,
      },
    ];
  }, [imageStatusSelected, onImageStatusChange]);

  const imageAppliedFilters = useMemo(() => {
    const out = [];
    if (Array.isArray(imageStatusSelected) && imageStatusSelected.length) {
      const labels = imageStatusSelected.map((v) => statusLabelTr(v));
      const preview = labels.slice(0, 2).join(", ");
      out.push({
        key: "imgStatus",
        label: `Product status: ${preview}${labels.length > 2 ? ` +${labels.length - 2}` : ""}`,
        onRemove: () => onImageStatusChange([]),
      });
    }
    return out;
  }, [imageStatusSelected, onImageStatusChange]);

const filteredImageRows = useMemo(() => {
    const q = String(imageQueryValue || "").trim().toLowerCase();
    const statuses = Array.isArray(imageStatusSelected) ? imageStatusSelected : [];
    const altTab = String(imageAltTab || "all");

    return (imageRows || [])
      .map((r) => {
        const mediaId = String(r.mediaId || "");
        const override = mediaId && Object.prototype.hasOwnProperty.call(imageAltOverrides, mediaId)
          ? String(imageAltOverrides[mediaId] || "")
          : null;
        return {
          ...r,
          altTextEffective: override !== null ? override : String(r.altText || ""),
        };
      })
      .filter((r) => {
      // Alt tab filter
      const hasAlt = Boolean(String(r.altTextEffective || "").trim());
      if (altTab === "empty" && hasAlt) return false;
      if (altTab === "filled" && !hasAlt) return false;

      // Status filter
      if (statuses.length && !statuses.includes(String(r.productStatus || ""))) return false;

      // Query filter (product title + alt text)
      if (!q) return true;
      const hay = String(r.productTitle || "").toLowerCase();
      return hay.includes(q);
    });
  }, [imageRows, imageQueryValue, imageAltTab, imageStatusSelected, imageAltOverrides]);

  const {
    selectedResources: selectedImageResources,
    allResourcesSelected: allImagesSelected,
    handleSelectionChange: handleImageSelectionChange,
  } = useIndexResourceState(filteredImageRows, {
    resourceIDResolver: (r) => r.mediaId,
  });
  // Blog articles: Search/filters toggle (Shopify Admin style)
  const [blogFiltersMode, setBlogFiltersMode] = useState(IndexFiltersMode.Default);
  const [blogSeoStatus, setBlogSeoStatus] = useState(String(searchParams.get("article_meta") || ""));
  const [blogSeoPopoverActive, setBlogSeoPopoverActive] = useState(false);
  const [blogQueryValue, setBlogQueryValue] = useState(String(searchParams.get("article_q") || ""));
  const [blogStatusTab, setBlogStatusTab] = useState(String(searchParams.get("article_status") || "all"));

  // Blog articles: Search panel filters
  const [blogNamesSelected, setBlogNamesSelected] = useState(() => {
    const raw = String(searchParams.get("article_blog") || "").trim();
    return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  });
  const [blogStatusSelected, setBlogStatusSelected] = useState("");

  const [blogPopoverActive, setBlogPopoverActive] = useState(false);
  const [blogStatusPopoverActive, setBlogStatusPopoverActive] = useState(false);
  const [blogAddFilterPopoverActive, setBlogAddFilterPopoverActive] = useState(false);
  const blogArticles = data.blogArticles || [];


  const blogNameChoices = useMemo(() => {
    const uniq = Array.from(
      new Set((blogArticles || []).map((a) => a?.blogTitle || a?.blog || a?.blogName).filter(Boolean))
    );
    return uniq.map((b) => ({ label: b, value: b }));
  }, [blogArticles]);
const filteredBlogArticles = useMemo(() => {
  const q = String(blogQueryValue || "").trim().toLowerCase();

  let base = (blogArticles || []).filter((a) => {
    // Status tab filter
    if (blogStatusTab === "published" && !a?.isPublished) return false;
    if (blogStatusTab === "unpublished" && a?.isPublished) return false;

    // Blog name multi-select filter
    if (Array.isArray(blogNamesSelected) && blogNamesSelected.length) {
      if (!blogNamesSelected.includes(String(a?.blogTitle || ""))) return false;
    }

    // Search query
    if (!q) return true;
    const hay = [a?.title, a?.blogTitle, a?.seoTitle, a?.seoDescription]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });

  const selected = String(blogSeoStatus || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (selected.length) {
    base = base.filter((a) => {
      const tt = String(a?.seoTitle || "").trim();
      const dd = String(a?.seoDescription || "").trim();
      const st = tt && dd ? "filled" : tt || dd ? "partial" : "empty";
      return selected.includes(st);
    });
  }

  return base;
}, [blogArticles, blogQueryValue, blogSeoStatus, blogStatusTab, blogNamesSelected]);


  // Client-side pagination (Blog articles)
  const blogPageSize = Math.max(1, Math.min(100, Number(searchParams.get("article_limit") || 25)));
  const blogPage = Math.max(1, Number(searchParams.get("article_page") || 1));
  const blogTotalPages = Math.max(1, Math.ceil((filteredBlogArticles?.length || 0) / blogPageSize));
  const pagedBlogArticles = useMemo(() => {
    const start = (blogPage - 1) * blogPageSize;
    return (filteredBlogArticles || []).slice(start, start + blogPageSize);
  }, [filteredBlogArticles, blogPage, blogPageSize]);

  const goBlogNextPage = useCallback(() => {
    if (blogPage >= blogTotalPages) return;
    const next = new URLSearchParams(searchParams);
    next.set("tab", "articles");
    next.set("article_page", String(blogPage + 1));
    setSearchParams(next);
  }, [blogPage, blogTotalPages, searchParams, setSearchParams]);

  const goBlogPrevPage = useCallback(() => {
    if (blogPage <= 1) return;
    const next = new URLSearchParams(searchParams);
    next.set("tab", "articles");
    next.set("article_page", String(blogPage - 1));
    setSearchParams(next);
  }, [blogPage, searchParams, setSearchParams]);

  const onBlogRowsPerPageChange = useCallback(
    (value) => {
      const next = new URLSearchParams(searchParams);
      next.set("tab", "articles");
      next.set("article_limit", String(value || 25));
      next.set("article_page", "1");
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );





  const {
    selectedResources: selectedBlogIds,
    allResourcesSelected: allBlogSelected,
    handleSelectionChange: handleBlogSelectionChange,
  } = useIndexResourceState(filteredBlogArticles, { resourceIDResolver: (a) => a.id });


  // NOTE: Images selection is managed by Polaris `useIndexResourceState`.
  // We intentionally don't hard-reset selection here to avoid relying on
  // a non-existent setter and to keep behavior consistent with Shopify Admin.

    const lang = sanitizeLanguage(data.lang || "tr");

  // P2-12: billing + monthly free limit context
  const billing = data.billing || {
    isPro: false,
    planKey: "FREE",
    free: { used: 0, remaining: BILLING_PLANS.FREE.monthlyProductLimit, limit: BILLING_PLANS.FREE.monthlyProductLimit, month: "" },
  };
  const free = billing.free || { used: 0, remaining: BILLING_PLANS.FREE.monthlyProductLimit, limit: BILLING_PLANS.FREE.monthlyProductLimit, month: "" };

  const initialFilters = data.filters || {};
  // Polaris expects IndexFiltersMode enum values.
  const [productsFiltersMode, setProductsFiltersMode] = useState(IndexFiltersMode.Default);

  const [queryValue, setQueryValue] = useState(initialFilters.queryValue || "");

  // Refs for in-page search inputs (used by Ctrl/Cmd+F shortcut)
  const productsSearchInputRef = useRef(null);
  const blogSearchInputRef = useRef(null);

  // Keyboard shortcuts: Ctrl/Cmd+F opens in-page search panel, Esc closes it
  useEffect(() => {
    const onKeyDown = (e) => {
      const key = String(e.key || "").toLowerCase();
      const isFind = (e.ctrlKey || e.metaKey) && key === "f";
      if (isFind) {
        // Don't steal browser find when user is selecting rows (matches Shopify behavior)
        if (selectedTab === "products" && selectedResources.length > 0) return;

        e.preventDefault();
        if (selectedTab === "articles") {
          setBlogFiltersMode(IndexFiltersMode.Filtering);
        } else if (selectedTab === "products") {
          setProductsFiltersMode(IndexFiltersMode.Filtering);
        }
        return;
      }

      if (key === "escape") {
        if (productsFiltersMode === IndexFiltersMode.Filtering) setProductsFiltersMode(IndexFiltersMode.Default);
        if (blogFiltersMode === IndexFiltersMode.Filtering) setBlogFiltersMode(IndexFiltersMode.Default);
      }
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [selectedTab, selectedResources.length, productsFiltersMode, blogFiltersMode]);

  // Focus search inputs when panels open
  useEffect(() => {
    if (productsFiltersMode === IndexFiltersMode.Filtering) {
      setTimeout(() => productsSearchInputRef.current?.focus?.(), 0);
    }
  }, [productsFiltersMode]);

  // Blog: focus search input when panel opens
  useEffect(() => {
    if (blogFiltersMode === IndexFiltersMode.Filtering) {
      setTimeout(() => blogSearchInputRef.current?.focus?.(), 0);
    }
  }, [blogFiltersMode]);

  // Products: Search panel filters (Shopify-admin-like)
  const [productVendorsSelected, setProductVendorsSelected] = useState(
    Array.isArray(initialFilters.productVendorsSelected) ? initialFilters.productVendorsSelected : []
  );
  const [productStatusSelected, setProductStatusSelected] = useState(
    typeof initialFilters.productStatusSelected === "string" ? initialFilters.productStatusSelected : ""
  );
  const [productExtraFilters, setProductExtraFilters] = useState(
    Array.isArray(initialFilters.productExtraFilters) ? initialFilters.productExtraFilters : []
  );

  const [vendorPopoverActive, setVendorPopoverActive] = useState(false);
  const [tagPopoverActive, setTagPopoverActive] = useState(false);
  const [categoryPopoverActive, setCategoryPopoverActive] = useState(false);
  const [collectionPopoverActive, setCollectionPopoverActive] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [collectionSearch, setCollectionSearch] = useState("");
  const [seoPopoverActive, setSeoPopoverActive] = useState(false);
  const [statusPopoverActive, setStatusPopoverActive] = useState(false);
  const [addFilterPopoverActive, setAddFilterPopoverActive] = useState(false);

  const productVendorChoices = useMemo(() => [], [products]);

  const tagOptions = useMemo(() => {
    const s = new Set();
    for (const p of products) {
      for (const t of p?.tags || []) s.add(t);
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const categoryOptions = useMemo(() => {
    const s = new Set();
    for (const p of products) {
      if (p?.productType) s.add(p.productType);
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const collectionOptions = useMemo(() => {
    return (collections || []).map((c) => c.title).filter(Boolean).sort((a, b) => a.localeCompare(b));
  }, [collections]);



  const [statusTab, setStatusTab] = useState(initialFilters.statusTab || "all");
  const [tag, setTag] = useState(initialFilters.tag || "");
  const [category, setCategory] = useState(initialFilters.category || "");
  const [collection, setCollection] = useState(initialFilters.collection || "");

  const selectedTags = useMemo(
    () =>
      String(tag || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [tag]
  );
  const selectedCategories = useMemo(
    () =>
      String(category || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [category]
  );
  const selectedCollections = useMemo(
    () =>
      String(collection || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [collection]
  );

  const [meta, setMeta] = useState(initialFilters.meta || "");
  const selectedSeoStatuses = useMemo(
    () =>
      String(meta || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [meta]
  );


  const filteredProducts = useMemo(() => {
  // Products are already filtered server-side via Shopify query (q/status/tag/category/collection).
  // Here we only apply the SEO status filter (client-side).
  const selected = selectedSeoStatuses;
  if (!selected.length) return products || [];
  return (products || []).filter((p) => {
    const seoTitle = String(p?.seo?.title || "").trim();
    const seoDesc = String(p?.seo?.description || "").trim();
    const productDesc = String(p?.description || "").trim();
    const st = seoTitle && seoDesc ? "filled" : (seoTitle || seoDesc ? "partial" : "empty");
    return selected.includes(st);
  });
}, [products, selectedSeoStatuses]);




  const [genTitle, setGenTitle] = useState(true);
  const [genDescription, setGenDescription] = useState(true);

  const [blogGenTitle, setBlogGenTitle] = useState(true);
  const [blogGenDescription, setBlogGenDescription] = useState(true);
  const [productsGenModalOpen, setProductsGenModalOpen] = useState(false);
  const [blogGenModalOpen, setBlogGenModalOpen] = useState(false);


  useEffect(() => {
    suppressUrlSyncRef.current = true;
    setQueryValue(initialFilters.queryValue || "");
    setStatusTab(initialFilters.statusTab || "all");
    setTag(initialFilters.tag || "");
    setCategory(initialFilters.category || "");
    setCollection(initialFilters.collection || "");
    setMeta(initialFilters.meta || "");
    // Release suppression on next tick so user actions still sync to URL
    setTimeout(() => {
      suppressUrlSyncRef.current = false;
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data.filters?.queryValue,
    data.filters?.statusTab,
    data.filters?.tag,
    data.filters?.category,
    data.filters?.collection,
    data.filters?.meta,
  ]);

  const setTabById = useCallback(
    (tabId) => {
      const next = String(tabId || "");
      if (!next) return;
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("tab", next);
      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams],
  );

  const applyFiltersToUrl = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", selectedTab);
    nextParams.set("q", queryValue || "");
    nextParams.set("status", statusTab || "all");
    nextParams.set("tag", tag || "");
    nextParams.set("category", category || "");
    nextParams.set("collection", collection || "");
    nextParams.set("meta", meta || "");
    // Reset product cursor pagination when filters change
    nextParams.delete("after");
    nextParams.delete("before");
    nextParams.set("page", "1");

    nextParams.set("lang", lang || "tr");
    setSearchParams(nextParams);
  }, [
    searchParams,
    setSearchParams,
    selectedTab,
    queryValue,
    statusTab,
    tag,
    category,
    collection,
    meta,
    lang,
  ]);


  // Cursor pagination (Products)
  const goProductsNextPage = useCallback(() => {
    const pageInfo = data?.productsPageInfo;
    if (!pageInfo?.endCursor) return;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", "products");
    nextParams.set("limit", String(data?.productsPageSize || 25));
    nextParams.set("after", pageInfo.endCursor);
    nextParams.delete("before");
    const curPage = Math.max(1, Number(searchParams.get("page") || 1));
    nextParams.set("page", String(curPage + 1));
    setSearchParams(nextParams);
  }, [data?.productsPageInfo, data?.productsPageSize, searchParams, setSearchParams]);

  const goProductsPrevPage = useCallback(() => {
    const pageInfo = data?.productsPageInfo;
    if (!pageInfo?.startCursor) return;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", "products");
    nextParams.set("limit", String(data?.productsPageSize || 25));
    nextParams.set("before", pageInfo.startCursor);
    nextParams.delete("after");
    const curPage = Math.max(1, Number(searchParams.get("page") || 1));
    nextParams.set("page", String(Math.max(1, curPage - 1)));
    setSearchParams(nextParams);
  }, [data?.productsPageInfo, data?.productsPageSize, searchParams, setSearchParams]);

  const onProductsRowsPerPageChange = useCallback(
    (value) => {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("tab", "products");
      nextParams.set("limit", String(value || 25));
      // Reset cursor pagination when page size changes
      nextParams.delete("after");
      nextParams.delete("before");
      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams],
  );

  /**
   * Debounced URL sync (Products)
   * - Keeps search/filter state stable on refresh/back-forward
   * - Avoids loader refetch on every keystroke by debouncing updates
   */
  useEffect(() => {
    if (suppressUrlSyncRef.current) return;
    if (selectedTab !== "products") return;

    if (productsUrlSyncTimerRef.current) clearTimeout(productsUrlSyncTimerRef.current);

    productsUrlSyncTimerRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      next.set("tab", "products");
      next.set("q", queryValue || "");
      next.set("status", statusTab || "all");
      next.set("tag", tag || "");
      next.set("category", category || "");
      next.set("collection", collection || "");
      next.set("meta", meta || "");

      // Reset cursor pagination only when filters/search/limit changed (not on page navigation)
      const prevQ = searchParams.get("q") || "";
      const prevStatus = searchParams.get("status") || "all";
      const prevTag = searchParams.get("tag") || "";
      const prevCategory = searchParams.get("category") || "";
      const prevCollection = searchParams.get("collection") || "";
      const prevMeta = searchParams.get("meta") || "";
      const prevLimit = String(searchParams.get("limit") || 25);
      const nextLimit = String(data?.productsPageSize || Number(searchParams.get("limit") || 25));

      const shouldResetPagination =
        prevQ !== (queryValue || "") ||
        prevStatus !== (statusTab || "all") ||
        prevTag !== (tag || "") ||
        prevCategory !== (category || "") ||
        prevCollection !== (collection || "") ||
        prevMeta !== (meta || "") ||
        prevLimit !== nextLimit;

      if (shouldResetPagination) {
        next.delete("after");
        next.delete("before");
        next.set("page", "1");
      }

      next.set("limit", nextLimit);
      next.set("lang", lang || "tr");
      setSearchParams(next, { replace: true });
    }, 350);

    return () => {
      if (productsUrlSyncTimerRef.current) clearTimeout(productsUrlSyncTimerRef.current);
    };
  }, [
    selectedTab,
    queryValue,
    statusTab,
    tag,
    category,
    collection,
    meta,
    lang,
    data?.productsPageSize,
    searchParams,
    setSearchParams,
  ]);

  /**
   * Debounced URL sync (Blog articles)
   * Blog list is client-filtered, but we keep filters in URL for persistence and back/forward.
   */
  useEffect(() => {
    if (suppressUrlSyncRef.current) return;
    if (selectedTab !== "articles") return;

    if (blogUrlSyncTimerRef.current) clearTimeout(blogUrlSyncTimerRef.current);
    blogUrlSyncTimerRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      next.set("tab", "articles");
      next.set("article_q", blogQueryValue || "");
      next.set("article_status", blogStatusTab || "all");
      next.set("article_blog", Array.isArray(blogNamesSelected) ? blogNamesSelected.join(",") : "");
      next.set("article_meta", blogSeoStatus || "");
      next.set("article_limit", String(blogPageSize || 25));
      next.set("article_page", "1");
      next.set("lang", lang || "tr");
      setSearchParams(next, { replace: true });
    }, 350);

    return () => {
      if (blogUrlSyncTimerRef.current) clearTimeout(blogUrlSyncTimerRef.current);
    };
  }, [
    selectedTab,
    blogQueryValue,
    blogStatusTab,
    blogNamesSelected,
    blogSeoStatus,
    blogPageSize,
    lang,
    searchParams,
    setSearchParams,
  ]);

  const clearAllFilters = useCallback(() => {
    setQueryValue("");
    setTag("");
    setCategory("");
    setCollection("");
    setMeta("");
  }, []);

  const selectedCount = selectedResources.length;
  const hasSelection = selectedCount > 0;

  const selectedImageCount = selectedImageResources.length;
  const hasImageSelection = selectedImageCount > 0;

  const freeRemaining = Number(free.remaining ?? BILLING_PLANS.FREE.monthlyProductLimit);
  const exceedsFreeLimit = !billing.isPro && selectedCount > 0 && selectedCount > freeRemaining;

  const billingUrl = useMemo(() => {
    const qs = new URLSearchParams(location.search || "");
    return `/app/billing?${qs.toString()}`;
  }, [location.search]);

  const genError = startGenFetcher.data?.ok === false ? startGenFetcher.data : null;

  
  const bulkGenerate = useCallback(() => {
    if (!genTitle && !genDescription) return;
    if (exceedsFreeLimit) return;

    const selected = (products || []).filter((p) => (selectedResources || []).includes(p.id));
    const ids = selected.map((p) => String(p.id));

    const titlesById = {};
    for (const p of selected) titlesById[String(p.id)] = p.title || "";

    const settings = {
      fields: { metaTitle: genTitle, metaDescription: genDescription },
      productFilter: queryValue,
      filters: { statusTab, tag, category, collection, meta },
      tab: "products",
    };

    startGenFetcher.submit(
      {
        intent: "start_generate",
        productIds: JSON.stringify(ids),
        language: lang,
        metaTitle: String(genTitle),
        metaDescription: String(genDescription),
        settingsJson: JSON.stringify(settings),
        titlesByIdJson: JSON.stringify(titlesById),
      },
      { method: "post" },
    );
  }, [
    genTitle,
    genDescription,
    products,
    selectedResources,
    startGenFetcher,
    queryValue,
    statusTab,
    tag,
    category,
    collection,
    meta,
    lang,
    exceedsFreeLimit,
  ]);

const bulkGenerateBlog = useCallback(() => {
  if (!billing.isPro) return;
  if (!blogGenTitle && !blogGenDescription) return;

  const titlesById = Object.fromEntries((blogArticles || []).map((a) => [a.id, a.title]));
  startGenFetcher.submit(
    {
      intent: "start_generate_blog",
      articleIds: JSON.stringify(selectedBlogIds),
      titlesJson: JSON.stringify(titlesById),
      language: lang,
      settingsJson: JSON.stringify(data.settings || {}),
      // optional flags (worker may ignore)
      genTitle: blogGenTitle ? "1" : "0",
      genDescription: blogGenDescription ? "1" : "0",
    },
    { method: "post" },
  );
}, [billing.isPro, blogGenTitle, blogGenDescription, blogArticles, selectedBlogIds, startGenFetcher, lang, data.settings]);

  const productsPromotedBulkActions = useMemo(() => {
    const disabled = !hasSelection || (!genTitle && !genDescription) || exceedsFreeLimit || (!billing.isPro && freeRemaining <= 0);
    return [
      {
        content: "Generate",
        onAction: () => setProductsGenModalOpen(true),
        disabled,
      },
    ];
  }, [hasSelection, genTitle, genDescription, exceedsFreeLimit, billing.isPro, freeRemaining]);

  const blogHasSelection = selectedBlogIds.length > 0;
  const blogPromotedBulkActions = useMemo(() => {
    const disabled = !billing.isPro || !blogHasSelection || (!blogGenTitle && !blogGenDescription);
    return [
      {
        content: "Generate",
        onAction: () => setBlogGenModalOpen(true),
        disabled,
      },
    ];
  }, [billing.isPro, blogHasSelection, blogGenTitle, blogGenDescription]);




  const bulkGenerateImages = useCallback(() => {
    if (!billing.isPro) return;
    if (!selectedImageResources || selectedImageResources.length === 0) return;

    // Build selected images payload with product context
    const selectedSet = new Set(selectedImageResources.map(String));
    const selected = (filteredImageRows || [])
      .filter((r) => selectedSet.has(String(r.mediaId)))
      .map((r) => ({
        productId: r.productId,
        productTitle: r.productTitle || "",
        mediaId: r.mediaId,
        imageUrl: r.url || "",
        currentAltText: r.altText || "",
      }));

    startGenFetcher.submit(
      {
        intent: "start_generate_images",
        imagesJson: JSON.stringify(selected),
        language: lang,
        settingsJson: JSON.stringify({ tab: "images" }),
      },
      { method: "post" },
    );
  }, [billing.isPro, selectedImageResources, filteredImageRows, startGenFetcher, lang]);

  const statusTabs = useMemo(
    () => [
      { key: "all", label: "All" },
      { key: "active", label: "Active" },
      { key: "draft", label: "Draft" },
      { key: "archived", label: "Archived" },
    ],
    [],
  );

  const rowsPerPageOptions = useMemo(
    () => [
      { label: "25", value: "25" },
      { label: "50", value: "50" },
      { label: "100", value: "100" },
    ],
    [],
  );

  const filters = useMemo(() => {
    return [
      {
        key: "tag",
        label: "Tag",
        filter: (
          <TextField
            label="Tag"
            value={tag}
            onChange={setTag}
            autoComplete="off"
            placeholder="e.g. winter"
          />
        ),
        shortcut: true,
      },
      {
        key: "category",
        label: "Category",
        filter: (
          <TextField
            label="Category"
            value={category}
            onChange={setCategory}
            autoComplete="off"
            placeholder="e.g. Snowboard"
          />
        ),
        shortcut: true,
      },
      {
        key: "collection",
        label: "Collection",
        filter: (
          <TextField
            label="Collection"
            value={collection}
            onChange={setCollection}
            autoComplete="off"
            placeholder="e.g. Winter"
          />
        ),
        shortcut: true,
      },
      {
        key: "meta",
        label: "SEO status",
        filter: (
          <ChoiceList
            title="SEO status"
            choices={[
              { label: "Filled", value: "filled" },
              { label: "Partial", value: "partial" },
              { label: "Empty", value: "empty" },
            ]}
            selected={meta ? String(meta).split(",").filter(Boolean) : []}
            allowMultiple
            onChange={(values) => setMeta(Array.isArray(values) ? values.join(",") : "")}
          />
        ),
        shortcut: true,
      },
    ];
  }, [tag, category, collection, meta]);

  const appliedFilters = useMemo(() => {
    const out = [];

    const fmtMulti = (label, valuesRaw) => {
      const values = String(valuesRaw || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (!values.length) return null;
      if (values.length === 1) return `${label}: ${values[0]}`;
      const preview = values.slice(0, 2).join(", ");
      return `${label}: ${preview}${values.length > 2 ? ` +${values.length - 2}` : ""}`;
    };

    const tagLabel = fmtMulti("Tag", tag);
    if (tagLabel) out.push({ key: "tag", label: tagLabel, onRemove: () => setTag("") });

    const catLabel = fmtMulti("Category", category);
    if (catLabel) out.push({ key: "category", label: catLabel, onRemove: () => setCategory("") });

    const colLabel = fmtMulti("Collection", collection);
    if (colLabel) out.push({ key: "collection", label: colLabel, onRemove: () => setCollection("") });

    if (meta) {
      const metaValues = String(meta)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((v) => (v === "filled" ? "Filled" : v === "partial" ? "Partial" : v === "empty" ? "Empty" : v));

      const metaLabel = metaValues.length === 1
        ? `SEO status: ${metaValues[0]}`
        : `SEO status: ${metaValues.slice(0, 2).join(", ")}${metaValues.length > 2 ? ` +${metaValues.length - 2}` : ""}`;

      out.push({ key: "meta", label: metaLabel, onRemove: () => setMeta("") });
    }
    return out;
  }, [tag, category, collection, meta]);


  const blogTabs = useMemo(
    () => [
      { id: "all", content: "All" },
      { id: "published", content: "Published" },
      { id: "unpublished", content: "Draft" },
    ],
    [],
  );

  const blogFilters = useMemo(() => {
    return [
      {
        key: "blog",
        label: "Blog",
        filter: (
          <ChoiceList
            title="Blog"
            choices={blogNameChoices.map((c) => ({ label: c.label, value: c.value }))}
            selected={blogNamesSelected}
            allowMultiple
            onChange={setBlogNamesSelected}
          />
        ),
        shortcut: true,
      },
      {
        key: "blogSeoStatus",
        label: "SEO status",
        filter: (
          <ChoiceList
            title="SEO status"
            choices={[
              { label: "Filled", value: "filled" },
              { label: "Partial", value: "partial" },
              { label: "Empty", value: "empty" },
            ]}
            selected={blogSeoStatus ? String(blogSeoStatus).split(",").filter(Boolean) : []}
            allowMultiple
            onChange={(values) => setBlogSeoStatus(values.join(","))}
          />
        ),
        shortcut: true,
      },
    ];
  }, [blogNameChoices, blogNamesSelected, blogSeoStatus]);

  const blogAppliedFilters = useMemo(() => {
    const out = [];
    if (Array.isArray(blogNamesSelected) && blogNamesSelected.length) {
      const preview = blogNamesSelected.slice(0, 2).join(", ");
      out.push({
        key: "blogNames",
        label: `Blog: ${preview}${blogNamesSelected.length > 2 ? ` +${blogNamesSelected.length - 2}` : ""}`,
        onRemove: () => setBlogNamesSelected([]),
      });
    }
    if (blogSeoStatus) {
      const values = String(blogSeoStatus).split(",").map((s) => s.trim()).filter(Boolean);
      const labels = values.map((v) => (v === "filled" ? "Filled" : v === "partial" ? "Partial" : v === "empty" ? "Empty" : v));
      const preview = labels.slice(0, 2).join(", ");
      out.push({
        key: "blogSeoStatus",
        label: `SEO status: ${preview}${labels.length > 2 ? ` +${labels.length - 2}` : ""}`,
        onRemove: () => setBlogSeoStatus(""),
      });
    }
    return out;
  }, [blogNamesSelected, blogSeoStatus]);

  const onStatusTabClick = useCallback(
    (key) => {
      setStatusTab(key);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("status", key);
      nextParams.set("tab", selectedTab);
      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams, selectedTab],
  );


  const onBlogStatusTabClick = useCallback(
    (key) => {
      setBlogStatusTab(key);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("article_status", key);
      nextParams.set("tab", selectedTab);
      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams, selectedTab],
  );

  const rowMarkup = filteredProducts.map((p, index) => {
    const adminUrl = productAdminUrl({ shopDomain, productGid: p.id });
    const imageUrl = p.featuredImage?.url || "";
    const imageAlt = p.featuredImage?.altText || p.title || "Product image";

    const norm = normalizeStatus(p.status);
    const label = statusLabelTr(norm);
    const tone = statusTone(norm);

    const seoTitle = String(p?.seo?.title || "").trim();
    const seoDesc = String(p?.seo?.description || "").trim();
    const productDesc = String(p?.description || "").trim();
    const seoStatus = seoTitle && seoDesc ? "filled" : (seoTitle || seoDesc ? "partial" : "empty");
    const seoLabel = seoStatus === "filled" ? "Filled" : seoStatus === "partial" ? "Missing" : "Empty";
    const seoTone = seoStatus === "filled" ? "success" : seoStatus === "partial" ? "warning" : "subdued";

    return (
      <IndexTable.Row
        id={p.id}
        key={p.id}
        position={index}
        selected={selectedResources.includes(p.id)}
      >
        <IndexTable.Cell>
          <InlineStack gap="300" blockAlign="center" wrap={false}>
            <Thumbnail source={imageUrl || undefined} alt={imageAlt} size="small" />
            <BlockStack gap="050">
              {adminUrl ? (
                <a href={adminUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <Text as="span" variant="bodyMd" fontWeight="semibold" tone="link">
                    {p.title}
                  </Text>
                </a>
              ) : (
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  {p.title}
                </Text>
              )}
              {productDesc ? (
                <div
                  style={{
                    maxWidth: 420,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Text as="span" variant="bodySm" tone="subdued">
                    {productDesc}
                  </Text>
                </div>
              ) : null}
            </BlockStack>
          </InlineStack>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Badge tone={tone}>{label}</Badge>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Badge tone={seoTone}>{seoLabel}</Badge>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <div
            style={{
              maxWidth: 280,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            <Text as="span" variant="bodySm" tone={seoTitle ? undefined : "subdued"}>
              {seoTitle ? seoTitle : "—"}
            </Text>
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div
            style={{
              maxWidth: 340,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            <Text as="span" variant="bodySm" tone={seoDesc ? undefined : "subdued"}>
              {seoDesc ? seoDesc : "—"}
            </Text>
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  return (
    <Page title="SEO Tools" fullWidth>
      <BlockStack gap="400">
{/* Top navigation (table-independent) */}
        <InlineStack align="end">
          <InlineStack gap="100">
            {tabs.map((t) => (
              <Button
                key={t.id}
                variant="tertiary"
                pressed={selectedTab === t.id}
                onClick={() => setTabById(t.id)}
              >
                {t.content}
              </Button>
            ))}
          </InlineStack>
        </InlineStack>

        {genError ? (
          <Banner tone="critical" title="Generate failed">
            <Text as="p" variant="bodyMd">
              {genError.code === "FREE_LIMIT_EXCEEDED"
                ? `Free plan limit exceeded. Remaining this month: ${genError.billing?.free?.remaining ?? free.remaining}.`
                : genError.error || "Unknown error"}
            </Text>
          </Banner>
        ) : null}

        {exceedsFreeLimit ? (
          <Banner tone="warning" title="Selection exceeds your free plan limit">
            <Text as="p" variant="bodyMd">
              You selected {selectedCount} products but you only have {freeRemaining} remaining this month. Reduce selection or upgrade.
            </Text>
          </Banner>
        ) : null}

      {/* Keep bulk-action bar background consistent (Shopify Admin-like) */}
      <style>{`
        .seoToolsProductsTable :is(.Polaris-IndexTable__BulkActions, .Polaris-IndexTable__BulkActionsWrapper, [class*="IndexTable__BulkActions"]) {
          background: var(--p-color-bg-surface-secondary) !important;
        }
        .seoToolsBlogTable :is(.Polaris-IndexTable__BulkActions, .Polaris-IndexTable__BulkActionsWrapper, [class*="IndexTable__BulkActions"]) {
          background: var(--p-color-bg-surface-secondary) !important;
        }

        /* Our pages already render the status tabs row. When using IndexFilters for the search panel,
           hide its internal tabs row (otherwise it can render a blank/duplicate bar in some Polaris versions). */
        .seoToolsFiltersPanel :is(.Polaris-IndexFilters__TabsWrapper, .Polaris-IndexFilters__Tabs, [class*="IndexFilters__Tabs"]) {
          display: none !important;
        }

        /* Shopify-like compact Search/Filter activator (used on the right side of status tabs row)
           We mimic Shopify Admin's small pill: no outer box, subtle background, divider between icons. */
        .seoToolsSearchButton {
          border-radius: 999px;
        }
        .seoToolsSearchButton:focus-visible {
          outline: none;
        }
        .seoToolsSearchActivator {
          display: inline-flex;
          align-items: center;
          padding: 4px 6px;
          border-radius: 999px;
          border: 1px solid var(--p-color-border);
          background: var(--p-color-bg-surface-secondary);
          box-shadow: none;
        }
        .seoToolsSearchActivator:hover {
          background: var(--p-color-bg-surface-secondary-hover);
        }
        .seoToolsSearchActivator:active {
          background: var(--p-color-bg-surface-secondary-active);
        }
        .seoToolsSearchActivatorPart {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px 6px;
        }
        .seoToolsSearchActivatorPart + .seoToolsSearchActivatorPart {
          border-left: 1px solid var(--p-color-border);
        }
      `}</style>

        <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              {selectedTab === "products" ? (
                <>
                  {/* Products: status tabs (left) + search button (right) */}
                  <InlineStack align="space-between" blockAlign="center">
                    <ButtonGroup>
                      {statusTabs.map((t) => (
                        <Button
                          key={t.key}
                          variant="tertiary"
                          pressed={statusTab === t.key}
                          onClick={() => onStatusTabClick(t.key)}
                        >
                          {t.label}
                        </Button>
                      ))}
                    </ButtonGroup>

                    {/* Shopify Admin look: segmented Search + Filter buttons */}
                    <ButtonGroup segmented>
                      <Button
                        icon={SearchIcon}
                        accessibilityLabel="Search"
                        onClick={() => {
                          setProductsFiltersMode(IndexFiltersMode.Filtering);
                          // focus the query input as soon as the panel is visible
                          requestAnimationFrame(() => productsSearchInputRef.current?.focus?.());
                        }}
                      />
                      <Button
                        icon={FilterIcon}
                        accessibilityLabel="Filters"
                        onClick={() => setProductsFiltersMode(IndexFiltersMode.Filtering)}
                      />
                    </ButtonGroup>
                  </InlineStack>

                  {/* Products filters (Polaris IndexFilters) */}
                  {selectedTab === "products" && productsFiltersMode === IndexFiltersMode.Filtering ? (
                    <div className="seoToolsFiltersPanel">
                      <IndexFilters
                        tabs={[]}
                        selected={0}
                        onSelect={() => {}}
                        mode={productsFiltersMode}
                        setMode={setProductsFiltersMode}
                        queryValue={queryValue}
                        queryPlaceholder="Search across all products"
                        onQueryChange={(value) => setQueryValue(value)}
                        onQueryClear={() => setQueryValue("")}
                        queryField={
                          <TextField
                            value={queryValue}
                            onChange={setQueryValue}
                            placeholder="Search across all products"
                            prefix={<Icon source={SearchIcon} />}
                            autoComplete="off"
                            inputRef={productsSearchInputRef}
                          />
                        }
                        filters={[
                          {
                            key: "tag",
                            label: "Tag",
                            filter: (
                              <ChoiceList
                                title="Tag"
                                allowMultiple
                                choices={tagOptions.map((t) => ({ label: t, value: t }))}
                                selected={selectedTags}
                                onChange={(sel) => setTag((sel || []).join(","))}
                              />
                            ),
                            shortcut: true,
                          },
                          {
                            key: "category",
                            label: "Category",
                            filter: (
                              <ChoiceList
                                title="Category"
                                allowMultiple
                                choices={categoryOptions.map((t) => ({ label: t, value: t }))}
                                selected={selectedCategories}
                                onChange={(sel) => setCategory((sel || []).join(","))}
                              />
                            ),
                          },
                          {
                            key: "collection",
                            label: "Collection",
                            filter: (
                              <ChoiceList
                                title="Collection"
                                allowMultiple
                                choices={collectionOptions.map((t) => ({ label: t, value: t }))}
                                selected={selectedCollections}
                                onChange={(sel) => setCollection((sel || []).join(","))}
                              />
                            ),
                          },
                          {
                            key: "meta",
                            label: "SEO status",
                            filter: (
                              <ChoiceList
                                title="SEO status"
                                allowMultiple
                                choices={[
                                  { label: "Filled", value: "filled" },
                                  { label: "Missing", value: "partial" },
                                  { label: "Empty", value: "empty" },
                                ]}
                                selected={selectedSeoStatuses}
                                onChange={(sel) => setMeta((sel || []).join(","))}
                              />
                            ),
                          },
                        ]}
                        appliedFilters={[
                          ...(selectedTags.length
                            ? [
                                {
                                  key: "tag",
                                  label: `Tag: ${selectedTags.join(", ")}`,
                                  onRemove: () => setTag(""),
                                },
                              ]
                            : []),
                          ...(selectedCategories.length
                            ? [
                                {
                                  key: "category",
                                  label: `Category: ${selectedCategories.join(", ")}`,
                                  onRemove: () => setCategory(""),
                                },
                              ]
                            : []),
                          ...(selectedCollections.length
                            ? [
                                {
                                  key: "collection",
                                  label: `Collection: ${selectedCollections.join(", ")}`,
                                  onRemove: () => setCollection(""),
                                },
                              ]
                            : []),
                          ...(selectedSeoStatuses.length
                            ? [
                                {
                                  key: "meta",
                                  label: `SEO status: ${selectedSeoStatuses
                                    .map((s) =>
                                      s === "filled" ? "Filled" : s === "partial" ? "Missing" : "Empty",
                                    )
                                    .join(", ")}`,
                                  onRemove: () => setMeta(""),
                                },
                              ]
                            : []),
                        ]}
                        onClearAll={() => {
                          clearAllFilters();
                          setProductsFiltersMode(IndexFiltersMode.Default);
                        }}
                        cancelAction={{
                          onAction: () => setProductsFiltersMode(IndexFiltersMode.Default),
                          disabled: false,
                          loading: false,
                        }}
                      />
                    </div>
                  ) : null}

                  <Modal
                    open={productsGenModalOpen}
                    onClose={() => setProductsGenModalOpen(false)}
                    title="Generate"
                    primaryAction={{
                      content: "Generate",
                      onAction: () => {
                        setProductsGenModalOpen(false);
                        bulkGenerate();
                      },
                      disabled:
                        (!genTitle && !genDescription) ||
                        exceedsFreeLimit ||
                        (!billing.isPro && freeRemaining <= 0),
                      loading: startGenFetcher.state === "submitting",
                    }}
                    secondaryActions={[
                      { content: "Cancel", onAction: () => setProductsGenModalOpen(false) },
                    ]}
                  >
                    <Modal.Section>
                      <BlockStack gap="300">
                        <Text as="p" variant="bodyMd">
                          Which fields should be generated for the selected products?
                        </Text>
                        <InlineStack gap="400">
                          <Checkbox label="Title" checked={genTitle} onChange={setGenTitle} />
                          <Checkbox label="Description" checked={genDescription} onChange={setGenDescription} />
                        </InlineStack>
                      </BlockStack>
                    </Modal.Section>
                  </Modal>

                  <div className="seoToolsProductsTable" style={{ marginLeft: "calc(var(--p-space-400) * -1)", marginRight: "calc(var(--p-space-400) * -1)" }}>


                    <IndexTable
                      resourceName={{ singular: "product", plural: "products" }}
                      itemCount={filteredProducts.length}
                      selectable
                      selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
                      onSelectionChange={handleSelectionChange}
                      promotedBulkActions={productsPromotedBulkActions}
                      headings={[
                      { title: "Product" },
                      { title: "Status" },
                      { title: "SEO status" },
                      { title: "Meta title" },
                      { title: "Meta description" },
                    ]}
                    >
                    {rowMarkup}
                  </IndexTable>

                    {data?.productsPageInfo ? (
                      <div style={{ padding: "var(--p-space-300) var(--p-space-400)" }}>
                        <InlineStack align="space-between" blockAlign="center" gap="400">
                          <Text as="span" variant="bodySm" tone="subdued">
                            {(() => {
                              const total = Number(data?.productsTotalCount || 0);
                              const limit = Number(data?.productsPageSize || 25);
                              const page = Math.max(1, Number(searchParams.get("page") || 1));
                              const start = total === 0 ? 0 : (page - 1) * limit + 1;
                              const end = total === 0 ? 0 : Math.min(page * limit, total);
                              return `${start}–${end} / ${total}`;
                            })()}
                          </Text>

                          <InlineStack gap="300" blockAlign="center">
                            <InlineStack gap="200" blockAlign="center">
                              <Text as="span" variant="bodySm" tone="subdued">Rows</Text>
                              <div style={{ width: 96 }}>
                                <Select
                                  label="Rows per page"
                                  labelHidden
                                  options={rowsPerPageOptions}
                                  value={String(data?.productsPageSize || 25)}
                                  onChange={onProductsRowsPerPageChange}
                                />
                              </div>
                            </InlineStack>

                            <Pagination
                              hasPrevious={Boolean(data.productsPageInfo?.hasPreviousPage)}
                              onPrevious={goProductsPrevPage}
                              hasNext={Boolean(data.productsPageInfo?.hasNextPage)}
                              onNext={goProductsNextPage}
                            />
                          </InlineStack>
                        </InlineStack>
                      </div>
                    ) : null}
                  </div>

                  

                  <Text as="p" variant="bodySm" tone="subdued">
                    Generate creates a job for the selected products and redirects to Generation History.
                  </Text>
                </>
              ) : selectedTab === "images" ? (
                <BlockStack gap="300">
                  {/* Images: status tabs (left) + search/filters buttons (right) */}
                  <InlineStack align="space-between" blockAlign="center">
                    <ButtonGroup>
                      {imageTabs.map((t) => (
                        <Button
                          key={t.id}
                          variant="tertiary"
                          pressed={imageAltTab === t.id}
                          onClick={() => onImageAltTabClick(t.id)}
                        >
                          {t.content}
                        </Button>
                      ))}
                    </ButtonGroup>

                    <ButtonGroup segmented>
                      <Button
                        icon={SearchIcon}
                        accessibilityLabel="Search"
                        onClick={() => {
                          setImageFiltersMode(IndexFiltersMode.Filtering);
                          requestAnimationFrame(() => imageSearchInputRef.current?.focus?.());
                        }}
                      />
                      <Button
                        icon={FilterIcon}
                        accessibilityLabel="Filters"
                        onClick={() => setImageFiltersMode(IndexFiltersMode.Filtering)}
                      />
                    </ButtonGroup>
                  </InlineStack>

                  {imageFiltersMode === IndexFiltersMode.Filtering ? (
                    <div className="seoToolsFiltersPanel">
                      <IndexFilters
                        tabs={[]}
                        selected={0}
                        onSelect={() => {}}
                        queryValue={imageQueryValue}
                        queryPlaceholder="Search by product name"
                        onQueryChange={onImageQueryChange}
                        onQueryClear={() => onImageQueryChange("")}
                        queryField={
                          <TextField
                            value={imageQueryValue}
                            onChange={onImageQueryChange}
                            placeholder="Search by product name"
                            prefix={<Icon source={SearchIcon} />}
                            autoComplete="off"
                            inputRef={imageSearchInputRef}
                          />
                        }
                        filters={imageFilters}
                        appliedFilters={imageAppliedFilters}
                        onClearAll={() => {
                          onImageQueryChange("");
                          onImageStatusChange([]);
                          setImageFiltersMode(IndexFiltersMode.Default);
                        }}
                        cancelAction={{
                          content: "Cancel",
                          onAction: () => setImageFiltersMode(IndexFiltersMode.Default),
                          disabled: false,
                          loading: false,
                        }}
                        mode={imageFiltersMode}
                        setMode={setImageFiltersMode}
                      />
                    </div>
                  ) : null}

<InlineStack align="space-between" blockAlign="center">
                    <Text as="span" variant="bodyMd" fontWeight="semibold">
                      {hasImageSelection ? `${selectedImageCount} image(s) selected` : "Select images to generate ALT text"}
                    </Text>
                    <Button
                      variant="primary"
                      onClick={bulkGenerateImages}
                      disabled={!billing.isPro || !hasImageSelection}
                      loading={startGenFetcher.state === "submitting"}
                    >
                      Generate ALT text
                    </Button>
                  </InlineStack>

                  {!billing.isPro ? (
                    <Banner
                      tone="info"
                      title="Pro feature"
                      action={{ content: "Upgrade to Pro", url: billingUrl }}
                    >
                      <Text as="p" variant="bodyMd">
                        Image ALT text generation is available on the Pro plan.
                      </Text>
                    </Banner>
                  ) : null}

                  {filteredImageRows.length === 0 ? (
                    <Banner tone="warning" title="No images found">
                      <Text as="p" variant="bodyMd">
                        Try adjusting filters/search. Only MediaImage items are shown.
                      </Text>
                    </Banner>
                  ) : (
                    <>
                  <Modal
                    open={isImagePreviewOpen}
                    onClose={closeImagePreview}
                    title={imagePreviewRow?.productTitle ? `Image preview — ${imagePreviewRow.productTitle}` : "Image preview"}
                    primaryAction={{
                      content: "Save alt text",
                      onAction: () => {
                        if (!imagePreviewRow?.mediaId || !imagePreviewRow?.productId) return;
                        const fd = new FormData();
                        fd.set("intent", "update_image_alt");
                        fd.set("productId", String(imagePreviewRow.productId));
                        fd.set("mediaId", String(imagePreviewRow.mediaId));
                        fd.set("altText", String(imageAltDraft || ""));
                        updateAltFetcher.submit(fd, { method: "post" });
                      },
                      loading: updateAltFetcher.state === "submitting",
                      disabled: !imagePreviewRow?.mediaId || !imagePreviewRow?.productId,
                    }}
                    secondaryActions={[{ content: "Close", onAction: closeImagePreview }]}
                  >
                    <Modal.Section>
                      {imagePreviewRow ? (
                        <BlockStack gap="300">
                          {imageAltSaveError ? (
                            <Banner tone="critical" title="Could not save alt text">
                              <Text as="p" variant="bodyMd">{String(imageAltSaveError)}</Text>
                            </Banner>
                          ) : null}
                          <Box>
                            <img
                              src={imagePreviewRow.url}
                              alt={String(imageAltDraft || imagePreviewRow.productTitle || "")}
                              style={{
                                width: "100%",
                                maxHeight: 420,
                                objectFit: "contain",
                                borderRadius: 8,
                                display: "block",
                              }}
                            />
                          </Box>
                          <BlockStack gap="100">
                            <Text as="p" variant="bodyMd" fontWeight="semibold">
                              ALT text
                            </Text>
                            <TextField
                              value={imageAltDraft}
                              onChange={(v) => {
                                setImageAltDraft(v);
                                if (imageAltSaveError) setImageAltSaveError(null);
                              }}
                              placeholder="(empty)"
                              multiline={3}
                              autoComplete="off"
                            />
                          </BlockStack>
                          <BlockStack gap="100">
                            <Text as="p" variant="bodyMd" fontWeight="semibold">
                              Media ID
                            </Text>
                            <Text as="p" variant="bodySm" tone="subdued">
                              {imagePreviewRow.mediaId}
                            </Text>
                          </BlockStack>
                        </BlockStack>
                      ) : null}
                    </Modal.Section>
                  </Modal>

<Card padding="0">
                      <IndexTable
                        resourceName={{ singular: "image", plural: "images" }}
                        itemCount={filteredImageRows.length}
                        selectedItemsCount={allImagesSelected ? "All" : selectedImageResources.length}
                        onSelectionChange={handleImageSelectionChange}
                        headings={[
                          { title: "Image" },
                          { title: "Product" },
                          { title: "Status" },
                          { title: "ALT text" },
                          { title: "Actions" },
                        ]}
                      >
                        {filteredImageRows.map((r, index) => (
                          <IndexTable.Row
                            id={r.mediaId}
                            key={r.mediaId}
                            position={index}
                            selected={selectedImageResources.includes(r.mediaId)}
                          >
                            <IndexTable.Cell>
                              <Thumbnail source={r.url} alt={r.altTextEffective || r.productTitle} />
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <BlockStack gap="050">
                                <Text as="span" variant="bodyMd" fontWeight="semibold">
                                  {r.productTitle}
                                </Text>
                                <Text as="span" variant="bodySm" tone="subdued">
                                  {r.mediaId}
                                </Text>
                              </BlockStack>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Badge tone={statusTone(r.productStatus)}>
                                {statusLabelTr(r.productStatus)}
                              </Badge>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              {r.altTextEffective ? (
                                <Text as="span" variant="bodySm">
                                  {truncate(r.altTextEffective, 90)}
                                </Text>
                              ) : (
                                <InlineStack gap="200" blockAlign="center">
                                  <Badge tone="warning">Empty</Badge>
                                  <Text as="span" variant="bodySm" tone="subdued">(empty)</Text>
                                </InlineStack>
                              )}
                            </IndexTable.Cell>

                            <IndexTable.Cell>
                              <Button
                                variant="tertiary"
                                onClick={() => openImagePreview(r)}
                                disabled={!billing.isPro}
                              >
                                Preview
                              </Button>
                            </IndexTable.Cell>
                          </IndexTable.Row>
                        ))}
                      </IndexTable>
                    </Card>
                    </>
                  )}
                </BlockStack>
              ) : (
                <BlockStack gap="300">
                  {/* Blog articles: status tabs (left) + search button (right) */}
                  <InlineStack align="space-between" blockAlign="center">
                    <ButtonGroup>
                      {blogTabs.map((t) => (
                        <Button
                          key={t.id}
                          variant="tertiary"
                          pressed={blogStatusTab === t.id}
                          onClick={() => onBlogStatusTabClick(t.id)}
                        >
                          {t.content}
                        </Button>
                      ))}
                    </ButtonGroup>

                    <ButtonGroup segmented>
                      <Button
                        icon={SearchIcon}
                        accessibilityLabel="Search"
                        onClick={() => {
                          setBlogFiltersMode(IndexFiltersMode.Filtering);
                          requestAnimationFrame(() => blogSearchInputRef.current?.focus?.());
                        }}
                      />
                      <Button
                        icon={FilterIcon}
                        accessibilityLabel="Filters"
                        onClick={() => setBlogFiltersMode(IndexFiltersMode.Filtering)}
                      />
                    </ButtonGroup>
                  </InlineStack>

                  {blogFiltersMode === IndexFiltersMode.Filtering ? (
                  <div className="seoToolsFiltersPanel">
                    <IndexFilters
                      tabs={[]}
                      selected={0}
                      onSelect={() => {}}
                      queryValue={blogQueryValue}
                      queryPlaceholder="Search blog articles"
                      onQueryChange={setBlogQueryValue}
                      onQueryClear={() => setBlogQueryValue("")}
                      queryField={
                        <TextField
                          value={blogQueryValue}
                          onChange={setBlogQueryValue}
                          placeholder="Search blog articles"
                          prefix={<Icon source={SearchIcon} />}
                          autoComplete="off"
                          inputRef={blogSearchInputRef}
                        />
                      }
                      filters={blogFilters}
                      appliedFilters={blogAppliedFilters}
                      onClearAll={() => {
                        setBlogQueryValue("");
                        setBlogNamesSelected([]);
                        setBlogSeoStatus("");
                        setBlogFiltersMode(IndexFiltersMode.Default);
                      }}
                      cancelAction={{
                        content: "Cancel",
                        onAction: () => setBlogFiltersMode(IndexFiltersMode.Default),
                        disabled: false,
                        loading: false,
                      }}
                      mode={blogFiltersMode}
                      setMode={setBlogFiltersMode}
                    />
                  </div>
                  ) : null}

                  <Modal
                    open={blogGenModalOpen}
                    onClose={() => setBlogGenModalOpen(false)}
                    title="Generate"
                    primaryAction={{
                      content: "Generate",
                      onAction: () => {
                        setBlogGenModalOpen(false);
                        bulkGenerateBlog();
                      },
                      disabled: !billing.isPro || (!blogGenTitle && !blogGenDescription),
                      loading: startGenFetcher.state === "submitting",
                    }}
                    secondaryActions={[
                      { content: "Cancel", onAction: () => setBlogGenModalOpen(false) },
                    ]}
                  >
                    <Modal.Section>
                      <BlockStack gap="300">
                        <Text as="p" variant="bodyMd">
                          Which fields should be generated for the selected blog articles?
                        </Text>
                        <InlineStack gap="400">
                          <Checkbox label="Title" checked={blogGenTitle} onChange={setBlogGenTitle} />
                          <Checkbox label="Description" checked={blogGenDescription} onChange={setBlogGenDescription} />
                        </InlineStack>
                      </BlockStack>
                    </Modal.Section>
                  </Modal>

                  <div
                    className="seoToolsBlogTable"
                    style={{
                      position: "relative",
                      marginLeft: "calc(var(--p-space-400) * -1)",
                      marginRight: "calc(var(--p-space-400) * -1)",
                    }}
                  >
                  {!billing.isPro ? (
                    <div style={{ padding: "0 var(--p-space-400) var(--p-space-300)" }}>
                      <Banner
                        tone="info"
                        title="Pro feature"
                        action={{ content: "Upgrade to Pro", url: billingUrl }}
                      >
                        <Text as="p" variant="bodyMd">
                          Blog article generation is available on the Pro plan.
                        </Text>
                      </Banner>
                    </div>
                  ) : null}
                  <IndexTable
                    resourceName={{ singular: "article", plural: "articles" }}
                      itemCount={filteredBlogArticles.length}
                      selectedItemsCount={allBlogSelected ? "All" : selectedBlogIds.length}
                      onSelectionChange={handleBlogSelectionChange}
                    promotedBulkActions={blogPromotedBulkActions}
                      headings={[
                      { title: "Article" },
                      { title: "Blog" },
                      { title: "Status" },
                      { title: "SEO status" },
                      { title: "SEO title" },
                      { title: "SEO description" },
                    ]}
                    >
                    {pagedBlogArticles.map((a, index) => (
                      <IndexTable.Row
                        id={a.id}
                        key={a.id}
                        position={index}
                        selected={selectedBlogIds.includes(a.id)}
                      >
                        <IndexTable.Cell>
                          <Text as="span" variant="bodyMd" fontWeight="medium">
                            {a.title}
                          </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>{a.blogTitle}</IndexTable.Cell>
                        <IndexTable.Cell>
                          <Badge tone={a.isPublished ? "success" : "attention"}>
                            {a.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          {(() => {
                            const t = String(a?.seoTitle || "").trim();
                            const d = String(a?.seoDescription || "").trim();
                            const st = t && d ? "filled" : (t || d ? "partial" : "empty");
                            const lbl = st === "filled" ? "Filled" : st === "partial" ? "Missing" : "Empty";
                            const tone = st === "filled" ? "success" : st === "partial" ? "warning" : "subdued";
                            return <Badge tone={tone}>{lbl}</Badge>;
                          })()}
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Text as="span" variant="bodySm">
                            {a.seoTitle || "—"}
                          </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Text as="span" variant="bodySm">
                            {a.seoDescription || "—"}
                          </Text>
                        </IndexTable.Cell>
                      </IndexTable.Row>
                    ))}
                  </IndexTable>

                    <div style={{ padding: "var(--p-space-300) var(--p-space-400)" }}>
                      <InlineStack align="space-between" blockAlign="center" gap="400">
                        <Text as="span" variant="bodySm" tone="subdued">
                          {(() => {
                            const total = Number(filteredBlogArticles?.length || 0);
                            const limit = Number(blogPageSize || 25);
                            const page = Math.max(1, Number(blogPage || 1));
                            const start = total === 0 ? 0 : (page - 1) * limit + 1;
                            const end = total === 0 ? 0 : Math.min(page * limit, total);
                            return `${start}–${end} / ${total}`;
                          })()}
                        </Text>

                        <InlineStack gap="300" blockAlign="center">
                          <InlineStack gap="200" blockAlign="center">
                            <Text as="span" variant="bodySm" tone="subdued">Rows</Text>
                            <div style={{ width: 96 }}>
                              <Select
                                label="Rows per page"
                                labelHidden
                                options={rowsPerPageOptions}
                                value={String(blogPageSize || 25)}
                                onChange={onBlogRowsPerPageChange}
                              />
                            </div>
                          </InlineStack>

                          <Pagination
                            hasPrevious={blogPage > 1}
                            onPrevious={goBlogPrevPage}
                            hasNext={blogPage < blogTotalPages}
                            onNext={goBlogNextPage}
                          />
                        </InlineStack>
                      </InlineStack>
                    </div>

                  </div>

                </BlockStack>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
      </BlockStack>
    </Page>
  );
}


/** ---------------- route ErrorBoundary ---------------- */
export function ErrorBoundary() {
  const err = useRouteError();
  // eslint-disable-next-line no-console
  console.error("SEO Tools ErrorBoundary:", err);

  let bannerTitle = "Something went wrong";
  let message = "Unknown error";

  if (isRouteErrorResponse(err)) {
    bannerTitle = `Error ${err.status}`;
    message = err.data || err.statusText;
  } else if (err instanceof Error) {
    message = err.message;
  } else {
    message = String(err);
  }

  return (
    <Page title="SEO Tools" fullWidth>
      <Banner tone="critical" title={bannerTitle}>
        <Text as="p" variant="bodyMd">
          {message}
        </Text>
      </Banner>
    </Page>
  );
}