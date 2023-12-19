import prisma from "./db.server";

export async function getWishList (id, graphql) {
    const wishList = await prisma.WishList.findFirst({ where: { id }})

    if (!wishList) {
      return json("Something went wrong", { status: 404 }); 
    }

    return supplementWishList(wishList, graphql)
}

// postWishList, export and import into app.add.jsx
export async function postWishList (productId) {
  const id = productId
  const wishList = await prisma.WishList.create({
    data: {
      id
    }
  })
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