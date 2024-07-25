import {ROUTERS_SETTINGS} from "../../settings";
import {testController} from "../../composition-root/test-composition-root";
import {Router} from "express";

export const testRouter = Router()
testRouter.delete(ROUTERS_SETTINGS.TEST.test_all_data, testController.clearDb.bind(testController));