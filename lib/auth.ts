import {betterAuth} from "better-auth";
import {admin} from "better-auth/plugins"
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
    user: {
        additionalFields: {
            staff_id: {
                type: 'string',
                required: true,
                input: false,
            }
        }
    },
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        admin(),
    ],
});

