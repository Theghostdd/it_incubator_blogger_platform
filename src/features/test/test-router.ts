import {ROUTERS_SETTINGS} from "../../settings";
import {Router} from "express";
import {testController} from "../../composition-root/composition-root";

export const testRouter = Router()
testRouter.delete(ROUTERS_SETTINGS.TEST.test_all_data, testController.clearDb.bind(testController));