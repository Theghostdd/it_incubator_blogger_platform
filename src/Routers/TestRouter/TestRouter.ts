import { Router, Request, Response } from "express";
import { SETTINGS } from "../../settings";
import { TestRepo } from "../../Repositories/TestRepo/TestRepo";
import { StatusResponse } from "../../Applications/Types/Types";


export const TestRouter = Router()

TestRouter.delete(SETTINGS.PATH_TEST.TEST_ALL_DATA, async (req: Request, res: Response<StatusResponse>) => {
    const result = await TestRepo.DellAllElements()
    return res.sendStatus(result.status)
})