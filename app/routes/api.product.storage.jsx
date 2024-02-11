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
        const { productId } = body;

        const recordExists = await prisma.product.findUnique({
            where: {
                id: productId
            }
        });

        if (recordExists) {
            //add quantity of existing record by 1
            return json({ message: "Product already exists in database" }, { headers });
        } else {
            await prisma.product.create({
                data: {
                    id: productId,
                    title: "Test Product",
                }
            });

            return json({ successMessage }, { headers });
        }
    } catch (error) {
        console.log(error);
    }
}