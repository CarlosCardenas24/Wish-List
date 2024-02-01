import { PrismaClient } from "@prisma/client";
import { json } from "@remix-run/node";
import fs from 'fs/promises';

const prisma = new PrismaClient();
prisma ? console.timeStamp() : console.error({ message: "Prisma ORM failed to initialize"});

export async function loader({ request }) {
    try {
        console.log("request", request);
        let headers = new Headers({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        return json({ message: "Success!", method: 'loader()' }, { headers });
    } catch (error) {
        console.log(error);
    }

}

/*@NOTES grab id from action method and generate a storage JSON file from it to simulate database storage */

export async function action({ request }) {

    const accessOptions = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    const successMessage = {
        message: "Success! Product Added to Database",
        method: 'action()',
    };

    const structure = id => {
       return { product_id : id }
    }

    const path = './db-related-files/product.json';
    
    try {

        let headers = new Headers(accessOptions);
        let body = await request.json();
        const { productId } = body;

        await prisma.product.create({
            data: {
                id: productId,
                title: "Test Product",
            }
        });

        // const products = await prisma.product.findMany();
        // console.log("products", products)

        const products = await prisma.product.findMany();

        console.log("products", products)

        return json({ headers });

    } catch (error) {
        console.log(error);
    }
}