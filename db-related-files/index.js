import { join } from "path";
import { readFileSync } from "fs";
import express from 'express'
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import GDPRWebhookHandlers from "./gdpr.js";

import applyWishListEndpoints from './middleware/wish-list-api.js'
import bodyParser from 'body-parser'

const app = express();
const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
)

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

// Code made by github user bashunaimiroy to fix error caused by ensureInstalledOnShop
const addSessionShop = (req, res, next) => {
    const shop = res.locals?.shopify?.session?.shop;
    if (shop && !req.query.shop) {
      req.query.shop = shop;
    }
    return next();
  }

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);


// Middleware to parse JSON requests
app.use(bodyParser.json());

app.use("/api/*", shopify.validateAuthenticatedSession());
// we have to add our new middleware *after* the shopify.validateAuthenticatedSession middleware, like so:
app.use(`/api/*`, addSessionShop);

app.use(express.json())

applyWishListEndpoints(app)

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));


app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});
// Start the server

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});