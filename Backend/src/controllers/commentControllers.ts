import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import * as queries from "../db/queries";

// function for creating comment
export const createComment = async (req: Request<{productId: string}>, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({error: "Unauthorized access Denied."});
        // get the request body and parameters 
        const { productId } = req.params;
        const { content } = req.body;
        // check if content exists
        if (!content) return res.status(404).json({error: "Write something to add it as comment."});
        // check if product exists
        const existingProduct = await queries.getProductById(productId);
        if (!existingProduct) return res.status(404).json({error: "Product No Found."});

        // create the comment
        const comment = await queries.createComment({
            content,
            userId,
            productId
        });
        res.status(201).json(comment);
    } catch (error) {
        console.error("Oops! Something went wrong.");
        return res.status(500).json({message: "Server Error", error: error});
    };
};

// delete the comment
export const deleteComment = async (req: Request<{commentId: string}>, res: Response) => {
    try {
        const { commentId } = req.params;
        // check if user is authenticated
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({error: "Access Denied."});

        // check if comment exists and belongs to user
        const existingComment = await queries.deleteComment(commentId);
        if (!existingComment) return res.status(404).json({error: "This comment doesn't exist."});
        // delete the comment 
        await queries.deleteComment(commentId);
        res.status(200).json({message: "Comment deleted successfully."});
    } catch (error) {
        console.log("Something went wrong.");
        res.status(500).json({status: "Server Error", error: error});
    }
}
