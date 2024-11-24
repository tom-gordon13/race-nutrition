"use strict";
// import { createClient } from "redis";
Object.defineProperty(exports, "__esModule", { value: true });
// const redisClient = createClient();
// redisClient.on("error", (err: Error) => console.error("Redis Client Error:", err));
// // Connect once when the module is loaded
// (async () => {
//     try {
//         console.log('here')
//         await redisClient.connect();
//         console.log("Connected to Redis");
//     } catch (err) {
//         console.error("Failed to connect to Redis:", err);
//     }
// })();
// export default redisClient;
const redis_1 = require("redis");
console.log('here');
const redisClient = (0, redis_1.createClient)({
    url: "redis://127.0.0.1:6379", // Adjust if Redis is remote
});
redisClient.on("connect", () => console.log("Connecting to Redis..."));
redisClient.on("ready", () => console.log("Redis client ready!"));
redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("end", () => console.log("Redis connection closed."));
(async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    }
    catch (err) {
        console.error("Failed to connect to Redis:", err);
    }
})();
exports.default = redisClient;
