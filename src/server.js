const path = require("path");
const express = require("express");
const http = require("http");
const crypto = require('crypto');
const {pool} = require("./database/dbConfig");


// Additional Middleware
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const {createClient} = require("redis");
const {Server} = require("socket.io");
const {createAdapter} = require("@socket.io/redis-adapter");
const {toNodeHandler} = require("better-auth/node");
const {auth} = require("../lib/auth")

// dotEnv
const dontEnv = require("dotenv").config();

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
    app.use(cors());
    app.use(helmet());

    // Routes
    app.use("/api", alertRouter);


    // Bedside computer registration:
    // The client program, on boot, can use this key:
    let sessionSetupKey = crypto.randomBytes(32).toString('hex');
    console.log("Session setup key:\n", sessionSetupKey);
    // To get a permanent/rolling (TBD) API key from the server:
    app.post('/api/registerBedsideComputer', async (req, res) => {
        const {setupAPIKey, ward_id, room_id, bed_id} = req.body;
        if (!setupAPIKey || setupAPIKey !== sessionSetupKey) {
            return res.status(403).json({
                success: false, error: "invalid-setup-api-key",
            })
        }
        const apiKey = crypto.randomBytes(32).toString('hex');
        const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
        try {
            await pool.query(`
                INSERT INTO bedside_api_keys(ward_id, room_id, bed_id, client_name, api_key_hash)
                VALUES ($1, $2, $3, $4, $5)
            `, [ward_id, room_id, bed_id, `ward-${ward_id}-room-${room_id}-bed-${bed_id}`, hashedKey],);
            return res.json({
                success: true, apiKey: apiKey,
            });
        } catch (err) {
            return res.status(500).json({success: false, error: err.message});
        }
    });

    // Socket.IO + Redis
    const server = http.createServer(app);
    const socketDotIO = await createSocketServer(server);

    // Create a Publisher and a Subscriber for sanity.
    await getPublisher();
    await getSubscriber();

    if (!process.env.ETHERS_PROVIDER || !process.env.ETHERS_PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
        throw new Error("Missing required environment variables for blockchain logging.");
    }

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log("HTTPS + WebSocket listening on port ", PORT);
    });
}

//TODO: proper error handling
bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});