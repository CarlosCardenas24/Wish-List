import { authenticate } from "../shopify.server";
import prisma from "../db.server";
//import { subscriptionMetaField } from "~/models/Subscription.server";
import { subscriptionMetaField } from "./app";

export const action = async ({ request }) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

  let userExists;
  let shopExists;


  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await prisma.session.deleteMany({ where: { shop } });
      }
      break;
    case "APP_SUBSCRIPTIONS_UPDATE":
      console.log("sub update admin", admin.graphql)
      const status = payload.app_subscription.status

      if(status == 'ACTIVE') {
        console.log("hasPaid is True")
        //subscriptionMetaField(graph, "true")
      } else {
        console.log("hasPaid is False")
        //subscriptionMetaField(graph, "false")
      }

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
