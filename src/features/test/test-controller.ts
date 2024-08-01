import {Request, Response} from "express";
import {ROUTERS_SETTINGS} from "../../settings";
import {iTestController, iTestService} from "./test-interface";
import {saveError} from "../../internal/utils/error-utils/save-error";
import {inject, injectable} from "inversify";
import {TestService} from "./test-service";
import "reflect-metadata";


@injectable()
export class TestController implements iTestController{
    constructor(
        @inject(TestService)protected testService: iTestService) {}
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