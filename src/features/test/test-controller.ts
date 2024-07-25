import {Request, Response} from "express";
import {ROUTERS_SETTINGS} from "../../settings";
import {iTestController, iTestService} from "./test-interface";
import {saveError} from "../../internal/utils/error-utils/save-error";


export class TestController implements iTestController{
    constructor(protected testService: iTestService) {}
    async clearDb (req: Request, res: Response): Promise<Response> {
        try {
            await this.testService.clearAllDb()
            return res.sendStatus(204)
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.TEST.test}${ROUTERS_SETTINGS.TEST.test_all_data}`, 'DELETE', 'Delete the all data', e)
            return res.sendStatus(500)
        }
    }
}