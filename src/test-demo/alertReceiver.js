const {createClient} = require('redis');

(async () => {
    const wardId = process.argv[2] || 1;
    const channel = `ward:${wardId}`;

    const subscriber = createClient({url: 'redis://localhost:6379'});
    subscriber.on('error', (err) => console.error('Redis Client Error', err));

    await subscriber.connect();
    await subscriber.subscribe(channel, (message) => {
        try {
            const alert = JSON.parse(message);
            console.log(`[${channel}]:\n`, alert);
        } catch (err) {
            console.error('Error parsing message:', err);
        }
    });
    console.log(`Subscribed to ${channel}`);
})();
