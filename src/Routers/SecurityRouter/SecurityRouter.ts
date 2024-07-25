import { Router, Request, Response } from "express";
import { ROUTERS_SETTINGS } from "../../settings";
import { SaveError } from "../../utils/error-utils/save-error";
import { ResultNotificationEnum, ResultNotificationType } from "../../Applications/Types-Models/BasicTypes";
import { RefreshAuthOutputModelType, SessionOutputModelViewType } from "../../Applications/Types-Models/Auth/AuthTypes";
import { SecurityService } from "../../Service/SecurityService/SecurityService";
import { AuthQueryRepositories } from "../../Repositories/AuthRepositories/AuthQueryRepositories";
import { AuthService } from "../../Service/AuthService/AuthService";



export const SecurityRouter = Router()
/*
* Refresh Token verification, if verification was failed, an authorization error is returned.
* Request data from the repository about all current sessions of the current user.
* Catches any exceptions that occur during the process.
*/
SecurityRouter.get(ROUTERS_SETTINGS.SECURITY.devices,
async (req: Request, res: Response<SessionOutputModelViewType[]>) => {
    try {
        const verifyJwt: ResultNotificationType<RefreshAuthOutputModelType> = await AuthService.JWTRefreshTokenAuth(req.cookies.refreshToken)
        if (verifyJwt.status != ResultNotificationEnum.Success) return res.sendStatus(401)

        const result: SessionOutputModelViewType[] | [] = await AuthQueryRepositories.GetAllSessionsByUserId(verifyJwt.data!.RefreshJWTPayload.userId)
        return res.status(200).json(result);
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.SECURITY.security}${ROUTERS_SETTINGS.SECURITY.devices}`, 'GET', 'Get all sessions', e)
        return res.sendStatus(500)
    }
})
/*
* Sending a refresh token from the cookie to the service to delete all user sessions except the current one.
* Processing responses from the service.
* Catches any exceptions that occur during the process of deleting the sessions and returns a 500 status (Internal Server Error).
*/
SecurityRouter.delete(ROUTERS_SETTINGS.SECURITY.devices,
async (req: Request, res: Response) => {
    try {
        const result: ResultNotificationType = await SecurityService.DeleteAllSessionExcludeCurrent(req.cookies.refreshToken)
        switch(result.status) {
            case ResultNotificationEnum.Success:
                return res.sendStatus(204);
            case ResultNotificationEnum.Unauthorized:
                return res.sendStatus(401);
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500);
        }        
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.SECURITY.security}${ROUTERS_SETTINGS.SECURITY.devices}`, 'DELETE', 'Delete the all sessions exclude the current session', e)
        return res.sendStatus(500)
    }
})
/*
* Getting a refresh token from the cookie, as well as getting the device id from the request parameters, to send to the service, to delete the session by its ID.
* Processing the response from the service and sending the response to the client.
* Catches any exceptions that occur during the process of deleting the sessions and returns a 500 status (Internal Server Error).
*/
SecurityRouter.delete(`${ROUTERS_SETTINGS.SECURITY.devices}/:deviceId`,
async (req: Request<{deviceId: string}>, res: Response) => {
    try {
        const result: ResultNotificationType = await SecurityService.DeleteSessionByDeviceId(req.params.deviceId, req.cookies.refreshToken)
        switch(result.status) {
            case ResultNotificationEnum.Success:
                return res.sendStatus(204);
            case ResultNotificationEnum.Unauthorized:
                return res.sendStatus(401);
            case ResultNotificationEnum.Forbidden:
                return res.sendStatus(403)
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500);
        }        
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.SECURITY.security}${ROUTERS_SETTINGS.SECURITY.devices}`, 'DELETE', 'Delete session by id', e)
        return res.sendStatus(500)
    }
})
