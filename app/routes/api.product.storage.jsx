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
    const { productId, title, shopId, variantId, variantTitle, price, image } = body;

    const _product = {
        data : {
            id: productId,
            name: title,
            shopId: shopId,
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
    const { userId, variantId } = body;

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
        where: { userId: userId },
        data: existingList,
        include: { wishList: true }
    }

    const update = await prisma.user.update(_wishList);

    successMessage.resource = update;

    return update;
}

async function createWishList(body) {
    const { userId, variantId } = body;

    const _newList = {
        data: {
            userId: userId,
            wishList: {
                create: {
                    quantity: 1,
                    variantId: variantId,
                }
            }
        }
    }

    return prisma.user.create(_newList);
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

    if (!title){
        try {
            let headers = new Headers(accessOptions);
            const { userId } = body;

            const userExists = await prisma.user.findUnique({
                where: {userId: userId},
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
                console.log(successMessage)
            } else {
                successMessage.resource = ""
            }

            return json({ successMessage }, { headers });

        }catch (error) {
        console.log(error);
        return json({ message: "Hello, the request to the API has failed!" });
    }
    } else {
        try {
            let headers = new Headers(accessOptions);
            const { userId, variantId } = body;
    
            //query for a product with matching variantId
            const _variantId = {
                where: {
                    variantId: variantId
                }
            }
            
            //query for a user with matching userId
            const _userId = {
                where: {
                    userId: userId
                }
            }
    
            const recordExists = await prisma.product.findUnique(_variantId);
            const userExists = await prisma.user.findUnique(_userId)
            const record = recordExists;
            recordExists ? await updateProduct(record, variantId) : await addProduct(body);
            userExists ? await updateUserWishList(body) : await createWishList(body);
    
            return json({ successMessage }, { headers });
    
        } catch (error) {
            console.log(error);
            return json({ message: "Hello, the request to the API has failed!" });
        }
    }
    
    /* try {
        let headers = new Headers(accessOptions);
        let body = await request.json();
        const { userId, variantId } = body;

        //query for a product with matching variantId
        const _variantId = {
            where: {
                variantId: variantId
            }
        }
        
        //query for a user with matching userId
        const _userId = {
            where: {
                userId: userId
            }
        }

        const recordExists = await prisma.product.findUnique(_variantId);
        const userExists = await prisma.user.findUnique(_userId)
        const record = recordExists;
        recordExists ? await updateProduct(record, variantId) : await addProduct(body);
        userExists ? await updateUserWishList(body) : await createWishList(body);

        return json({ successMessage }, { headers });

    } catch (error) {
        console.log(error);
        return json({ message: "Hello, the request to the API has failed!" });
    } */

}