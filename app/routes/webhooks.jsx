import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, session, payload } = await authenticate.webhook(request);

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
      const shopId = payload.shop_id;
      if (customer && shopId ) {
        await prisma.user.delete({where : { userId_shopId: {userId: customer.id, shopId: shopId} }});
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
