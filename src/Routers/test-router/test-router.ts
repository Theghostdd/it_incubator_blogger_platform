import { Router, Request, Response } from "express";
import { ROUTERS_SETTINGS, SETTINGS } from "../../settings";
import { SaveError } from "../../Utils/error-utils/save-error";
import { TestService } from "../../Service/test-service/test-service";

export const TestRouter = Router()

TestRouter.delete(ROUTERS_SETTINGS.TEST.test_all_data, async (req: Request, res: Response) => {
    try {
        await TestService.DellAllElements()
        return res.sendStatus(204)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.TEST.test}${ROUTERS_SETTINGS.TEST.test_all_data}`, 'DELETE', 'Delete the all data', e)
        return res.sendStatus(500)
    }
})