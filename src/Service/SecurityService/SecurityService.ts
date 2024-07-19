import { credentialJWT } from "../../Applications/JWT/jwt"
import { RefreshAuthOutputModelType, SessionOutputModelViewType, SessionsMongoViewType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { DeletedMongoSuccessType, ResultNotificationEnum, ResultNotificationType } from "../../Applications/Types-Models/BasicTypes"
import { AuthRepositories } from "../../Repositories/AuthRepositories/AuthRepositories"
import { SecurityMapper } from "../../Utils/map/Security/SecurityMap"
import { AuthService } from "../AuthService/AuthService"





export const SecurityService = {
    /*
    * 1. Validates the token using `AuthService.JWTRefreshTokenAuth` to ensure it is authorized.
    * 2. Extracts `userId` from the verified token.
    * 3. Retrieves the session from the database associated with the `dId` using `AuthRepositories.GetSessionByDeviceId`.
    *    - If no session is found (`GetSession` is `null`), returns a result with status `ResultNotificationEnum.NotFound`.
    *    - If the session's `userId` does not match the `userId` extracted from the token, returns a result with status `ResultNotificationEnum.Forbidden`.
    * 4. Deletes the session from the database using `AuthRepositories.DeleteSessionById`.
    *    - If the session deletion fails (no matching session found), returns a result with status `ResultNotificationEnum.NotFound`.
    * 5. If the session is successfully deleted, returns a result with status `ResultNotificationEnum.Success`.
    * 6. Catches any exceptions that occur during the process and throws a new error.
    */
    async DeleteSessionByDeviceId (dId: string, token: string): Promise<ResultNotificationType> {
        try {
            const AuthByJWT: ResultNotificationType<RefreshAuthOutputModelType> = await AuthService.JWTRefreshTokenAuth(token)
            if (AuthByJWT.status !== ResultNotificationEnum.Success) return {status: ResultNotificationEnum.Unauthorized}
            const { userId } = AuthByJWT.data!.RefreshJWTPayload

            const GetSession: SessionsMongoViewType | null = await AuthRepositories.GetSessionByDeviceId(dId)
            if (!GetSession) return {status: ResultNotificationEnum.NotFound}
            if (GetSession.userId.toString() != userId) return {status: ResultNotificationEnum.Forbidden}

            const DeleteSession: DeletedMongoSuccessType = await AuthRepositories.DeleteSessionById(GetSession._id.toString())
            if (DeleteSession.deletedCount <= 0) return {status: ResultNotificationEnum.NotFound}

            return {status: ResultNotificationEnum.Success}
        } catch(e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Validates the token using `AuthService.JWTRefreshTokenAuth` to ensure it is authorized.
    * 2. Extracts `userId` and `deviceId` from the verified token.
    * 3. Retrieves all sessions associated with the `userId` from the database using `AuthRepositories.GetAllSessionsByUserId`.
    *    - If no sessions are found (`GetSessions` is `null`), returns a result with status `ResultNotificationEnum.NotFound`.
    * 4. Maps the session IDs (`_id`) of sessions that do not match the current `deviceId` to be deleted.
    * 5. Deletes the mapped sessions from the database using `AuthRepositories.DeleteSessionsById`.
    *    - If no sessions are deleted (`DeleteSessions.deletedCount` is `<= 0`), returns a result with status `ResultNotificationEnum.NotFound`.
    * 6. If sessions are successfully deleted, returns a result with status `ResultNotificationEnum.Success`.
    * 7. Catches any exceptions that occur during the process and throws a new error.
    */
    async DeleteAllSessionExcludeCurrent (token: string): Promise<ResultNotificationType> {
        try {
            const AuthByJWT: ResultNotificationType<RefreshAuthOutputModelType> = await AuthService.JWTRefreshTokenAuth(token)
            if (AuthByJWT.status !== ResultNotificationEnum.Success) return {status: ResultNotificationEnum.Unauthorized}
            const { userId, deviceId} = AuthByJWT.data!.RefreshJWTPayload

            const GetSessions: SessionsMongoViewType[] | null = await AuthRepositories.GetAllSessionsByUserIdWithOutMap(userId)

            if (!GetSessions) return {status: ResultNotificationEnum.NotFound}
            const mapId = GetSessions.filter(dId => dId.dId != deviceId).map(items => items._id)
            const DeleteSessions: DeletedMongoSuccessType = await AuthRepositories.DeleteSessionsById(mapId)
            if (DeleteSessions.deletedCount <= 0) return {status: ResultNotificationEnum.NotFound}

            return {status: ResultNotificationEnum.Success}
        } catch(e: any) {
            throw new Error(e)
        }
    },
}