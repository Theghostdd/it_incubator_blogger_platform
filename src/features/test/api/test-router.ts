import {ROUTERS_SETTINGS} from "../../../settings";
import {Router} from "express";
import {TestController} from "./test-controller";
import "reflect-metadata";
import {container} from "../../../composition-root/composition-root";


const testController = container.resolve(TestController);
export const testRouter = Router()
testRouter.delete(ROUTERS_SETTINGS.TEST.test_all_data, testController.clearDb.bind(testController));