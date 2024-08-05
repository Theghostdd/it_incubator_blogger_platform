import {
    ResultNotificationEnum,
    ResultNotificationType
} from "../../../typings/basic-types";
import {JWTService} from "../../../internal/application/jwt/application/jwt";
import {compareAsc} from "date-fns";
import {UserRepositories} from "../../user/infrastructure/user-repositories";
import {RecoveryPasswordSessionRepository} from "../infrastructure/recovery-password-session-repositories";
import {AuthRepositories} from "../infrastructure/auth-repositories";
import {inject, injectable} from "inversify";
import {AuthSessionModel} from "../domain/session-entity";
import {RecoveryPasswordSessionModel} from "../domain/recovery-password-entity";
import {UserChangePasswordInputDto, UserLoginInputDto, UserPasswordRecoveryInputDto} from "../api/input-models/dto";
import {HydratedDocument} from "mongoose";
import {RecoveryPasswordSessionDto, RefreshAuthOutputModelDto, SessionDto, UserDto} from "../domain/dto";
import {
    IRecoveryPasswordSessionInstanceMethods,
    ISessionInstanceMethods,
    IUserInstanceMethods
} from "../domain/interfaces";
import {BcryptService} from "../../../internal/application/bcrypt/bcrypt";
import {Uuid} from "../../../internal/application/uuiid/uuid";
import {AccessTokenPayloadDto, RefreshTokenPayloadDto, TokensDto} from "../../../internal/application/jwt/domain/dto";
import {AuthMailService} from "./mail-service";

@injectable()
export class AuthService {
    constructor(
        @inject(UserRepositories) private userRepositories: UserRepositories,
        @inject(RecoveryPasswordSessionRepository) private recoveryPasswordSessionRepository: RecoveryPasswordSessionRepository,
        @inject(AuthRepositories) private authRepositories: AuthRepositories,
        @inject(AuthSessionModel)private authSessionModel: typeof AuthSessionModel,
        @inject(RecoveryPasswordSessionModel) private recoveryPasswordSessionModel: typeof RecoveryPasswordSessionModel,
        @inject(BcryptService) private bcryptService: BcryptService,
        @inject(Uuid) private uuid: Uuid,
        @inject(JWTService) private jwtService: JWTService,
        @inject(AuthMailService) private authMailService: AuthMailService,
    ) {}

    async auth(userLoginDto: UserLoginInputDto, ip: string, userAgent: string): Promise<ResultNotificationType<TokensDto | null>> {

        const user: HydratedDocument<UserDto, IUserInstanceMethods> | null = await this.userRepositories.getUserByEmailOrLogin('', '', userLoginDto.loginOrEmail)
        if (!user) return {status: ResultNotificationEnum.Unauthorized, data: null}
        if (!await this.bcryptService.comparePass(userLoginDto.password, user.password)) return {status: ResultNotificationEnum.Unauthorized, data: null}
        if (!user.userConfirm.ifConfirm) return {
            status: ResultNotificationEnum.BadRequest,
            errorField: {errorsMessages: [{message: 'Email has been confirmed', field: 'code'}]},
            data: null
        }

        const deviceId: string = this.uuid.generateDeviceId(user._id.toString())
        const getTokens: TokensDto = await this.jwtService.signJWT(user._id.toString(), deviceId)
        const {iat, exp} = await this.jwtService.verifyRefreshJWTToken(getTokens.refreshToken) as RefreshTokenPayloadDto

        const session: HydratedDocument<SessionDto, ISessionInstanceMethods> = this.authSessionModel.createInstance(deviceId, user._id.toString(), userAgent, ip, iat, exp)

        await this.authRepositories.save(session)
        return {status: ResultNotificationEnum.Success, data: {...getTokens}}

    }

    async logout(token: string): Promise<ResultNotificationType> {
        const authByJWT: ResultNotificationType<RefreshAuthOutputModelDto | null> = await this.jwtRefreshTokenAuth(token)
        if (authByJWT.status !== ResultNotificationEnum.Success) return {status: ResultNotificationEnum.Unauthorized, data: null}
        const {sessionData: session} = authByJWT.data!

        await this.authRepositories.delete(session as HydratedDocument<SessionDto, ISessionInstanceMethods>)
        return {status: ResultNotificationEnum.Success, data: null}
    }

    async refreshToken(token: string): Promise<ResultNotificationType<TokensDto | null>> {
        const authByJWT: ResultNotificationType<RefreshAuthOutputModelDto | null> = await this.jwtRefreshTokenAuth(token)
        if (authByJWT.status !== ResultNotificationEnum.Success) return {status: ResultNotificationEnum.Unauthorized, data: null}

        const {userId, deviceId} = authByJWT.data!.refreshJWTPayload
        const session = authByJWT.data!.sessionData as  HydratedDocument<SessionDto, ISessionInstanceMethods>

        const getNewPairTokens: TokensDto = await this.jwtService.signJWT(userId.toString(), deviceId)
        const {iat, exp} = await this.jwtService.verifyRefreshJWTToken(getNewPairTokens.refreshToken) as RefreshTokenPayloadDto

        session.updateSession(iat, exp)
        await this.authRepositories.save(session)
        return {status: ResultNotificationEnum.Success, data: {...getNewPairTokens}}

    }

    async jwtRefreshTokenAuth(token: string): Promise<ResultNotificationType<RefreshAuthOutputModelDto | null>> {
        const verifyJWT = await this.jwtService.verifyRefreshJWTToken(token) as RefreshTokenPayloadDto
        if (!verifyJWT) return {status: ResultNotificationEnum.Unauthorized, data: null}
        const {iat, deviceId} = verifyJWT

        const session: HydratedDocument<SessionDto, ISessionInstanceMethods> | null = await this.authRepositories.getSessionByDeviceId(deviceId)
        if (!session) return {status: ResultNotificationEnum.Unauthorized, data: null}
        if (session.issueAt != new Date(iat * 1000).toISOString()) return {status: ResultNotificationEnum.Unauthorized, data: null}

        return {status: ResultNotificationEnum.Success, data: {refreshJWTPayload: verifyJWT, sessionData: session}}
    }

    async jwtAccessTokenAuth(token: string): Promise<ResultNotificationType<AccessTokenPayloadDto | null>> {
        const verifyJWT = await this.jwtService.verifyAccessJWTToken(token) as AccessTokenPayloadDto
        if (!verifyJWT) return {status: ResultNotificationEnum.Unauthorized, data: null}
        const {userId} = verifyJWT

        if (!await this.userRepositories.getUserById(userId)) return {status: ResultNotificationEnum.Unauthorized, data: null}
        return {status: ResultNotificationEnum.Success, data: verifyJWT}
    }

    async passwordRecovery(passwordRecoveryDto: UserPasswordRecoveryInputDto): Promise<ResultNotificationType> {
        const user: HydratedDocument<UserDto, IUserInstanceMethods> | null = await this.userRepositories.getUserByEmail(passwordRecoveryDto.email)

        const confirmCode: string = this.uuid.generateConfirmCode()

        if (user) {
            const recoverySession = this.recoveryPasswordSessionModel.createInstance(passwordRecoveryDto.email, confirmCode)
            await this.recoveryPasswordSessionRepository.save(recoverySession)
        }

        this.authMailService.sendRecoveryPasswordMail([passwordRecoveryDto.email], confirmCode)

        return {status: ResultNotificationEnum.Success, data: null}
    }

    async changeUserPassword(changePasswordDto: UserChangePasswordInputDto): Promise<ResultNotificationType> {
        const session: HydratedDocument<RecoveryPasswordSessionDto, IRecoveryPasswordSessionInstanceMethods> | null = await this.recoveryPasswordSessionRepository.getSessionByCode(changePasswordDto.recoveryCode)
        if (!session) return {
            status: ResultNotificationEnum.BadRequest,
            errorField: {errorsMessages: [{message: "Bad code", field: 'recoveryCode'}]},
            data: null
        }
        const {expAt, email} = session

        if (compareAsc(new Date(), expAt) === 1) return {
            status: ResultNotificationEnum.BadRequest,
            errorField: {errorsMessages: [{message: "Bad code", field: 'recoveryCode'}]},
            data: null
        }

        const user: HydratedDocument<UserDto, IUserInstanceMethods> | null = await this.userRepositories.getUserByEmail(email)
        if (!user) return {status: ResultNotificationEnum.BadRequest, data: null}

        const hashPass = await this.bcryptService.genSaltAndHash(changePasswordDto.newPassword)
        user.updatePassword(hashPass)
        await this.userRepositories.save(user)
        await this.recoveryPasswordSessionRepository.delete(session)
        return {status: ResultNotificationEnum.Success, data: null}
    }
}