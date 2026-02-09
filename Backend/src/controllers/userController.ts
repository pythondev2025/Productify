import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import * as queries from "../db/queries"

export async function syncUser(req:Request, res: Response) {
    try {
        const {userId} = getAuth(req);
        if (!userId) return res.status(401).json({error: "Unauthorized access denied."});

        const { email, name, imageUrl} = req.body;
        if (!email || !name || !imageUrl) {
            return res.status(400).json({error: "Email, Name and ImageUrl are required."});
        };

        const user = await queries.upsertUser({
            id: userId,
            email,
            name,
            imageUrl
        });

        res.status(200).json(user);
    } catch (error) {
        console.error("Something went wrong while trying to create the user");
        res.status(500).json({message: "Server Error", error: error})
    }
};