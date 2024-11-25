import { Router, Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.USDA_FOOD_DATA_API_KEY

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const inputString = req.query.query as string;
    if (!inputString) {
        return res.status(400).json({ error: "Query parameter 'query' is required" });
    }

    try {
        const response = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}&query=${inputString}`);
        res.status(200).json({ data: response.data });
    } catch (error: any) {
        console.error('Error fetching item: ', error)
        res.status(400).json({ message: 'An error occurred' })
    }


});

export default router;
