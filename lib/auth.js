const {betterAuth} = require("better-auth");
const {Pool} = require("pg");

const auth = betterAuth({
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

module.exports = {auth};