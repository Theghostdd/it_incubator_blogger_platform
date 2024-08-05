import {ResultNotificationEnum, ResultNotificationType} from "../../../typings/basic-types";
import {AuthRepositories} from "../../auth-registration/infrastructure/auth-repositories";
import {AuthService} from "../../auth-registration/application/auth-service";
import {inject, injectable} from "inversify";
import {RefreshAuthOutputModelDto, SessionDto} from "../../auth-registration/domain/dto";
import {HydratedDocument} from "mongoose";
import {ISessionInstanceMethods} from "../../auth-registration/domain/interfaces";

@injectable()
export class SecurityDeviceService {
    constructor(
        @inject(AuthRepositories) private authRepositories: AuthRepositories,
        @inject(AuthService) private authService: AuthService,
    ) {}

    async deleteSessionByDeviceId(dId: string, token: string): Promise<ResultNotificationType> {
        const authByJWT: ResultNotificationType<RefreshAuthOutputModelDto | null> = await this.authService.jwtRefreshTokenAuth(token)
        if (authByJWT.status !== ResultNotificationEnum.Success) return {
            status: ResultNotificationEnum.Unauthorized,
            data: null
        }
        const {userId} = authByJWT.data!.refreshJWTPayload

        const session: HydratedDocument<SessionDto, ISessionInstanceMethods> | null = await this.authRepositories.getSessionByDeviceId(dId)
        if (!session) return {status: ResultNotificationEnum.NotFound, data: null}
        if (session.userId.toString() != userId) return {status: ResultNotificationEnum.Forbidden, data: null}

        await this.authRepositories.delete(session)
        return {status: ResultNotificationEnum.Success, data: null}
    }

    async deleteAllSessionExcludeCurrent(token: string): Promise<ResultNotificationType> {
        const authByJWT: ResultNotificationType<RefreshAuthOutputModelDto | null> = await this.authService.jwtRefreshTokenAuth(token)
        if (authByJWT.status !== ResultNotificationEnum.Success) return {
            status: ResultNotificationEnum.Unauthorized,
            data: null
        }
        const {userId, deviceId} = authByJWT.data!.refreshJWTPayload

        const sessions: HydratedDocument<SessionDto, ISessionInstanceMethods>[] | null = await this.authRepositories.getSessionsByUserId(userId)

        if (!sessions) return {status: ResultNotificationEnum.NotFound, data: null}
        await this.authRepositories.deleteSessions(
            sessions.filter(dId => dId.dId != deviceId).map(items => items._id)
        )

        return {status: ResultNotificationEnum.Success, data: null}
    }
}