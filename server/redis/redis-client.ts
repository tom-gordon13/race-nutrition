import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err: Error) => console.error("Redis Client Error", err));

(async () => {
    await redisClient.connect();
    console.log("Connected to Redis");
})();

export default redisClient;

