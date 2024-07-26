import {NextFunction, Request, Response} from "express";
import {RefreshAuthOutputModelType, SessionOutputModelViewType} from "../auth-registration/auth/auth-types";
import {ResultNotificationEnum, ResultNotificationType} from "../../typings/basic-types";
import {ROUTERS_SETTINGS} from "../../settings";
import {saveError} from "../../internal/utils/error-utils/save-error";


export class SecurityDeviceController {
    async getAllSessions(req: Request, res: Response<SessionOutputModelViewType[]>) {
        try {
            const verifyJwt: ResultNotificationType<RefreshAuthOutputModelType> = await AuthService.JWTRefreshTokenAuth(req.cookies.refreshToken)
            if (verifyJwt.status != ResultNotificationEnum.Success) return res.sendStatus(401)

            const result: SessionOutputModelViewType[] | [] = await AuthQueryRepositories.GetAllSessionsByUserId(verifyJwt.data!.RefreshJWTPayload.userId)
            return res.status(200).json(result);
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.SECURITY.security}${ROUTERS_SETTINGS.SECURITY.devices}`, 'GET', 'Get all sessions', e)
            return res.sendStatus(500)
        }
    }

    async deleteSessionsExcludeCurrent (req: Request, res: Response) {
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
            await saveError(`${ROUTERS_SETTINGS.SECURITY.security}${ROUTERS_SETTINGS.SECURITY.devices}`, 'DELETE', 'Delete the all sessions exclude the current session', e)
            return res.sendStatus(500)
        }
    }

    async deleteSessionById (req: Request<{deviceId: string}>, res: Response) {
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
            await saveError(`${ROUTERS_SETTINGS.SECURITY.security}${ROUTERS_SETTINGS.SECURITY.devices}`, 'DELETE', 'Delete session by id', e)
            return res.sendStatus(500)
        }
    }

}