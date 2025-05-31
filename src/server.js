const path = require('path');
const express = require('express');
const http = require('http');
const {createClient} = require('redis');
const {Server} = require('socket.io');
const {createAdapter} = require('@socket.io/redis-adapter');

// Additional Middleware
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

// dotEnv
const dontenv = require('dotenv').config();

// Routes
const alertRouter = require('./routes/alerts');

// Socket.IO + Redis
const {createSocketServer} = require('./socketio');
const {getSubscriber, getPublisher} = require("./redis");

async function bootstrap() {
    const app = express();

    // Middleware
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

    // TODO: proper config
    app.use(cors())
    app.use(helmet());

    // Routes
    app.use('/api', alertRouter);
    const server = http.createServer(app);

    // Socket.IO + Redis
    const socketDotIO = await createSocketServer(server);

    // Create a Publisher and a Subscriber for sanity.
    await getPublisher();
    await getSubscriber();

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log('HTTPS + WebSocket listening on port ', PORT);
    })
}

//TODO: proper error handling
bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});