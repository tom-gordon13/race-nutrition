import { Router, Request, Response } from "express";
import redisClient from "../../redis/redis-client"
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { id, foodNutrients, brandName, brandOwner, description } = req.body;

    console.log(id, foodNutrients)

    try {
        // // Save the item to Redis as a hash
        // await redisClient.hSet(`item:${id}`, { id, name, price });

        // // Set a TTL of 1 hour for the item
        // await redisClient.expire(`item:${id}`, 3600);

        // console.log(`Item with ID ${id} written to Redis`);
        // res.status(201).json({ message: "Item successfully written to Redis" });
        console.log("Item written to Redis");
    } catch (err) {
        console.error("Failed to write to Redis:", err);
    }
});

router.get("/", async (req: Request, res: Response) => {
    try {
        const item = await redisClient.hGetAll("item:123");
        console.log("Retrieved hash:", item);
    } catch (err) {
        console.error("Failed to write to Redis:", err);
    }
});

export default router;
