import prisma from "./db.server";

export async function getWishList (id, graphql) {
    const wishList = await prisma.WishList.findFirst({ where: { id }})

    if (!wishList) {
        return null
    }

    return supplementWishList(wishList, graphql)
}

export async function getWishLists(shop, graphql) {
    const wishLists = await prisma.WishList.findMany({
      where: { shop },
      orderBy: { id: "desc" },
    });
  
    if (wishLists.length === 0) return [];
  
    return Promise.all(
      wishLists.map((wishList) => supplementWishList(wishList, graphql))
    );
  }

  async function supplementWishList(wishList, graphql) {
    const response = await graphql(
      `
        query supplementWishList($id: ID!) {
          product(id: $id) {
            title
          }
        }
      `,
      {
        variables: {
          id: wishList.productId,
        },
      }
    );
  
    const {
      data: { product },
    } = await response.json();
  
    return {
      ...wishList,
      productDeleted: !product?.title,
      productTitle: product?.title,
    };
  }