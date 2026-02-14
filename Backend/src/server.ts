import express from "express";
import cors from "cors"
import { ENV } from "./config/env"; 
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/userRoutes";
import commentRoutes from "./routes/commentRoutes";
import productRoutes from "./routes/productRoutes";

const app = express();

app.use(clerkMiddleware());    // adds auth object if found jwt in the headers
app.use(express.json());    // parses JSON request bodies
app.use(express.urlencoded({ extended: true }));    // parses form data (like HTML forms)

// use cors for adding the trusted ui origins
app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true }))    // allows the frontend to send 
// cookies to the backend so that we can authenticate the user

// getting the homepage route
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

// add the routes for project
app.use("/api/users" , userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/products", productRoutes);

app.listen(ENV.PORT, () => console.log(`Server running on Port: ${ENV.PORT}`))
