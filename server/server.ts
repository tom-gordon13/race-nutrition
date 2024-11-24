import express from "express";
import dotenv from "dotenv";
import redisClient from "./redis/redis-client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

(async () => {
    if (!redisClient.isOpen) {
        console.error("Redis client is not open when starting the server.");
    } else {
        console.log("Redis client is already connected.");
    }
})();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


