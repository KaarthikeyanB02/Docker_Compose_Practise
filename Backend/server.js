const express = require("express");
const Redis = require('ioredis');
const os = require("os");

const PORT = process.env.PORT || 5000;

const app = express();
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/', async (req, res) => {
    try {
        const visits = await redis.incr('visitor_count');
        res.json({
            message: 'Hello from Docker Compose!',
            total_visits: visits,
            served_by_container: os.hostname(), // Shows web1 or web2
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log("Server is running on Port:", PORT);
})