//@Documentation -> https://www.prisma.io/docs/orm/prisma-client/queries/crud
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
};

export async function loader({ request }) {
    try {
        console.log("request", request);
        let headers = new Headers(accessOptions);
        return json({ message: "Success!", method: 'loader()' }, { headers });
    } catch (error) {
        console.log(error);
    }
}

export async function action({ request }) {
    try {
        let headers = new Headers(accessOptions);
        let body = await request.json();
        const { userId, productId, title, shopId, variantId, variantTitle, price, image } = body;

        const recordExists = await prisma.product.findUnique({
            where: {
                variantId: variantId
            }
        });

        const userExists = await prisma.user.findUnique({
            where: {
                userId_variantId: { userId, variantId }
            }
        })

        if(recordExists){
            const { quantity } = recordExists;

            await prisma.product.update({
                where: {
                    variantId: variantId
                },
                data: {
                    quantity: quantity + 1
                },
            })

        } else {
            await prisma.product.create({
                data: {
                    id: productId,
                    name: title,
                    shopId: shopId,
                    variantId: variantId,
                    variantName: variantTitle,
                    price: price,
                    image: image,
                    quantity: 1,
                }
            });
        }
        if(userExists){
            const { quantity } = userExists;

            await prisma.user.update({
                where: {
                    variantId: variantId
                },
                data: {
                    quantity: quantity + 1
                },
            })

        } else {
            await prisma.user.create({
                data: {
                    userId: userId,
                    /* variantId: variantId,
                    quantity: 1, */
                    whishList: JSON.stringify([{quantity: 1, variantId}])
                }
            });
        }

        return json({ successMessage }, { headers });

    } catch (error) {
        console.log(error);
        return json({ message: "hello!" });
    }

}