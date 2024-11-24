import express from "express";
import redisClient from "./redis/redis-client"; // Adjust path as needed

const app = express();

(async () => {
    try {
        await redisClient.connect(); // Ensure Redis client is connected before starting the server
        console.log("Redis client connected");

        app.use(express.json());

        // Example route that caches data in Redis
        app.get("/api/data", async (req, res) => {
            try {
                const cachedData = await redisClient.get("myKey");

                if (cachedData) {
                    console.log("Cache hit");
                    return res.json({ data: JSON.parse(cachedData) });
                }

                console.log("Cache miss");
                const data = { message: "Hello from the server!" }; // Fetch or generate data
                await redisClient.setEx("myKey", 3600, JSON.stringify(data)); // Cache for 1 hour

                res.json({ data });
            } catch (err) {
                console.error("Error fetching or caching data:", err);
                res.status(500).send("Server error");
            }
        });

        app.listen(3000, () => {
            console.log("Server is running on http://localhost:3000");
        });
    } catch (err) {
        console.error("Failed to connect Redis or start the server:", err);
    }
})();
