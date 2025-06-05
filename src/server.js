const dontEnv = require("dotenv").config();
const path = require("path");
const express = require("express");
const http = require("http");
const crypto = require('crypto');
const {pool, poolQuery} = require("./database/dbConfig");


// Additional Middleware
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const {createClient} = require("redis");
const {Server} = require("socket.io");
const {createAdapter} = require("@socket.io/redis-adapter");
const {toNodeHandler} = require("better-auth/node");
import {auth} from "../lib/auth.ts"

// Routes
const alertRouter = require("./routes/alerts");

// Socket.IO + Redis
const {createSocketServer} = require("../lib/socketio");
const {getSubscriber, getPublisher} = require("../lib/redis");

async function bootstrap() {
    const app = express();

    // Middleware
    app.all('/api/auth/{*any}', toNodeHandler(auth));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    // TODO: proper config
    app.use(cors({
            origin: process.env.FRONTEND_HOST,
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        }
    ));
    app.use(helmet());

    // Routes
    app.use("/api", alertRouter);


    // Bedside computer registration:
    // The client program, on boot, can use this key:
    let sessionSetupKey = crypto.randomBytes(32).toString('hex');
    // To get a permanent/rolling (TBD) API key from the server:
    app.post('/api/registerBedsideComputer', async (req, res) => {
        const {setupAPIKey, ward_id, room_id, bed_id} = req.body;
        if (setupAPIKey === undefined || setupAPIKey !== sessionSetupKey) {
            return res.status(403).json({
                success: false, error: "invalid-setup-api-key",
            })
        }
        const apiKey = crypto.randomBytes(32).toString('hex');
        const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
        try {
            const query = `
                INSERT INTO bedside_api_keys(ward_id, room_id, bed_id, client_name, api_key_hash)
                VALUES ($1, $2, $3, $4, $5)
            `;
            const params = [ward_id, room_id, bed_id, `ward-${ward_id}-room-${room_id}-bed-${bed_id}`, hashedKey];
            await pool.query(query, params);
            return res.json({
                success: true, apiKey: apiKey,
            });
        } catch (err) {
            return res.status(500).json({success: false, error: err});
        }
    });

    // Socket.IO + Redis
    const server = http.createServer(app);
    const socketDotIO = await createSocketServer(server);

    // Create a Publisher and a Subscriber for sanity.
    await getPublisher();
    await getSubscriber();

    if (process.env.USE_BLOCKCHAIN)
        if (!process.env.ETHERS_PROVIDER || !process.env.ETHERS_PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
            throw new Error("Missing required environment variables for blockchain logging.");
        }

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log("HTTP + WebSocket listening on port ", PORT);
        console.log("Session setup key:\n", sessionSetupKey);
    });
}

//TODO: proper error handling
bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});