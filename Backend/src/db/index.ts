import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { ENV } from "../config/env"

// it will throw an error if db url is not provided
if (!ENV.DB_URL) {
    throw new Error("Database URL is not provided in Environment Variables.");
};

// initiallize postgreSQL connection pool
const pool = new Pool({ connectionString: ENV.DB_URL })

pool.on("connect", () => {
    console.log("Database connected successfully.")
})

pool.on("error", (err) => {
    console.log(`Found Errors while connecting to Database; ${err}`)
})

export const db = drizzle({ client: pool, schema })
