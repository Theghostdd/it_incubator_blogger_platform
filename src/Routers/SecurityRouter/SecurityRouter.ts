import { Router, Request, Response } from "express";
import { ROUTERS_SETTINGS } from "../../settings";
import { SaveError } from "../../Utils/error-utils/save-error";
import { ResultNotificationEnum, ResultNotificationType } from "../../Applications/Types-Models/BasicTypes";
import { RefreshAuthOutputModelType, SessionOutputModelViewType } from "../../Applications/Types-Models/Auth/AuthTypes";
import { SecurityService } from "../../Service/SecurityService/SecurityService";
import { AuthQueryRepositories } from "../../Repositories/AuthRepositories/AuthQueryRepositories";
import { AuthService } from "../../Service/AuthService/AuthService";



export const SecurityRouter = Router()
/*
* 1. Calls the auth service to verify refresh token from the cookies.
* 2. Processes the result returned:
*    - If `verifyJwt.status` equals `ResultNotificationEnum.Success`, next process to getting all sessions.
*    - If `verifyJwt.status` not equals `ResultNotificationEnum.Success`, it returns a 401 status (Unauthorized).
* 3. Catches any exceptions that occur during the process of retrieving the sessions and returns a 500 status (Internal Server Error).
*/

SecurityRouter.get(ROUTERS_SETTINGS.SECURITY.devices,
async (req: Request, res: Response<SessionOutputModelViewType[]>) => {
    try {
        const verifyJwt: ResultNotificationType<RefreshAuthOutputModelType> = await AuthService.JWTRefreshTokenAuth(req.cookies.refreshToken)
        if (verifyJwt.status != ResultNotificationEnum.Success) return res.sendStatus(401)

        const result: SessionOutputModelViewType[] | [] = await AuthQueryRepositories.GetAllSessionsByUserId(verifyJwt.data!.RefreshJWTPayload.userId)
        return res.status(200).json(result);
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.SECURITY.security}${ROUTERS_SETTINGS.SECURITY.devices}`, 'GET', 'Get all sessions', e)
        return res.sendStatus(500)
    }
})
/*
* 1. Calls the service to delete all user sessions except the current one using the provided refresh token from the cookies.
* 2. Processes the result returned by `SecurityService.DeleteAllSessionExcludeCurrent`:
*    - If `result.status` equals `ResultNotificationEnum.Success`, it returns a 204 status (No Content), indicating that the sessions were successfully deleted.
*    - If `result.status` equals `ResultNotificationEnum.Unauthorized`, it returns a 401 status (Unauthorized).
*    - If `result.status` equals `ResultNotificationEnum.NotFound`, it returns a 404 status (Not Found).
*    - For any other status values, it returns a 500 status (Internal Server Error).
* 3. Catches any exceptions that occur during the process of deleting the sessions and returns a 500 status (Internal Server Error).
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
        SaveError(`${ROUTERS_SETTINGS.SECURITY.security}${ROUTERS_SETTINGS.SECURITY.devices}`, 'DELETE', 'Delete the all sessions exclude the current session', e)
        return res.sendStatus(500)
    }
})
/*
* 1. Calls the service to delete a specific user session identified by `deviceId` using the provided refresh token from the cookies.
* 2. Processes the result returned by `SecurityService.DeleteSessionByDeviceId`:
*    - If `result.status` equals `ResultNotificationEnum.Success`, it returns a 204 status (No Content), indicating that the session was successfully deleted.
*    - If `result.status` equals `ResultNotificationEnum.Unauthorized`, it returns a 401 status (Unauthorized).
*    - If `result.status` equals `ResultNotificationEnum.Forbidden`, it returns a 403 status (Forbidden).
*    - If `result.status` equals `ResultNotificationEnum.NotFound`, it returns a 404 status (Not Found).
*    - For any other status values, it returns a 500 status (Internal Server Error).
* 3. Catches any exceptions that occur during the process of deleting the session and returns a 500 status (Internal Server Error).
* 4. Logs any errors that occur during the process using the `SaveError` function.
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
        SaveError(`${ROUTERS_SETTINGS.SECURITY.security}${ROUTERS_SETTINGS.SECURITY.devices}`, 'DELETE', 'Delete session by id', e)
        return res.sendStatus(500)
    }
})
