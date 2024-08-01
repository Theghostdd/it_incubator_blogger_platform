import {ResultNotificationEnum, ResultNotificationType} from "../../typings/basic-types";
import {AuthRepositories} from "../auth-registration/infrastructure/auth-repositories";
import {AuthService} from "../auth-registration/application/auth-service";
import {RefreshAuthOutputModelType, SessionsMongoViewType} from "../auth-registration/auth-types";
import {AuthSessionModel} from "../../Domain/Auth/Auth";


export class SecurityDeviceService {

    constructor(
        protected authRepositories: AuthRepositories,
        protected authService: AuthService,
    ) {
    }

    async deleteSessionByDeviceId (dId: string, token: string): Promise<ResultNotificationType> {
        try {
            const authByJWT: ResultNotificationType<RefreshAuthOutputModelType> = await this.authService.jwtRefreshTokenAuth(token)
            if (authByJWT.status !== ResultNotificationEnum.Success) return {status: ResultNotificationEnum.Unauthorized}
            const { userId } = authByJWT.data!.refreshJWTPayload

            const session: InstanceType<typeof AuthSessionModel> | null = await this.authRepositories.getSessionByDeviceId(dId)
            if (!session) return {status: ResultNotificationEnum.NotFound}
            if (session.userId.toString() != userId) return {status: ResultNotificationEnum.Forbidden}

            await this.authRepositories.deleteSession(session)
            return {status: ResultNotificationEnum.Success}
        } catch(e: any) {
            throw new Error(e)
        }
    }

    async deleteAllSessionExcludeCurrent (token: string): Promise<ResultNotificationType> {
        try {
            const authByJWT: ResultNotificationType<RefreshAuthOutputModelType> = await this.authService.jwtRefreshTokenAuth(token)
            if (authByJWT.status !== ResultNotificationEnum.Success) return {status: ResultNotificationEnum.Unauthorized}
            const { userId, deviceId} = authByJWT.data!.refreshJWTPayload

            const sessions: SessionsMongoViewType[] | null = await this.authRepositories.getSessionsByUserId(userId)

            if (!sessions) return {status: ResultNotificationEnum.NotFound}
            await this.authRepositories.deleteSessions(
                sessions.filter(dId => dId.dId != deviceId).map(items => items._id)
            )

            return {status: ResultNotificationEnum.Success}
        } catch(e: any) {
            throw new Error(e)
        }
    }
}