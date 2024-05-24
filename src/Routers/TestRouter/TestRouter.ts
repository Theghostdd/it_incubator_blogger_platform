import { Router, Request, Response } from "express";
import { SETTINGS } from "../../settings";


export const TestRouter = Router()

TestRouter.delete(SETTINGS.PATH_TEST.TEST_ALL_DATA, async(req: Request, res: Response) => {
    res.send("WORKS TEST")
})