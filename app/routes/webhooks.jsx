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
      const {shop_id} = payload;
      if (customer && shop_id ) {
        await prisma.user.delete({where : { userId_shopId: {userId: customer.id, shopId: payload.shop_id} }});
      }
    break;
    case "SHOP_REDACT":
      const {shop_id} = payload;
      await prisma.product.deleteMany({ where: { shopId: {shop_id} } })
      await prisma.product.deleteMany({ where: { shopId: {shop_id} } })
    break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
