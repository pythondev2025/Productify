import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

// get all the products (controller for public endpoint)
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await queries.getAllProducts()
        res.status(200).json(products)
    } catch (error) {
        console.error(`Something went wrong while fetching products: ${error}`);
        res.status(500).json({"status": "failed", error: error})
    }
}

// get the product with specific id (public route's controller)
export const getProductById = async (req: Request<{id: string}>, res: Response) => {
    try {
        const {id} = req.params;
        const product = await queries.getProductById(id);
        if (!product) {
            console.error(`Product with id: ${id} doesn't exist.`)
            return res.status(400).json({
                message: `Product with id: ${id} does not exist.`,
                error: "Not Found"
            });
        }
        res.status(200).json(product)
    } catch(err) {
        const {id} = req.params;
        console.error(`Something went wrong while trying to get Product with id: ${id}`);
        res.status(500).json({
            status: "Server Error",
            id: id,
            error: err
        })
    } 
}

// get product for user (protected route's controller)
export const getMyProducts = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({error: "Unauthorized access denied."});
        
        const products = await queries.getProductsByUserId(userId);
        res.status(200).json(products);
    } catch(err) {
        console.error("Oops! something went wrong.");
        res.status(500).json({status: "Server Error", error: err});
    }
}

// create product
export const createProduct = async (req: Request, res: Response) => {
    try {
        const {userId} = getAuth(req);
        if (!userId) return res.status(401).json({error: "Unauthorized acces denied."});

        const {title, description, imageUrl} = req.body;
        if (!title || !description || !imageUrl) {
            res.status(400).json({error: "Title, Description and Image URL must be provided."});
        }
        const product = await queries.createProduct({
            title,
            description,
            imageUrl,
            userId
        })
        res.status(201).json(product);
    } catch(err) {
        console.error("Something went wrong while creating your product.");
        res.status(500).json({message: "Server Error", error: err});
    }
}

// update the existing product
export const updateProduct = async(req: Request<{id: string}>, res: Response) => {
    try {
        // check if user is logged in
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(400).json({error: "Unauthorized access denied."});
        }

        // get the request body and check if product exists
        const {id} = req.params;
        const {title, description, imageUrl} = req.body;
        const existingProduct = await queries.getProductById(id);
        if (!existingProduct) {
            return res.status(400).json({error: "Product Not Found."});
        };

        // check if logged in user created this product
        if (existingProduct.userId !== userId) {
            return res.status(403).json({error: "Access Denied."});
        }
        // update the product
        const product = await queries.updateProduct(id, {
            title,
            description,
            imageUrl
        });
        res.status(200).json(product)
    } catch(err) {
        console.error("Something went wrong while updating your product.");
        return res.status(500).json({status: "Server Error", error: err});
    }
}

// delete the product for the authenticated user
export const deleteProduct = async (req: Request<{id: string}>, res: Response) => {
    try {
        const {userId} = getAuth(req)
        if (!userId) return res.status(401).json({error: "Access Denied."});
        const { id } = req.params;

        const existingProduct = await queries.getProductById(id);
        if (!existingProduct) {
            return res.status(400).json({error: "Product Not Found."});
        };

        // check if auth user created this product
        if (existingProduct.userId !== userId) {
            return res.status(403).json({
                error: "Access denied.", 
                description: "You can only delete your own products." 
            })
        } 
        
        await queries.deleteProduct(id);
        res.status(200).json({message: "Product deleted successfully."});
    } catch(err) {
        console.error("Something went wrong while deleting your Product.");
        res.status(500).json({message: "Server Error", error: err});
    }
}
