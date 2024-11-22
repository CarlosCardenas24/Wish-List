import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { authenticate, MONTHLY_PLAN } from "../shopify.server";
import { getSubscriptionStatus, subscriptionMetaField } from "~/models/Subscription.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export async function loader({ request }) {
  const {admin, billing, session} = await authenticate.admin(request);
  const {shop} = session;

  const subscriptions = await getSubscriptionStatus(admin.graphql)
  const {activeSubscriptions} = subscriptions.data.app.installation
 
  if (activeSubscriptions.length < 1) {
    subscriptionMetaField(admin.graphql, "false")
    await billing.require({
      plans: [MONTHLY_PLAN],
      isTest: true,
      onFailure: async () =>
        billing.request({
          plan: MONTHLY_PLAN,
          isTest: true,
        }),
        returnUrl: `https://${shop}/admin/apps/wishifylist/app`
    })
  }

  return json({ apiKey: process.env.SHOPIFY_API_KEY });
}

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ui-nav-menu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/instructions">Instructions page</Link>
      </ui-nav-menu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
