/* 
  This is from a previous version of shopify
*/

import { LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-04";
import sqlite3 from "sqlite3";
import { join } from "path";

//import { wishListDB } from "./wish-list-db.js";

const database = new sqlite3.Database(join(process.cwd(), "database.sqlite"));
// Initialize SQLite DB
wishListDB.db = database;
//wishListDB.init();
const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  sessionStorage: new SQLiteSessionStorage(database),
});

export default shopify;