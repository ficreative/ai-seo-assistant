import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Link,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
  useOutlet,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";
import { authenticate } from "../shopify.server";
import { getJobsForShop, retryFailedForJob, cancelJobForShop } from "../jobs.server";
import prisma from "../db.server.js";
import {
  Page,
  Layout,
  Card,
  IndexTable,
  Text,
  Badge,
  Button,
  BlockStack,
  InlineStack,
  Banner,
  IndexFilters,
  IndexFiltersMode,
  ProgressBar,
  ChoiceList
} from "@shopify/polaris";

/** ---------------- server ---------------- */
export async function loader({ request }) {
  const { session } = await authenticate.admin(request);

  const url = new URL(request.url);

  // Embedded context
  const host = url.searchParams.get("host") || "";
  const embedded = url.searchParams.get("embedded") || "";

  // ✅ shop her zaman session’dan
  const shop = session.shop || "";

  // Filters / sort / paging
  const q = url.searchParams.get("q") || "";
  const status = url.searchParams.get("status") || "";
  const phase = url.searchParams.get("phase") || "";
  const jobType = url.searchParams.get("jobType") || "";
  const sort = url.searchParams.get("sort") || "createdAt_desc";
  const limit = Number(url.searchParams.get("limit") || 50) || 50;
  const cursor = url.searchParams.get("cursor") || null;

  const { jobs, nextCursor, take } = await getJobsForShop(shop, {
    limit,
    cursor,
    status: status || null,
    phase: phase || null,
    jobType: jobType || null,
    q: q || null,
    sort,
  });

  const meta = {
    q,
    status,
    phase,
    jobType,
    sort,
    limit: take,
    cursor: cursor ? String(cursor) : "",
    nextCursor: nextCursor || "",
  };

  return { jobs, meta, shop, host, embedded };
}

export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop || "";

  const formData = await request.formData();
  const intent = String(formData.get("_action") || "");

  if (intent === "retry_failed") {
    const jobId = String(formData.get("jobId") || "").trim();
    const kindRaw = String(formData.get("kind") || "").trim();
    const kind = kindRaw ? kindRaw : null;

    if (!jobId) return { ok: false, message: "Missing jobId" };
    const res = await retryFailedForJob({ shop, jobId, kind });
    return res;
  }

  if (intent === "cancel_job") {
    const jobId = String(formData.get("jobId") || "").trim();
    if (!jobId) return { ok: false, message: "Missing jobId" };
    return await cancelJobForShop({ shop, jobId });
  }

  if (intent === "clear_history") {
    // Deletes all jobs for the shop (items cascade)
    const res = await prisma.seoJob.deleteMany({ where: { shop } });
    return { ok: true, message: `Cleared ${res.count} job(s).` };
  }

  return { ok: false, message: "Unsupported action" };
}

/** ---------------- helpers ---------------- */
function formatDate(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
}

function normalizePhase(phase) {
  return String(phase || "").toLowerCase() || "";
}

function phaseLabel(phase) {
  const p = normalizePhase(phase);
  if (p === "generating") return "Generating";
  if (p === "generated") return "Generated";
  if (p === "publishing") return "Publishing";
  if (p === "published") return "Published";
  return p || "-";
}

function normalizeStatus(status) {
  return String(status || "").toLowerCase() || "";
}

function statusTone(status) {
  const s = normalizeStatus(status);
  if (s === "running") return "info";
  if (s === "queued") return "attention";
  if (s === "success") return "success";
  if (s === "failed") return "critical";
  if (s === "cancelled" || s === "canceled") return "subdued";
  return "subdued";
}

function statusLabel(status) {
  const s = normalizeStatus(status);
  if (!s) return "-";
  if (s === "cancelled" || s === "canceled") return "Cancelled";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function jobTypeLabel(jobType) {
  const t = String(jobType || "").toUpperCase();
  if (t === "PRODUCT_SEO") return "Product SEO";
  if (t === "ALT_TEXT_IMAGES") return "Alt Text (Images)";
  // Backward/forward compat
  if (t === "BLOG_SEO_META") return "Blog SEO Meta";
  if (t === "BLOG_META") return "Blog Meta";
  return t || "-";
}

function getProgress(job) {
  const total = Math.max(0, Number(job?.total ?? 0));
  const phase = normalizePhase(job?.phase);
  const status = normalizeStatus(job?.status);

  if (!total) return { total: 0, processed: 0, label: "-" };

  if (phase === "publishing" || phase === "published") {
    const processed =
      Number(job?.publishOkCount ?? 0) + Number(job?.publishFailedCount ?? 0);

    const doneLabel = status === "running" || status === "queued"
      ? `${processed}/${total} Published`
      : `${total}/${total} Published`;

    return { total, processed: Math.min(total, Math.max(0, processed)), label: doneLabel };
  }

  const processed = Number(job?.okCount ?? 0) + Number(job?.failedCount ?? 0);

  const doneLabel = status === "running" || status === "queued"
    ? `${processed}/${total} Generated`
    : `${total}/${total} Generated`;

  return { total, processed: Math.min(total, Math.max(0, processed)), label: doneLabel };
}

function percent(processed, total) {
  if (!total) return 0;
  const p = Math.round((Number(processed) / Number(total)) * 100);
  return Math.max(0, Math.min(100, p));
}

// ✅ Embedded query’yi her zaman koru (shop/host/embedded)
function getEmbeddedQuery(locationSearch, loaderData) {
  const p = new URLSearchParams(locationSearch || "");

  const ss = typeof window !== "undefined" ? window.sessionStorage : null;

  const shop =
    p.get("shop") || ss?.getItem("shopifyShop") || loaderData?.shop || "";
  const host =
    p.get("host") || ss?.getItem("shopifyHost") || loaderData?.host || "";
  const embedded =
    p.get("embedded") ||
    ss?.getItem("shopifyEmbedded") ||
    loaderData?.embedded ||
    "";

  const out = new URLSearchParams();
  if (shop) out.set("shop", shop);
  if (host) out.set("host", host);
  if (embedded) out.set("embedded", embedded);

  const qs = out.toString();
  return qs ? `?${qs}` : "";
}

// ✅ Filters/search param builder (keeps embedded params)
function buildSearch(locationSearch, patch = {}) {
  const sp = new URLSearchParams(locationSearch || "");

  // Never drop embedded context
  const keepKeys = ["shop", "host", "embedded"];
  keepKeys.forEach((k) => {
    if (patch[k] === undefined && sp.has(k) === false) return;
    if (patch[k] === null) sp.delete(k);
  });

  Object.entries(patch || {}).forEach(([k, v]) => {
    if (v === undefined) return;
    if (v === null || v === "") sp.delete(k);
    else sp.set(k, String(v));
  });

  // If filters changed, reset paging cursor
  if (
    "q" in patch ||
    "status" in patch ||
    "phase" in patch ||
    "jobType" in patch ||
    "sort" in patch ||
    "limit" in patch
  ) {
    sp.delete("cursor");
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

/** ---------------- component ---------------- */
export default function GenerationHistory() {
  const outlet = useOutlet();
  const isChildRoute = Boolean(outlet);
  const data = useLoaderData();

  const navigate = useNavigate();
  const location = useLocation();
  const poller = useFetcher();
  const actionFetcher = useFetcher();
  const [lastActionKey, setLastActionKey] = useState(""); 

  const jobs = Array.isArray(data?.jobs) ? data.jobs : [];
  const meta = data?.meta || {};

  // ✅ shop/host/embedded persist
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (data?.shop) window.sessionStorage.setItem("shopifyShop", data.shop);
    if (data?.host) window.sessionStorage.setItem("shopifyHost", data.host);
    if (data?.embedded) window.sessionStorage.setItem("shopifyEmbedded", data.embedded);
  }, [data?.shop, data?.host, data?.embedded]);

  const embeddedQs = useMemo(
    () => getEmbeddedQuery(location.search, data),
    [location.search, data?.shop, data?.host, data?.embedded],
  );

  const effectiveJobs = useMemo(() => {
    if (poller.data && typeof poller.data === "object" && Array.isArray(poller.data.jobs)) {
      return poller.data.jobs;
    }
    return jobs;
  }, [poller.data, jobs]);

  const effectiveMeta = useMemo(() => {
    if (poller.data && typeof poller.data === "object" && poller.data.meta) {
      return poller.data.meta;
    }
    return meta;
  }, [poller.data, meta]);

  const rows = useMemo(() => {
    const arr = Array.isArray(effectiveJobs) ? effectiveJobs : [];
    return arr.map((j) => ({
      id: String(j.id),
      createdAt: j.createdAt,
      phase: j.phase,
      status: j.status,
      jobType: j.jobType,
      lastError: j.lastError,
      startedAt: j.startedAt,
      finishedAt: j.finishedAt,
      publishStartedAt: j.publishStartedAt,
      publishFinishedAt: j.publishFinishedAt,
      total: j.total,
      okCount: j.okCount,
      failedCount: j.failedCount,
      publishOkCount: j.publishOkCount,
      publishFailedCount: j.publishFailedCount,
    }));
  }, [effectiveJobs]); 

  const hasActive = useMemo(() => {
    return rows.some((r) => {
      const s = normalizeStatus(r.status);
      return s === "queued" || s === "running";
    });
  }, [rows]);

  const isLatestPage = useMemo(() => {
    const sp = new URLSearchParams(location.search || "");
    return !sp.get("cursor");
  }, [location.search]);

  // ✅ Polling: only list page, only when latest page + there is an active job
  useEffect(() => {
    if (isChildRoute) return;
    if (!hasActive) return;
    if (!isLatestPage) return;

    const t = setInterval(() => {
      poller.load(`${location.pathname}${location.search || ""}`);
    }, 2500);

    return () => clearInterval(t);
  }, [isChildRoute, hasActive, isLatestPage, poller, location.pathname, location.search]);

  // After destructive actions (e.g., clear history), refresh the list once
  useEffect(() => {
    if (isChildRoute) return;
    if (actionFetcher.state !== "idle") return;
    if (!actionFetcher.data?.ok) return;
    if (lastActionKey !== "clear_history") return;
    poller.load(`${location.pathname}${location.search || ""}`);
  }, [
    isChildRoute,
    actionFetcher.state,
    actionFetcher.data,
    lastActionKey,
    poller,
    location.pathname,
    location.search,
  ]);

  // ✅ child route render

  /** -------- IndexFilters state (read from URL) -------- */
  // Polaris v13 IndexFilters expects mode + setMode.
  const [mode, setMode] = useState(IndexFiltersMode.Default);
  const [queryValue, setQueryValue] = useState(() => String(effectiveMeta?.q || ""));
  useEffect(() => {
    if (isChildRoute) return;
    setQueryValue(String(effectiveMeta?.q || ""));
  }, [isChildRoute, effectiveMeta?.q]);

  // Search UX: update URL with a small debounce so typing feels natural.
  useEffect(() => {
    if (isChildRoute) return;
    const t = setTimeout(() => {
      navigate(
        `${location.pathname}${buildSearch(location.search, { q: queryValue || "" })}`,
        { replace: true },
      );
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChildRoute, queryValue]);

  const appliedFilters = useMemo(() => {
    const out = [];

    if (effectiveMeta?.status) {
      out.push({
        key: "status",
        label: `Status: ${statusLabel(effectiveMeta.status)}`,
        onRemove: () => navigate(`${location.pathname}${buildSearch(location.search, { status: "" })}`),
      });
    }
    if (effectiveMeta?.phase) {
      out.push({
        key: "phase",
        label: `Phase: ${phaseLabel(effectiveMeta.phase)}`,
        onRemove: () => navigate(`${location.pathname}${buildSearch(location.search, { phase: "" })}`),
      });
    }
    if (effectiveMeta?.jobType) {
      out.push({
        key: "jobType",
        label: `Type: ${jobTypeLabel(effectiveMeta.jobType)}`,
        onRemove: () => navigate(`${location.pathname}${buildSearch(location.search, { jobType: "" })}`),
      });
    }

    return out;
  }, [effectiveMeta?.status, effectiveMeta?.phase, effectiveMeta?.jobType, navigate, location.pathname, location.search]);

  const filters = useMemo(() => {
    return [
      {
        key: "status",
        label: "Status",
        filter: (
          <ChoiceList
            title="Status"
            titleHidden
            choices={[
              { label: "All", value: "" },
              { label: "Queued", value: "queued" },
              { label: "Running", value: "running" },
              { label: "Success", value: "success" },
              { label: "Failed", value: "failed" },
              { label: "Cancelled", value: "cancelled" },
            ]}
            selected={[String(effectiveMeta?.status || "")]}
            onChange={(selected) => {
              const v = Array.isArray(selected) ? selected[0] : "";
              navigate(`${location.pathname}${buildSearch(location.search, { status: v })}`);
            }}
          />
        ),
        shortcut: true,
      },
      {
        key: "phase",
        label: "Phase",
        filter: (
          <ChoiceList
            title="Phase"
            titleHidden
            choices={[
              { label: "All", value: "" },
              { label: "Generating", value: "generating" },
              { label: "Generated", value: "generated" },
              { label: "Publishing", value: "publishing" },
              { label: "Published", value: "published" },
            ]}
            selected={[String(effectiveMeta?.phase || "")]}
            onChange={(selected) => {
              const v = Array.isArray(selected) ? selected[0] : "";
              navigate(`${location.pathname}${buildSearch(location.search, { phase: v })}`);
            }}
          />
        ),
      },
      {
        key: "jobType",
        label: "Type",
        filter: (
          <ChoiceList
            title="Type"
            titleHidden
            choices={[
              { label: "All", value: "" },
              { label: "Product SEO", value: "PRODUCT_SEO" },
              { label: "Alt Text (Images)", value: "ALT_TEXT_IMAGES" },
              { label: "Blog Meta", value: "BLOG_META" },
              { label: "Blog SEO Meta", value: "BLOG_SEO_META" },
            ]}
            selected={[String(effectiveMeta?.jobType || "")]}
            onChange={(selected) => {
              const v = Array.isArray(selected) ? selected[0] : "";
              navigate(`${location.pathname}${buildSearch(location.search, { jobType: v })}`);
            }}
          />
        ),
      },
    ];
  }, [effectiveMeta?.status, effectiveMeta?.phase, effectiveMeta?.jobType, navigate, location.pathname, location.search]);

  const sortOptions = useMemo(() => {
    return [
      { label: "Newest", value: "createdAt_desc" },
      { label: "Oldest", value: "createdAt_asc" },
      { label: "Status (A→Z)", value: "status_asc" },
      { label: "Status (Z→A)", value: "status_desc" },
      { label: "Phase (A→Z)", value: "phase_asc" },
      { label: "Phase (Z→A)", value: "phase_desc" },
    ];
  }, []);

  const onQueryChange = useCallback((v) => setQueryValue(v), []);
  const onQueryClear = useCallback(() => setQueryValue(""), []);

  const onClearAll = useCallback(() => {
    const sp = new URLSearchParams(location.search || "");
    // keep embedded params only
    ["q", "status", "phase", "jobType", "sort", "cursor"].forEach((k) => sp.delete(k));
    navigate(`${location.pathname}?${sp.toString()}`);
  }, [navigate, location.pathname, location.search]);

  /** -------- table markup -------- */
  const rowMarkup = rows.map((job, index) => {
    const tone = statusTone(job.status);
    const p = getProgress(job);
    const v = percent(p.processed, p.total);

    const phase = normalizePhase(job.phase);
    const isPublishPhase = phase === "publishing" || phase === "published";
    const failedForRetry = isPublishPhase
      ? Number(job?.publishFailedCount || 0)
      : Number(job?.failedCount || 0);
    const canRetry =
      failedForRetry > 0 && !["running", "queued"].includes(normalizeStatus(job.status));
    const retryKind = isPublishPhase ? "publish" : "generate";
    const retryLoading = actionFetcher.state !== "idle" && lastActionKey === `retry:${job.id}`;

    const canCancel = ["running", "queued"].includes(normalizeStatus(job.status));
    const cancelLoading = actionFetcher.state !== "idle" && lastActionKey === `cancel:${job.id}`;

    // ✅ KRİTİK: shop/host/embedded query her zaman ekli
    const to = `/app/generation-history/${encodeURIComponent(job.id)}${embeddedQs}`;

    return (
      <IndexTable.Row
        id={job.id}
        key={job.id}
        position={index}
      >
        <IndexTable.Cell>
          <Text as="span" variant="bodyMd" fontWeight="semibold">
            {formatDate(job.createdAt)}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Badge tone="subdued">{jobTypeLabel(job.jobType)}</Badge>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Badge tone="subdued">{phaseLabel(job.phase)}</Badge>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Badge tone={tone}>{statusLabel(job.status)}</Badge>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <BlockStack gap="200">
            <Text as="span" variant="bodySm" tone="subdued">
              {p.label}
            </Text>
            <ProgressBar progress={v} />
          </BlockStack>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <span
            onMouseDownCapture={(e) => e.stopPropagation()}
            onClickCapture={(e) => e.stopPropagation()}
            style={{ display: "inline-block" }}
          >
            <InlineStack gap="200">
              <Link to={to} style={{ textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>
                <Button size="slim">View</Button>
              </Link>

              {canRetry ? (
                <Button
                  size="slim"
                  variant="secondary"
                  loading={retryLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLastActionKey(`retry:${job.id}`);
                    actionFetcher.submit(
                      { _action: "retry_failed", jobId: job.id, kind: retryKind },
                      { method: "post" },
                    );
                  }}
                >
                  Retry failed
                </Button>
              ) : null}

              {canCancel ? (
                <Button
                  size="slim"
                  tone="critical"
                  loading={cancelLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLastActionKey(`cancel:${job.id}`);
                    actionFetcher.submit({ _action: "cancel_job", jobId: job.id }, { method: "post" });
                  }}
                >
                  Cancel
                </Button>
              ) : null}
            </InlineStack>
          </span>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  const nextCursor = String(effectiveMeta?.nextCursor || "");
  const hasNext = Boolean(nextCursor);

  if (isChildRoute) return outlet;

  return (
    <Page title="Generation History" fullWidth>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              {actionFetcher.data?.message ? (
                <Banner tone={actionFetcher.data?.ok ? "success" : "critical"}>
                  <Text as="p" variant="bodyMd">
                    {actionFetcher.data.message}
                  </Text>
                </Banner>
              ) : null}

              <InlineStack align="space-between" blockAlign="center">
                <Text as="h2" variant="headingMd">
                  Jobs
                </Text>

                <InlineStack gap="200">
                  <Button
                    onClick={() => poller.load(`${location.pathname}${location.search || ""}`)}
                    loading={poller.state !== "idle"}
                  >
                    Refresh
                  </Button>

                  <Button
                    tone="critical"
                    variant="secondary"
                    onClick={() => {
                      const ok = typeof window !== "undefined" && window.confirm(
                        "Clear all history? This will delete all jobs for this store."
                      );
                      if (!ok) return;
                      setLastActionKey("clear_history");
                      actionFetcher.submit({ _action: "clear_history" }, { method: "post" });
                    }}
                  >
                    Clear history
                  </Button>

                  {!isLatestPage ? (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        navigate(`${location.pathname}${buildSearch(location.search, { cursor: "" })}`)
                      }
                    >
                      Back to latest
                    </Button>
                  ) : null}
                </InlineStack>
              </InlineStack>

              <IndexFilters
                mode={mode}
                setMode={setMode}
                queryValue={queryValue}
                queryPlaceholder="Search job id..."
                onQueryChange={onQueryChange}
                onQueryClear={onQueryClear}
                filters={filters}
                appliedFilters={appliedFilters}
                onClearAll={onClearAll}
                sortOptions={sortOptions}
                sortSelected={[String(effectiveMeta?.sort || "createdAt_desc")]}
                onSort={(selected) => {
                  const v = Array.isArray(selected) ? selected[0] : "createdAt_desc";
                  navigate(`${location.pathname}${buildSearch(location.search, { sort: v })}`);
                }}
                tabs={[
                  { id: "all", content: "All", isLocked: true },
                ]}
                selected={0}
                onSelect={() => {}}
                canCreateNewView={false}
              />

              <IndexTable
                resourceName={{ singular: "job", plural: "jobs" }}
                itemCount={rows.length}
                headings={[
                  { title: "Created" },
                  { title: "Type" },
                  { title: "Phase" },
                  { title: "Status" },
                  { title: "Progress" },
                  { title: "" },
                ]}
                selectable={false}
              >
                {rowMarkup}
              </IndexTable> 

              {rows.length === 0 ? (
                <Text as="p" variant="bodyMd" tone="subdued">
                  No jobs found.
                </Text>
              ) : null}

              {hasNext ? (
                <InlineStack align="center">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      navigate(`${location.pathname}${buildSearch(location.search, { cursor: nextCursor })}`)
                    }
                  >
                    Load older
                  </Button>
                </InlineStack>
              ) : null}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

/** ---------------- route ErrorBoundary ---------------- */
export function ErrorBoundary() {
  const err = useRouteError();
  // eslint-disable-next-line no-console
  console.error("Generation History ErrorBoundary:", err);

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

  if (isChildRoute) return outlet;

  return (
    <Page title="Generation History" fullWidth>
      <Banner tone="critical" title={bannerTitle}>
        <Text as="p" variant="bodyMd">
          {message}
        </Text>
      </Banner>
    </Page>
  );
}