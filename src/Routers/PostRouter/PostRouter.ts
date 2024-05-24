import { Router, Request, Response } from "express";


export const PostRouter = Router()

PostRouter.get('/', async (req: Request, res: Response) => {
    res.send("WORKS POSTS")
})