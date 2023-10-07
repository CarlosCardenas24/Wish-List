import express from "express";
import shopify from "../shopify.js";
//import { wishListDB } from "../wish-list-db.js";

export default function applyWishListEndpoints(app) {
    app.use(express.json());

    app.post("/api/wishlist", async (req, res) => {
        return res.status(200).send({message: "It worked"})
    })
}