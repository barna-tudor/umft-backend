import {betterAuth} from "better-auth";
import {Pool} from "pg";

export const auth = betterAuth({
    database: new Pool({
        user: "postgres",
        host: process.env.DB_HOST,
        database: process.env.DB,
        password: process.env.DB_PASS,
        port: parseInt(process.env.DB_PORT),
        idleTimeoutMillis: 60 * 1000,
        max: 5
    }),
    emailAndPassword: {
        enabled: true
    }
})