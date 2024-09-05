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
    //case "CUSTOMERS_DATA_REQUEST":
      
      //break;
    case "CUSTOMERS_REDACT":
        const customer = payload.customer;
        const customerId = customer.id;
        await prisma.user.delete({where : { userId_shopId: {userId: customerId, shopId: payload.shop_id} }});
    break;
    //case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
