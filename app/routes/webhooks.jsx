import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, session, payload } = await authenticate.webhook(request);
  console.log("Payload: ", payload)

  let userExists;
  let shopExists;

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await prisma.session.deleteMany({ where: { shop } });
      }
      break;
    case "CUSTOMERS_DATA_REQUEST":
      
      break;
    case "CUSTOMERS_REDACT":
      const {customer, shop_id} = payload;
      const customerString = '' + customer.id
      const shopString = '' + shop_id
      console.log("Id: ", customerString)
      console.log("Shop: ", shopString)

      userExists = await prisma.user.findUniqueOrThrow({where : { userId_shopId: {userId: customerString, shopId: shopString} }})
      if ( userExists ) {
        await prisma.user.delete({where : { userId_shopId: {userId: customerString, shopId: shopString} }});
      }
    break;
    case "SHOP_REDACT":
      const shopId = payload.shop_id;
      const idShopString = '' + shopId
      console.log("shop: ", idShopString)

      shopExists = await prisma.user.findUniqueOrThrow({where : { shopId: idShopString } })
      userExists = await prisma.user.findUniqueOrThrow({where : { shopId: idShopString }})

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
