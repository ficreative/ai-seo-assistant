// app/root.jsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link as RouterLink,
} from "react-router";
import { AppProvider } from "@shopify/polaris";
import polarisStylesUrl from "@shopify/polaris/build/esm/styles.css?url";
import enTranslations from "@shopify/polaris/locales/en.json";

export const links = () => ([
  { rel: "preconnect", href: "https://cdn.shopify.com/" },
  { rel: "stylesheet", href: "https://cdn.shopify.com/static/fonts/inter/v4/styles.css" },
  { rel: "stylesheet", href: polarisStylesUrl },
]);

function PolarisRouterLink({ url, children, external, ...rest }) {
  if (external) {
    return (
      <a href={url} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink to={url} {...rest}>
      {children}
    </RouterLink>
  );
}

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppProvider i18n={enTranslations} linkComponent={PolarisRouterLink}>
          <Outlet />
        </AppProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}