import * as Sentry from "@sentry/node";

let _inited = false;

export function initSentry() {
  if (_inited) return;
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    _inited = true;
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENV || process.env.NODE_ENV || "development",
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0),
  });

  _inited = true;
}

export function captureException(err, context) {
  try {
    initSentry();
    if (!process.env.SENTRY_DSN) return;
    Sentry.captureException(err, {
      extra: context || undefined,
    });
  } catch {
    // never block app on telemetry
  }
}
