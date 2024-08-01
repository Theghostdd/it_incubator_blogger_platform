import {ROUTERS_SETTINGS} from "../../../settings";
import {Router} from "express";
import {container} from "../../../composition-root/composition-root";
import {SecurityDeviceController} from "./security-device-controller";



export const securityRouter = Router()
const securityDeviceController = container.resolve(SecurityDeviceController)

securityRouter.get(ROUTERS_SETTINGS.SECURITY.devices, securityDeviceController.getAllSessions.bind(securityDeviceController))

securityRouter.delete(ROUTERS_SETTINGS.SECURITY.devices, securityDeviceController.deleteSessionsExcludeCurrent.bind(securityDeviceController))

securityRouter.delete(`${ROUTERS_SETTINGS.SECURITY.devices}/:deviceId`, securityDeviceController.deleteSessionById.bind(securityDeviceController))
