import {ROUTERS_SETTINGS} from "../../settings";



export const securityRouter = Router()

securityRouter.get(ROUTERS_SETTINGS.SECURITY.devices,
    async () => {

    })

securityRouter.delete(ROUTERS_SETTINGS.SECURITY.devices,
    async () => {

    })

securityRouter.delete(`${ROUTERS_SETTINGS.SECURITY.devices}/:deviceId`,
    async () => {

    })
