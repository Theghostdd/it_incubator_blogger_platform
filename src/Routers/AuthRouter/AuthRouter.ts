import { Router, Request, Response } from "express";
import { ROUTERS_SETTINGS } from "../../settings";
import { AuthService } from "../../Service/AuthService/AuthService";
import { ruleBodyValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import {
    AuthModelServiceType,
    AuthOutputModelType, ChangePasswordInputViewType, PasswordRecoveryInputViewType,
    UserLoginInputViewType,
} from "../../Applications/Types-Models/Auth/AuthTypes";
import { SaveError } from "../../utils/error-utils/save-error";
import { ResultNotificationType, ResultNotificationEnum, APIErrorsMessageType } from "../../typings/basic-types";
import { UserQueryRepositories } from "../../Repositories/UserRepostitories/UserQueryRepositories";
import { AuthUser } from "../../internal/middleware/auth/UserAuth/AuthUser";
import { requestLimiter } from "../../internal/middleware/request-limit/request-limit";
import {
    RegistrationConfirmCodeType,
    RegistrationInputType, RegistrationResendConfirmCodeInputType
} from "../../Applications/Types-Models/registration/RegistrationTypes";
import {UserMeModelViewType} from "../../Applications/Types-Models/User/UserTypes";




export const AuthRouter = Router()
/*
* Limit the number of requests for the endpoint, using middleware.
* Validation of the entered data from the client.
* Sending the data entered from the user, as well as his useragent and IP address to the service for authorization.
* Return a successful result upon success.
* Return the unauthorized status when you try to enter invalid data.
* Error handling with bad data sent.
* Catches any exceptions that occur during the authentication process.
*/
AuthRouter.post(`${ROUTERS_SETTINGS.AUTH.login}`,
requestLimiter,
ruleBodyValidations.validLoginOrEmail,
ruleBodyValidations.validPassword,
inputValidation,
async (req: Request<{}, {}, UserLoginInputViewType>, res: Response<AuthOutputModelType | APIErrorsMessageType>) => {
    try {
        const result: ResultNotificationType<AuthModelServiceType> = await AuthService.AuthUser(req.body, req.ip || req.socket.remoteAddress!, req.useragent!.os || "anonyms")
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
        await SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.login}`, 'POST', 'Login the user', e)
        return res.sendStatus(500)
    }
})
/*
* Obtaining information about the current user by verifying his access token.
* Return the model, if the model was not found, return the error.
* Catches any exceptions that occur during the process.
*/
AuthRouter.get(`${ROUTERS_SETTINGS.AUTH.me}`, 
AuthUser.AuthUserByAccessToken,
async (req: Request, res: Response<UserMeModelViewType>) => {
    try {
        const result: UserMeModelViewType | null = await UserQueryRepositories.GetUserByIdAuthMe(req.user.userId)
        return result ? res.status(200).json(result) : res.sendStatus(404)
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.me}`, 'GET', 'Get information about current user by accessToken.', e)
        return res.sendStatus(500)
    }
})
/*
* Limit the number of requests for the endpoint, using middleware.
* Validation of the entered data from the client.
* Sending the entered data to the service for user registration.
* Return of the corresponding status upon receiving a response from the service.
* Catches any exceptions that occur during the registration process, return error 500.
*/
AuthRouter.post(`${ROUTERS_SETTINGS.AUTH.registration}`, 
requestLimiter,
ruleBodyValidations.validLogin,
ruleBodyValidations.validEmail,
ruleBodyValidations.validPassword,
inputValidation,
async (req: Request<{}, {}, RegistrationInputType>, res: Response<APIErrorsMessageType>) => {
    try {
        const result: ResultNotificationType = await AuthService.RegistrationUser(req.body)
        switch(result.status) {
            case ResultNotificationEnum.Success:
                return res.sendStatus(204);
            case ResultNotificationEnum.BadRequest: 
                return res.status(400).json(result.errorField);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.registration}`, 'POST', 'registration new user', e)
        return res.sendStatus(500)
    }
})
/*
* Limit the number of requests for the endpoint, using middleware.
* Validation of the entered data from the client.
* Sending the entered data to the service for user registration confirm.
* Return of the corresponding status upon receiving a response from the service.
* Catches any exceptions that occur during the registration process, return error 500.
*/
AuthRouter.post(`${ROUTERS_SETTINGS.AUTH.registration_confirmation}`, 
requestLimiter,
ruleBodyValidations.validConfirmCode,
inputValidation,
async (req: Request<{}, {}, RegistrationConfirmCodeType>, res: Response<APIErrorsMessageType>) => {
    try {
        const result: ResultNotificationType = await AuthService.RegistrationUserConfirmUserByEmail(req.body)
        switch(result.status) {
            case ResultNotificationEnum.Success:
                return res.sendStatus(204);
            case ResultNotificationEnum.BadRequest: 
                return res.status(400).json(result.errorField);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.registration}`, 'POST', 'Confirm new user by email', e)
        return res.sendStatus(500)
    }
})
/*
* Limit the number of requests for the endpoint, using middleware.
* Validation of the entered data from the client.
* Sending the entered data to the service for user registration confirm resend email.
* Return of the corresponding status upon receiving a response from the service.
* Catches any exceptions that occur during the registration process, return error 500.
*/
AuthRouter.post(`${ROUTERS_SETTINGS.AUTH.registration_email_resending}`, 
requestLimiter,
ruleBodyValidations.validEmail,
inputValidation,
async (req: Request<{}, {}, RegistrationResendConfirmCodeInputType>, res: Response<APIErrorsMessageType>) => {
    try {
        const result: ResultNotificationType = await AuthService.RegistrationResendConfirmCodeToEmail(req.body)
        switch(result.status) {
            case ResultNotificationEnum.Success:
                return res.sendStatus(204);
            case ResultNotificationEnum.BadRequest: 
                return res.status(400).json(result.errorField);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.registration}`, 'POST', 'Reconfirm user by email', e)
        return res.sendStatus(500)
    }
})
/*
* Receiving a token from the cookie and sending this token to the service to issue a new pair of tokens.
* With a hasty response from the service, the return of a new pair of tokens, Refresh in Access cookies in JSON format.
* Processing other responses when responding from the service.
* Catches any exceptions that occur during the registration process, return error 500.
*/
AuthRouter.post(`${ROUTERS_SETTINGS.AUTH.refresh_token}`,
async (req: Request, res: Response<AuthOutputModelType>) => {
    try {
        const result: ResultNotificationType<AuthModelServiceType> = await AuthService.RefreshToken(req.cookies.refreshToken)
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
        await SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.refresh_token}`, 'POST', 'Send to clint new pair access and refresh token', e)
        return res.sendStatus(500)
    }
})
/*
* Getting a token from the cookie, for the user's logout (Deleting the session).
* Upon successful response, the token is deleted from the cookie.
* Processing other responses from the service.
* Catches any exceptions that occur during the process of resending the confirmation code return error 500.
*/
AuthRouter.post(`${ROUTERS_SETTINGS.AUTH.logout}`,
async (req: Request, res: Response) => {
    try {
        const result: ResultNotificationType = await AuthService.LogOut(req.cookies.refreshToken)
        switch (result.status) {
            case ResultNotificationEnum.Success:
                res.clearCookie('refreshToken')
                return res.sendStatus(204)
            case ResultNotificationEnum.Unauthorized:
                return res.sendStatus(401);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.logout}`, 'POST', 'Logout client and revoked token', e)
        return res.sendStatus(500)
    }
})
/*
* Validation of data sent from the client.
* Data transfer to the service for password recovery logic.
* Processing other responses from the service.
* Catches any exceptions that occur during the process of resending the confirmation code return error 500.
*/
AuthRouter.post(`${ROUTERS_SETTINGS.AUTH.password_recovery}`,
    requestLimiter,
    ruleBodyValidations.validEmail,
    inputValidation,
    async (req: Request<{}, {}, PasswordRecoveryInputViewType>, res: Response) => {
        try {
            const result: ResultNotificationType = await AuthService.PasswordRecovery(req.body)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    return res.sendStatus(204)
                default:
                    return res.sendStatus(500)
            }
        } catch (e) {
            await SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.password_recovery}`, 'POST', 'Recovery password', e)
            return res.sendStatus(500)
        }
})
/*
* Validation of data sent from the client.
* Data transfer to the service for change the password for user.
* Processing other responses from the service.
* Catches any exceptions that occur during the process of resending the confirmation code return error 500.
*/
AuthRouter.post(`${ROUTERS_SETTINGS.AUTH.new_password}`,
    requestLimiter,
    ruleBodyValidations.validNewPassword,
    ruleBodyValidations.validRecoveryCode,
    inputValidation,
    async (req: Request<{}, {}, ChangePasswordInputViewType>, res: Response<APIErrorsMessageType>) => {
        try {
            const result: ResultNotificationType<APIErrorsMessageType> = await AuthService.ChangeUserPassword(req.body)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    return res.sendStatus(204);
                case ResultNotificationEnum.BadRequest:
                    return res.status(400).json(result.errorField);
                default:
                    return res.sendStatus(500)
            }
        } catch (e) {
            await SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.new_password}`, 'POST', 'Change password for user', e)
            return res.sendStatus(500)
        }
})
