import { Router, Request, Response } from "express";
import { AuthUser } from "../../Applications/Middleware/auth/UserAuth/AuthUser";

export const CommentsRouter = Router()

CommentsRouter.put('/:id', 
AuthUser.AuthUserByAccessToken,
async (req: Request, res: Response) => {
    console.log(req.user)
    return res.status(200).json({message: 'OK'})
})