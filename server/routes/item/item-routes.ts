import { Router, Request, Response } from "express";


const router = Router();

router.get("/", (req: Request, res: Response) => {
    const inputString = req.query.query as string;
    if (!inputString) {
        return res.status(400).json({ error: "Query parameter 'query' is required" });
    }

    res.status(200).json({ message: `Received input: ${inputString}` });
});

export default router;
