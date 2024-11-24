import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err: Error) => console.error("Redis Client Error:", err));

(async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (err) {
        console.error("Failed to connect to Redis:", err);
    }
})();

export default redisClient;
