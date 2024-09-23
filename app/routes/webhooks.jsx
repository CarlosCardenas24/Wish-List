import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  console.log(request)
  const { topic, shop, session, payload } = await authenticate.webhook(request);
  console.log("Payload: ", payload)

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await prisma.session.deleteMany({ where: { shop } });
      }
      break;
    case "CUSTOMERS_DATA_REQUEST":
      
      break;
    case "CUSTOMERS_REDACT":
      const {customer} = payload;
      const idShop = payload.shop_id;
      const customerString = '' + customer.id
      const idShopString = '' + idShop

      const userExists = await prisma.user.findUniqueOrThrow({where : { userId_shopId: {userId: customerString, shopId: idShopString} }})
      if (userExists ) {
        console.log("id: ", customerString)
        console.log("shop: ", idShopString)
        await prisma.user.delete({where : { userId_shopId: {userId: customerString, shopId: idShopString} }});
      }
    break;
    case "SHOP_REDACT":
      const shopId = payload.shop_id;
      await prisma.product.deleteMany({ where: { shopId: {shopId} } })
      await prisma.product.deleteMany({ where: { shopId: {shopId} } })
    break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
