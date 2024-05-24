import { Router, Request, Response } from "express";

export const BlogRouter = Router()

BlogRouter.get('/', async (req: Request, res: Response) => {
    res.send("WORKS")
})
