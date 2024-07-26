import {Request, Response} from "express";
import {RefreshAuthOutputModelType, SessionOutputModelViewType} from "../auth-registration/auth/auth-types";
import {ResultNotificationEnum, ResultNotificationType} from "../../typings/basic-types";
import {ROUTERS_SETTINGS} from "../../settings";
import {saveError} from "../../internal/utils/error-utils/save-error";
import {SecurityDeviceService} from "./security-device-service";
import {SecurityDeviceQueryRepositories} from "./security-device-query-repositories";
import {AuthService} from "../auth-registration/auth/auth-service";


export class SecurityDeviceController {
    constructor(
        protected securityDeviceService: SecurityDeviceService,
        protected authService: AuthService,
        protected securityDeviceQueryRepositories: SecurityDeviceQueryRepositories
    ) {
    }
    async getAllSessions(req: Request, res: Response<SessionOutputModelViewType[]>) {
        try {
            const verifyJwt: ResultNotificationType<RefreshAuthOutputModelType> = await this.authService.jwtRefreshTokenAuth(req.cookies.refreshToken)
            if (verifyJwt.status != ResultNotificationEnum.Success) return res.sendStatus(401)

            const result: SessionOutputModelViewType[] | [] = await this.securityDeviceQueryRepositories.getSessionsByUserId(verifyJwt.data!.refreshJWTPayload.userId)
            return res.status(200).json(result);
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.SECURITY.security}${ROUTERS_SETTINGS.SECURITY.devices}`, 'GET', 'Get all sessions', e)
            return res.sendStatus(500)
        }
    }

    async deleteSessionsExcludeCurrent (req: Request, res: Response) {
        try {
            const result: ResultNotificationType = await this.securityDeviceService.deleteAllSessionExcludeCurrent(req.cookies.refreshToken)
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
            const result: ResultNotificationType = await this.securityDeviceService.deleteSessionByDeviceId(req.params.deviceId, req.cookies.refreshToken)
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