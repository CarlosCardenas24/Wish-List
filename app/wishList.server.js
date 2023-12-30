import prisma from "./db.server";
import express from 'express'

const app = express()

app.use(express.json)

app.post('/api/post', async (req, res) => {
  const {productId, title} = req.body
  const result = await prisma.post.create({
    data: {
      productId,
      title
    }
  })
  res.status(201).json(result)
})

/* export async function getWishList (id, graphql) {
    const wishList = await prisma.WishList.findMany({ 
      where: { shop },
      orderBy: { id: 'desc' }
    })

    if (wishList.length === 0) {
      return []
    }

    return Promise.all(
      wishList.map((wishList) => supplementWishList(wishList, graphql))
    )
}

// postWishList, export and import into app.add.jsx
export async function postWishList (id, graphql) {
  const wishList = await prisma.WishList.create({
    data: {
      shop,
      id
    }
  })

  return supplementWishList(wishList, graphql)
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
  } */