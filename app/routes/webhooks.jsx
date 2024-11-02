import { authenticate } from "../shopify.server";
import prisma from "../db.server";
//import { subscriptionMetaField } from "~/models/Subscription.server";
import { subscriptionMetaField } from "./app";
import shopify from "../shopify.server"

export const action = async ({ request }) => {
  const { topic, shop, session, payload } = await authenticate.webhook(request);

  const { admin } = await shopify.unauthenticated.admin(shop);

  const callAdminAPI = async (query, variables = {}) => {
    const response = await admin.graphql({
      data: query,
      variables,
    });
    return await response.json();
  };  

  let userExists;
  let shopExists;


  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await prisma.session.deleteMany({ where: { shop } });
      }
      break;
    case "APP_SUBSCRIPTIONS_UPDATE":
      const status = payload.app_subscription.status
      const hadPiadValue = status === 'ACTIVE' ? "true" : "false"

      try {
        const metafieldQuery = `
          #graphql
          query {
            currentAppInstallation {
              id
              metafields(namespace: "wishify", first: 1) {
                edges {
                  node {
                    key
                    value
                  }
                }
              }
            }
          }
        `;
        const metafieldResponse = await callAdminAPI(metafieldQuery);
        const appInstallID = metafieldResponse.data.currentAppInstallation.id;
        
        const hasPaidMetafield = metafieldResponse.data.currentAppInstallation.metafields.edges.find(
          edge => edge.node.key === "hasPaid"
        );

        if (!hasPaidMetafield) {
          console.log("Initializing hasPaid metafield as it does not exist.");
          await callAdminAPI(`
            #graphql
            mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
              metafieldsSet(metafields: $metafieldsSetInput) {
                metafields {
                  id
                  namespace
                  key
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `, {
            "metafieldsSetInput": [
              {
                "namespace": "wishify",
                "key": "hasPaid",
                "type": "boolean",
                "value": hasPaidValue,
                "ownerId": appInstallID,
              }
            ]
          });
        } else if (hasPaidMetafield.node.value !== hasPaidValue) {
          console.log(`Updating hasPaid metafield to ${hasPaidValue}`);
          await callAdminAPI(`
            #graphql
            mutation UpdateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
              metafieldsSet(metafields: $metafieldsSetInput) {
                metafields {
                  id
                  namespace
                  key
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `, {
            "metafieldsSetInput": [
              {
                "namespace": "wishify",
                "key": "hasPaid",
                "type": "boolean",
                "value": hasPaidValue,
                "ownerId": appInstallID,
              }
            ]
          });
        } else {
          console.log("No update needed for hasPaid metafield; value is already correct.");
        }
      } catch (error) {
        console.error("Error handling APP_SUBSCRIPTIONS_UPDATE webhook:", error);
      }

     /*  if(status == 'ACTIVE') {
        console.log("hasPaid is True")
        subscriptionMetaField(admin.graphql, "true")
      } else {
        console.log("hasPaid is False")
        subscriptionMetaField(admin.graphql, "false")
      } */

      break;
    case "CUSTOMERS_DATA_REQUEST":
      
      break;
    case "CUSTOMERS_REDACT":
      const {customer, shop_id} = payload;
      const customerString = '' + customer.id
      const shopString = '' + shop_id

      userExists = await prisma.user.findUnique({where : { userId_shopId: {userId: customerString, shopId: shopString} }})
      if ( userExists ) {
        await prisma.user.delete({where : { userId_shopId: {userId: customerString, shopId: shopString} }});
      }
    break;
    case "SHOP_REDACT":
      const shopId = payload.shop_id;
      const idShopString = '' + shopId

      shopExists = await prisma.product.findMany({where : { shopId: idShopString } })
      userExists = await prisma.user.findMany({where : { shopId: idShopString }})

      if ( shopExists && userExists ) {
        await prisma.product.deleteMany({ where: { shopId: idShopString } })
        await prisma.user.deleteMany({ where: { shopId: idShopString } })
      }
    break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
