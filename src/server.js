const path = require("path");
const express = require("express");
const http = require("http");
const {createClient} = require("redis");
const {Server} = require("socket.io");
const {createAdapter} = require("@socket.io/redis-adapter");

// Additional Middleware
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const auth = require("../lib/auth");
import {toNodeHandler} from "better-auth/node";

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