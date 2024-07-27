import {ROUTERS_SETTINGS} from "../../settings";
import {Router} from "express";
import {securityDeviceController} from "../../composition-root/composition-root";



export const securityRouter = Router()

securityRouter.get(ROUTERS_SETTINGS.SECURITY.devices, securityDeviceController.getAllSessions.bind(securityDeviceController))

securityRouter.delete(ROUTERS_SETTINGS.SECURITY.devices, securityDeviceController.deleteSessionsExcludeCurrent.bind(securityDeviceController))

securityRouter.delete(`${ROUTERS_SETTINGS.SECURITY.devices}/:deviceId`, securityDeviceController.deleteSessionById.bind(securityDeviceController))
