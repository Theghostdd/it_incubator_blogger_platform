import {Request, Response} from "express";
import {APIErrorsMessageType, ResultNotificationEnum, ResultNotificationType} from "../../typings/basic-types";
import {ROUTERS_SETTINGS} from "../../settings";
import {UserQueryRepositories} from "../user/user-query-repositories";
import {UserMeModelViewType} from "../user/user-types";
import {saveError} from "../../internal/utils/error-utils/save-error";
import {
    RegistrationConfirmCodeType,
    RegistrationInputType,
    RegistrationResendConfirmCodeInputType
} from "./registartion/registration-types";
import {RegistrationService} from "./registartion/registration-service";
import {
    AuthModelServiceType,
    AuthOutputModelType,
    ChangePasswordInputViewType,
    PasswordRecoveryInputViewType,
    UserLoginInputViewType
} from "./auth/auth-types";
import {AuthService} from "./auth/auth-service";


export class AuthController {
    constructor(
        protected authService: AuthService,
        protected registrationService: RegistrationService,
        protected userQueryRepositories: UserQueryRepositories,
    ) {
    }
    async login (req: Request<{}, {}, UserLoginInputViewType>, res: Response<AuthOutputModelType | APIErrorsMessageType>) {
        try {
            const result: ResultNotificationType<AuthModelServiceType> = await this.authService.auth(req.body, req.ip || req.socket.remoteAddress!, req.useragent!.os || "anonyms")
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    const {refreshToken, ...data} = result.data!
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: true
                    });
                    return res.status(200).json(data)
                case ResultNotificationEnum.Unauthorized:
                    return res.sendStatus(401);
                case ResultNotificationEnum.BadRequest:
                    return res.status(400).json(result.errorField)
                default: return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.login}`, 'POST', 'Login the user', e)
            return res.sendStatus(500)
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const result: ResultNotificationType = await this.authService.logout(req.cookies.refreshToken)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    res.clearCookie('refreshToken')
                    return res.sendStatus(204)
                case ResultNotificationEnum.Unauthorized:
                    return res.sendStatus(401);
                default: return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.logout}`, 'POST', 'Logout client and revoked token', e)
            return res.sendStatus(500)
        }
    }

    async registrationUser(req: Request<{}, {}, RegistrationInputType>, res: Response<APIErrorsMessageType>) {
        try {
            const result: ResultNotificationType = await this.registrationService.registrationUser(req.body)
            switch(result.status) {
                case ResultNotificationEnum.Success:
                    return res.sendStatus(204);
                case ResultNotificationEnum.BadRequest:
                    return res.status(400).json(result.errorField);
                default: return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.registration}`, 'POST', 'registration new user', e)
            return res.sendStatus(500)
        }
    }

    async registrationUserConfirm(req: Request<{}, {}, RegistrationConfirmCodeType>, res: Response<APIErrorsMessageType>) {
        try {
            const result: ResultNotificationType = await this.registrationService.registrationUserConfirmUserByEmail(req.body)
            switch(result.status) {
                case ResultNotificationEnum.Success:
                    return res.sendStatus(204);
                case ResultNotificationEnum.BadRequest:
                    return res.status(400).json(result.errorField);
                default: return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.registration}`, 'POST', 'Confirm new user by email', e)
            return res.sendStatus(500)
        }
    }

    async registrationUserResendConfirmationCode (req: Request<{}, {}, RegistrationResendConfirmCodeInputType>, res: Response<APIErrorsMessageType>) {
        try {
            const result: ResultNotificationType = await this.registrationService.registrationResendConfirmCodeToEmail(req.body)
            switch(result.status) {
                case ResultNotificationEnum.Success:
                    return res.sendStatus(204);
                case ResultNotificationEnum.BadRequest:
                    return res.status(400).json(result.errorField);
                default: return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.registration}`, 'POST', 'Reconfirm user by email', e)
            return res.sendStatus(500)
        }
    }

    async refreshToken(req: Request, res: Response<AuthOutputModelType>) {
        try {
            const result: ResultNotificationType<AuthModelServiceType> = await this.authService.refreshToken(req.cookies.refreshToken)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    const {refreshToken, ...data} = result.data!
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: true
                    });
                    return res.status(200).json(data)
                case ResultNotificationEnum.Unauthorized:
                    return res.sendStatus(401);
                default: return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.refresh_token}`, 'POST', 'Send to clint new pair access and refresh token', e)
            return res.sendStatus(500)
        }
    }

    async passwordRecovery (req: Request<{}, {}, PasswordRecoveryInputViewType>, res: Response) {
        try {
            const result: ResultNotificationType = await this.authService.passwordRecovery(req.body)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    return res.sendStatus(204)
                default:
                    return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.password_recovery}`, 'POST', 'Recovery password', e)
            return res.sendStatus(500)
        }
    }

    async changePassword(req: Request<{}, {}, ChangePasswordInputViewType>, res: Response<APIErrorsMessageType>) {
        try {
            const result: ResultNotificationType<APIErrorsMessageType> = await this.authService.changeUserPassword(req.body)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    return res.sendStatus(204);
                case ResultNotificationEnum.BadRequest:
                    return res.status(400).json(result.errorField);
                default:
                    return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.new_password}`, 'POST', 'Change password for user', e)
            return res.sendStatus(500)
        }
    }

    async getInfoAboutCurrentUserByAccessToken(req: Request, res: Response<UserMeModelViewType>) {
        try {
            const result: UserMeModelViewType | null = await this.userQueryRepositories.getUserByIdAuthMe(req.user.userId)
            return result ? res.status(200).json(result) : res.sendStatus(404)
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.me}`, 'GET', 'Get information about current user by accessToken.', e)
            return res.sendStatus(500)
        }
    }
}