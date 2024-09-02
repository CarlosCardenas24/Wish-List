import { PrismaClient } from "@prisma/client";
import { json } from "@remix-run/node";

const prisma = new PrismaClient();
prisma ? console.timeStamp() : console.error({ message: "Prisma ORM failed to initialize"});

const accessOptions = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

const successMessage = {
    message: "Success! Product Added to Database",
    method: 'action()',
    resource: [],
    status: 200,
};

async function updateProduct(record, variantId) {
    const { quantity } = record;
    const _quantity = {
        where: {
            variantId: variantId
        }, 
        data: {
            quantity: quantity + 1,
        }
    }

    return prisma.product.update(_quantity)
}

async function addProduct(body) {
    const { productId, title, shopId, shopUrl, variantId, variantTitle, price, image } = body;

    const _product = {
        data : {
            id: productId,
            name: title,
            shopId: shopId,
            shopUrl: shopUrl,
            variantId: variantId,
            variantName: variantTitle,
            price: price,
            image: image,
            quantity: 1,
        }
    }

    return prisma.product.create(_product);
}

async function updateUserWishList(body) {
    const { userId, shopId, variantId } = body;

    const existingList = {
        wishList: {
            upsert: {
                create: {
                    quantity: 1,
                    variantId: variantId,
                },
                update: {
                    quantity: { increment: 1 },
                },
                where: {
                    variantId_uId: {variantId: variantId, uId: userId}
                }
            },
        }
    }

    const _wishList = {
        where: { userId_shopId: {userId: userId, shopId: shopId} },
        data: existingList,
        include: { wishList: true }
    }

    const update = await prisma.user.update(_wishList);

    successMessage.resource = update;

    return update;
}

async function createWishList(body) {
    const { userId, shopId, variantId } = body;

    const _newList = {
        data: {
            userId: userId,
            shopId: shopId,
            wishList: {
                create: {
                    quantity: 1,
                    variantId: variantId,
                }
            }
        }
    }

    const create = prisma.user.create(_newList);

    successMessage.resource = "Newly created";

    return create;
}

export async function loader({ request }) {
    try {
        //console.log("request", request);
        let headers = new Headers(accessOptions);
        return json({ message: "Success!", method: 'loader()' }, { headers });
    } catch (error) {
        console.log(error);
    }
}

export async function action({ request }) {
    //console.log('request from action(): ', request)
    let body = await request.json();
    const { title } = body;
    let method = request.method;

    // This is when a user deletes and item from their wish list
    if (method === 'DELETE') {
        try {
            let headers = new Headers(accessOptions)
            const { userId, variantId } = body;

            const deleteUserList = await prisma.WishList.delete({
                where: {
                    variantId_uId: {variantId: variantId, uId: userId}
                },
            })

            const deleteProductList = await prisma.Product.update({
                where: {
                    variantId: variantId,
                },
                data: {
                    quantity: { decrement: 1 },
                },
            });

            return json({ successMessage }, { headers });
        }catch (error) {
            console.log(error);
            return json({ message: "Hello, the request to the API has failed!" });
        }
    }

    // This is when a user clicks on their wish list
    if (!title){
        try {
            let headers = new Headers(accessOptions);
            const { userId, shopId } = body;
    
            const userExists = await prisma.user.findUnique({
                where: {userId_shopId: {userId: userId, shopId: shopId}},
                include: {wishList: true}
            })
                
            /* userExists ? successMessage.resource = userExists : successMessage.resource = "" */
            if (userExists) {
                successMessage.resource = []
                for (let i = 0; i < userExists?.wishList.length; i++) {
                    const productList = await prisma.product.findUnique({
                        where: {variantId: userExists?.wishList[i].variantId},
                        select: {
                            name: true,
                            variantId: true,
                            variantName: true,
                            price: true,
                            image: true,
                        }
                    })
                    successMessage.resource.push(productList)
                    }
            } else {
                successMessage.resource = "No Data"
            }
    
            return json({ successMessage }, { headers });
    
        }catch (error) {
            console.log(error);
            return json({ message: "Hello, the request to the API has failed!" });
        }
    // This is when a user adds something to their list
    } else {
        try {
            let headers = new Headers(accessOptions);
            const { userId, shopId, variantId } = body;
        
            //query for a product with matching variantId
            const _variantId = {
                where: {
                    variantId: variantId
                }
            }
                
            //query for a user with matching userId
            const _userId = {
                where: {
                    userId_shopId: {userId: userId, shopId: shopId}
                }
            }
        
            // Searches to see if a user already has a specific product in their list
            const productExists = await prisma.wishList.findUnique({
                where: {
                    variantId_uId: {variantId: variantId, uId: userId}
                }
            })

            // If a user already has a product in their list then it will return "already exists" to make a popup appear stating that its already in their list
            if(productExists) {
                successMessage.resource = "Already Exists"
                return json({ successMessage }, { headers })
            } else { // If a user doesn't have it in their list then it will add it
                const userExists = await prisma.user.findUnique(_userId)
                const recordExists = await prisma.product.findUnique(_variantId);
                const record = recordExists;
                recordExists ? await updateProduct(record, variantId) : await addProduct(body);
                userExists ? await updateUserWishList(body) : await createWishList(body);
        
                return json({ successMessage }, { headers });
            }
        
        } catch (error) {
            console.log(error);
            return json({ message: "Hello, the request to the API has failed!" });
        }
    }

}