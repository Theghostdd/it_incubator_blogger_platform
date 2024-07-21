import { RefreshAuthOutputModelType, SessionsMongoViewType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { ResultNotificationEnum, ResultNotificationType } from "../../Applications/Types-Models/BasicTypes"
import { AuthRepositories } from "../../Repositories/AuthRepositories/AuthRepositories"
import { AuthService } from "../AuthService/AuthService"



export const SecurityService = {
    /*
    * Refresh Token Verification. If verification was failed, the validation error is returned.
    * Getting a session by device id.
    * If the error was not found, the error is returned.
    * If a session has been found, but it does not belong to the current user, a rights conflict error is returned.
    * Deleting a session by its ID.
    * Catches any exceptions that occur during the process and throws a new error.
    */
    async DeleteSessionByDeviceId (dId: string, token: string): Promise<ResultNotificationType> {
        try {
            const AuthByJWT: ResultNotificationType<RefreshAuthOutputModelType> = await AuthService.JWTRefreshTokenAuth(token)
            if (AuthByJWT.status !== ResultNotificationEnum.Success) return {status: ResultNotificationEnum.Unauthorized}
            const { userId } = AuthByJWT.data!.RefreshJWTPayload

            const GetSession: SessionsMongoViewType | null = await AuthRepositories.GetSessionByDeviceId(dId)
            if (!GetSession) return {status: ResultNotificationEnum.NotFound}
            if (GetSession.userId.toString() != userId) return {status: ResultNotificationEnum.Forbidden}

            await AuthRepositories.DeleteSessionById(GetSession._id.toString())
            return {status: ResultNotificationEnum.Success}
        } catch(e: any) {
            throw new Error(e)
        }
    },
    /*
    * Refresh Token Verification.
    * If verification was failed, the validation error is returned.
    * Getting all user sessions. If no sessions were found, an error is returned.
    * Conversion to a new array of IDs to end all sessions excluding the current session from the new array.
    * Termination of all sessions except the current one.
    * Catches any exceptions that occur during the process and throws a new error.
    */
    async DeleteAllSessionExcludeCurrent (token: string): Promise<ResultNotificationType> {
        try {
            const AuthByJWT: ResultNotificationType<RefreshAuthOutputModelType> = await AuthService.JWTRefreshTokenAuth(token)
            if (AuthByJWT.status !== ResultNotificationEnum.Success) return {status: ResultNotificationEnum.Unauthorized}
            const { userId, deviceId} = AuthByJWT.data!.RefreshJWTPayload

            const GetSessions: SessionsMongoViewType[] | null = await AuthRepositories.GetAllSessionsByUserId(userId)
            if (!GetSessions) return {status: ResultNotificationEnum.NotFound}

            const mapId = GetSessions.filter(dId => dId.dId != deviceId).map(items => items._id)
            await AuthRepositories.DeleteSessionsById(mapId)

            return {status: ResultNotificationEnum.Success}
        } catch(e: any) {
            throw new Error(e)
        }
    },
}