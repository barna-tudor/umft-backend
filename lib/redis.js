const {createClient} = require("redis");

let publisher;
let subscriber;

// Singleton Publisher
async function getPublisher() {
    if (!publisher) {
        publisher = createClient({url: `${process.env.REDIS_URL || `redis://localhost`}:${process.env.REDIS_HOST || 6379}`});
        publisher.on("error", (err) => console.error("Redis Publisher Error", err));
        publisher.on("connect", () => console.log("Redis Publisher Connected"));
        await publisher.connect();
    }
    return publisher;
}

// Singleton Subscriber
async function getSubscriber() {
    if (!subscriber) {
        subscriber = createClient({url: `${process.env.REDIS_URL || `redis://localhost`}:${process.env.REDIS_HOST || 6379}`});
        subscriber.on("error", (err) => console.error("Redis Subscriber Error", err));
        subscriber.on("connect", () => console.log("Redis Subscriber Connected"));
        await subscriber.connect();
    }
    return subscriber;
}

module.exports = {
    getPublisher, getSubscriber
};
