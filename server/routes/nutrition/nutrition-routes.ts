import { Router, Request, Response } from "express";
import redisClient from "../../redis/redis-client"
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { fdcId, foodNutrients, brandName, brandOwner, description } = req.body.itemToPost;
    try {
        const serializedFoodNutrients = JSON.stringify(foodNutrients);
        await redisClient.hSet(`nutrition:${fdcId}`, { fdcId, foodNutrients: serializedFoodNutrients, brandName: brandName || 'N/A', brandOwner, description });

        await redisClient.expire(`nutrition:${fdcId}`, 3600);

        console.log(`Nutrition for item with ID ${fdcId} written to Redis`);
        res.status(201).json({ message: "Item successfully written to Redis" });
        console.log("Nutrition for item written to Redis");
    } catch (err) {
        console.error("Failed to write nutrition to Redis:", err);
    }
});

router.get("/:fdcId", async (req: Request, res: Response) => {
    try {
        const { fdcId } = req.params;

        if (!fdcId) {
            return res.status(400).json({ error: "Missing required query parameter: fdcId" });
        }

        const nutrition = await redisClient.hGetAll(`nutrition:${fdcId}`);

        if (Object.keys(nutrition).length === 0) {
            return res.status(404).json({ error: `No nutrition data found for fdcId: ${fdcId}` });
        }

        if (nutrition.foodNutrients) {
            nutrition.foodNutrients = JSON.parse(nutrition.foodNutrients);
        }

        console.log("Retrieved hash:", nutrition);

        res.status(200).json(nutrition);
    } catch (err) {
        console.error("Failed to retrieve nutrition from Redis:", err);
        res.status(500).json({ error: "Failed to retrieve nutrition from Redis" });
    }
});

export default router;
