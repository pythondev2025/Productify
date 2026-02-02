import express from "express";
import cors from "cors"
import { ENV } from "./config/env"; 
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(clerkMiddleware());    // adds auth object if found jwt in the headers
app.use(express.json());    // parses JSON request bodies
app.use(express.urlencoded({ extended: true }));    // parses form data (like HTML forms)

// use cors for adding the trusted ui origins
app.use(cors({ origin: ENV.FRONTEND_URL }))

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Productify API - Powered by PostgreSQL, Drizzle ORM and Clerk Auth",
        endpoints: {
            users: "/api/users",
            products: "/api/products",
            comments: "/api/comments"
        }
    })
})

app.listen(ENV.PORT, () => console.log(`Server running on Port: ${ENV.PORT}`))
