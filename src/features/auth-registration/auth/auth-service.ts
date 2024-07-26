import {
    APIErrorsMessageType, JWTAccessTokenType,
    JWTRefreshPayloadType, PatternMailType,
    ResultNotificationEnum,
    ResultNotificationType
} from "../../../typings/basic-types";
import {bcryptService} from "../../../internal/application/bcrypt/bcrypt";
import {credentialJWT} from "../../../internal/application/jwt/jwt";
import {addMinutes, compareAsc} from "date-fns";
import {patternsMailService} from "../../../internal/application/nodlemailer/patterns/patterns";
import {UserViewMongoType} from "../../user/user-types";
import {
    AuthModelServiceType, ChangePasswordInputViewType,
    PasswordRecoveryInputViewType, RefreshAuthOutputModelType,
    SessionsInputViewType,
    UserLoginInputViewType
} from "./auth-types";
import {UserRepositories} from "../../user/user-repositories";
import {UserModel} from "../../../Domain/User/User";
import {generateUuid} from "../../../internal/utils/generate-uuid/generate-uuid";
import {RecoveryPasswordSessionModel} from "../../../Domain/RecoveryPasswordSession/RecoveryPasswordSession";
import {saveError} from "../../../internal/utils/error-utils/save-error";
import {RecoveryPasswordSessionRepository} from "./recovery-password-session-repositories";
import {AuthSessionModel} from "../../../Domain/Auth/Auth";
import {AuthRepositories} from "./auth-repositories";
import {nodemailerService} from "../../../internal/application/nodlemailer/nodemailer";


export class AuthService {
    constructor(
        protected userRepositories: UserRepositories,
        protected recoveryPasswordSessionRepository: RecoveryPasswordSessionRepository,
        protected authRepositories: AuthRepositories,
        protected authSessionModel: typeof AuthSessionModel,
        protected userModel: typeof UserModel,
        protected recoveryPasswordSessionModel: typeof RecoveryPasswordSessionModel
    ) {
    }
    async auth(data: UserLoginInputViewType, ip: string, userAgent: string): Promise<ResultNotificationType<AuthModelServiceType>> {
        try {
            const user: UserViewMongoType | null = await this.userRepositories.getUserByEmailOrLogin('', '', data.loginOrEmail)
            if (!user) return {status: ResultNotificationEnum.Unauthorized}
            if (!await bcryptService.comparePass(data.password, user.password)) return {status: ResultNotificationEnum.Unauthorized}
            if (!user.userConfirm.ifConfirm) return {
                status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages: [
                        {
                            message: 'Email has been confirmed',
                            field: 'code'
                        }
                    ]
                }
            }


            const dId: string = generateUuid.generateDeviceId(user._id.toString())
            const getTokens: AuthModelServiceType = await credentialJWT.signJWT(user._id.toString(), dId)
            const {iat, exp} = await credentialJWT.verifyJWTrefresh(getTokens.refreshToken) as JWTRefreshPayloadType

            const sessionData: SessionsInputViewType = {
                dId: dId,
                userId: user._id.toString(),
                deviceName: userAgent,
                ip: ip,
                issueAt: new Date(iat * 1000).toISOString(),
                expAt: new Date(exp * 1000).toISOString()
            }
            await this.authRepositories.saveSession(new this.authSessionModel(sessionData))
            return {status: ResultNotificationEnum.Success, data: {...getTokens}}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async logout(token: string): Promise<ResultNotificationType> {
        try {
            const authByJWT: ResultNotificationType<RefreshAuthOutputModelType> = await this.jwtRefreshTokenAuth(token)
            if (authByJWT.status !== ResultNotificationEnum.Success) return {status: ResultNotificationEnum.Unauthorized}
            const { sessionData: session} = authByJWT.data!

            await this.authRepositories.deleteSession(session as InstanceType<typeof AuthSessionModel>)
            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async refreshToken(token: string): Promise<ResultNotificationType<AuthModelServiceType>> {
        try {
            const authByJWT: ResultNotificationType<RefreshAuthOutputModelType> = await this.jwtRefreshTokenAuth(token)
            if (authByJWT.status !== ResultNotificationEnum.Success) return {status: ResultNotificationEnum.Unauthorized}

            const {userId, deviceId} = authByJWT.data!.refreshJWTPayload
            const {sessionData: session} = authByJWT.data!

            const getNewPairTokens: AuthModelServiceType = await credentialJWT.signJWT(userId.toString(), deviceId)
            const {iat, exp} = await credentialJWT.verifyJWTrefresh(getNewPairTokens.refreshToken) as JWTRefreshPayloadType

            session.issueAt = new Date(iat * 1000).toISOString()
            session.expAt = new Date(exp * 1000).toISOString()

            await this.authRepositories.saveSession(session as InstanceType<typeof AuthSessionModel>)
            return {status: ResultNotificationEnum.Success, data: {...getNewPairTokens}}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async jwtRefreshTokenAuth(token: string): Promise<ResultNotificationType<RefreshAuthOutputModelType>> {
        try {
            const verifyJWT: any = await credentialJWT.verifyJWTrefresh(token)
            if (!verifyJWT) return {status: ResultNotificationEnum.Unauthorized}
            const { iat, deviceId } = verifyJWT

            const session: InstanceType<typeof AuthSessionModel> | null = await this.authRepositories.getSessionByDeviceId(deviceId)
            if (!session) return {status: ResultNotificationEnum.Unauthorized}
            if (session.issueAt != new Date(iat * 1000).toISOString()) return {status: ResultNotificationEnum.Unauthorized}

            return {status: ResultNotificationEnum.Success, data: {refreshJWTPayload: verifyJWT, sessionData: session}}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async jwtAccessTokenAuth(token: string): Promise<ResultNotificationType<JWTAccessTokenType>> {
        try {
            const verifyJWT = await credentialJWT.verifyJWT(token) as JWTAccessTokenType
            if (!verifyJWT) return {status: ResultNotificationEnum.Unauthorized}
            const { userId } = verifyJWT

            const user: InstanceType<typeof UserModel> | null = await this.userRepositories.getUserById(userId)
            if (!user) return {status: ResultNotificationEnum.Unauthorized}

            return {status: ResultNotificationEnum.Success, data: verifyJWT}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async passwordRecovery (data: PasswordRecoveryInputViewType): Promise<ResultNotificationType> {
        try {
            const user: InstanceType<typeof UserModel> | null = await this.userRepositories.getUserByEmail(data.email)

            const confirmCode: string = generateUuid.generateConfirmCode()
            const recoverCreateData = {
                email: data.email,
                code: confirmCode,
                expAt: addMinutes(new Date(), 20).toISOString()
            }

            if (user) await this.recoveryPasswordSessionRepository.save(new this.recoveryPasswordSessionModel(recoverCreateData))

            const getPatternMail: PatternMailType = await patternsMailService.recoveryPasswordMail(confirmCode)
            nodemailerService.sendEmail([data.email], getPatternMail.subject, getPatternMail.html)
                .catch((err: any) => {
                    saveError("Send Email", "SMTP", "Send link for password recovery", err)
                })

            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async changeUserPassword (data: ChangePasswordInputViewType): Promise<ResultNotificationType<APIErrorsMessageType>> {
        try {
            const recoverySession: InstanceType<typeof RecoveryPasswordSessionModel> | null = await this.recoveryPasswordSessionRepository.getSessionByCode(data.recoveryCode)
            if (!recoverySession) return {status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages:[{message: "Bad code", field: 'recoveryCode'}]
                }}
            const { expAt, email} = recoverySession

            if (compareAsc(new Date(), expAt) === 1) return {status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages:[{message: "Bad code", field: 'recoveryCode'}]
                }}

            const user: InstanceType<typeof UserModel> | null = await this.userRepositories.getUserByEmail(email)
            if (!user) return {status: ResultNotificationEnum.BadRequest}

            user.password = await bcryptService.genSaltAndHash(data.newPassword)
            await this.userRepositories.save(user)
            await this.recoveryPasswordSessionRepository.delete(recoverySession)
            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}