const {Server} = require("socket.io");
const {createAdapter} = require("@socket.io/redis-adapter");
const {getPublisher, getSubscriber} = require("./redis");

async function createSocketServer(httpServer) {
    const io = new Server(httpServer);

    // Connect with Redis
    const pubClient = await getPublisher();
    const subClient = await getSubscriber();
    io.adapter(createAdapter(pubClient, subClient));

    // Subscribe to all ward channels
    await subClient.pSubscribe("ward:*", async (message, channel) => {
        const alert = JSON.parse(message);
        // Emit alert to all sockets joined to this ward's room
        io.to(channel).emit("alert", alert);
    });

    // Clients
    io.on("connection", (socket) => {
        // Client-B subscribes to ward rooms
        socket.on("subscribe", (ward_id) => {
            socket.join(`ward:${ward_id}`);
        });
    });
    return io;
}

module.exports = {createSocketServer};
