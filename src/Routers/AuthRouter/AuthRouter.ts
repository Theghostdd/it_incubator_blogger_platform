import { Router, Request, Response } from "express";
import { ROUTERS_SETTINGS } from "../../settings";
import { AuthService } from "../../Service/AuthService/AuthService";
import { RuleValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import { AuthModelServiceType, AuthOutputModelType, ConfirmCodeInputModelType, LoginInputModelType} from "../../Applications/Types-Models/Auth/AuthTypes";
import { SaveError } from "../../Utils/error-utils/save-error";
import { ResultNotificationType, ResultNotificationEnum, APIErrorsMessageType } from "../../Applications/Types-Models/BasicTypes";
import { UserQueryRepositories } from "../../Repositories/UserRepostitories/UserQueryRepositories";
import { UserInputModelType, UserMeModelViewType } from "../../Applications/Types-Models/User/UserTypes";
import { AuthUser } from "../../Applications/Middleware/auth/UserAuth/AuthUser";
import { ResendConfirmCodeInputType } from "../../Applications/Types-Models/Registration/RegistrationTypes";
import { requestLimiter } from "../../Applications/Middleware/request-limit/request-limit";

export const AuthRouter = Router()
/*
* 1. Validates data with use middleware.
* 2. Attempts to authenticate the user by calling service with the login data.
* 3. Handles the result returned from service:
*    - If authentication is successful (`ResultNotificationEnum.Success`), responds with status 200 and returns the authentication data (`result.data`).
*       - Destructure "result.data" and send refresh token in cookies
*    - If authentication fails due to invalid credentials (`ResultNotificationEnum.Unauthorized`), responds with status 401 (Unauthorized).
*    - For any other authentication failure, responds with status 500.
* 4. Catches any exceptions that occur during the authentication process.
*/
AuthRouter.post(`${ROUTERS_SETTINGS.AUTH.login}`,
RuleValidations.validLoginOrEmail,
RuleValidations.validPassword,
inputValidation,
requestLimiter,
async (req: Request<{}, {}, LoginInputModelType>, res: Response<AuthOutputModelType | APIErrorsMessageType>) => {
    try {
        const result: ResultNotificationType<AuthModelServiceType> = await AuthService.AuthUser(req.body)
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
        SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.login}`, 'POST', 'Login the user', e)
        return res.sendStatus(500)
    }
})
/*
* 1. Authenticates the user.
* 2. Attempts to retrieve the authenticated user's information by calling query repositories with the user ID (`req.user.userId`):
*    - The user ID is extracted from the authenticated user's access token.
*    - The method returns user details or `null` if the user is not found.
* 3. Handles the result returned from `UserQueryRepositories.GetUserByIdAuthMe`:
*    - If the user is found, responds with status 200 and returns the user's details in JSON format.
*    - If no user is found, responds with status 404 (Not Found).
* 4. Catches any exceptions that occur during the process.
*/
AuthRouter.get(`${ROUTERS_SETTINGS.AUTH.me}`, 
AuthUser.AuthUserByAccessToken,
async (req: Request, res: Response<UserMeModelViewType>) => {
    try {
        const result: UserMeModelViewType | null = await UserQueryRepositories.GetUserByIdAuthMe(req.user.userId)
        return result ? res.status(200).json(result) : res.sendStatus(404)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.me}`, 'GET', 'Get information about current user by accessToken.', e)
        return res.sendStatus(500)
    }
})
/*
* 1. Validation includes data into middleware.
* 2. Calls service to register the user.
* 4. Processes the result returned by `AuthService.RegistrationUser`:
*    - If `result.status` equals `ResultNotificationEnum.Success`, it returns a 204 status (No Content), indicating successful registration.
*    - If `result.status` equals `ResultNotificationEnum.BadRequest`, it returns a 400 status (Bad Request) and the error details in JSON format (`result.errorField`).
*    - For any other status values, it returns a 500 status (Internal Server Error).
* 5. Catches any exceptions that occur during the registration process, return error 500.
*/
AuthRouter.post(`${ROUTERS_SETTINGS.AUTH.registration}`, 
RuleValidations.validLogin,
RuleValidations.validEmail,
RuleValidations.validPassword,
inputValidation,
async (req: Request<{}, {}, UserInputModelType>, res: Response) => {
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
        SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.registration}`, 'POST', 'Registration new user', e)
        return res.sendStatus(500)
    }
})
/*
* 1. Validation data into middleware.
* 2. Calls service to confirm the user's registration:
* 3. Processes the result returned by `AuthService.RegistrationUserConfirmUserByEmail`:
*    - If `result.status` equals `ResultNotificationEnum.Success`, it returns a 204 status (No Content), indicating successful confirmation.
*    - If `result.status` equals `ResultNotificationEnum.BadRequest`, it returns a 400 status (Bad Request) and the error details in JSON format (`result.errorField`).
*    - For any other status values, it returns a 500 status (Internal Server Error).
* 4. Catches any exceptions that occur during the confirmation process return error 500.
*/
AuthRouter.post(`${ROUTERS_SETTINGS.AUTH.registration_confirmation}`, 
requestLimiter,
RuleValidations.validConfirmCode,
inputValidation,
async (req: Request<{}, {}, ConfirmCodeInputModelType>, res: Response) => {
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
        SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.registration}`, 'POST', 'Confirm new user by email', e)
        return res.sendStatus(500)
    }
})
/*
* 1. Validation data into middleware.
* 2. Calls service to resend the confirmation code:
* 3. Processes the result returned by `AuthService.RegistrationResendConfirmCodeToEmail`:
*    - If `result.status` equals `ResultNotificationEnum.Success`, it returns a 204 status (No Content), indicating that the confirmation code was successfully resent.
*    - If `result.status` equals `ResultNotificationEnum.BadRequest`, it returns a 400 status (Bad Request) and the error details in JSON format (`result.errorField`).
*    - For any other status values, it returns a 500 status (Internal Server Error).
* 4. Catches any exceptions that occur during the process of resending the confirmation code return error 500.
*/
AuthRouter.post(`${ROUTERS_SETTINGS.AUTH.registration_email_resending}`, 
RuleValidations.validEmail,
inputValidation,
async (req: Request<{}, {}, ResendConfirmCodeInputType>, res: Response) => {
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
        SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.registration}`, 'POST', 'Reconfirm user by email', e)
        return res.sendStatus(500)
    }
})
/*
* 1. Attempts to refresh the authentication token using the refresh token provided in the request cookies.
* 2. Calls the service with the refresh token to obtain a new set of tokens.
* 3. Handles the result returned from the service:
*    - If the refresh is successful (`ResultNotificationEnum.Success`), responds with status 200 and returns the new authentication data (`result.data`).
*       - Destructures the new refresh token from "result.data" and sets it in the cookies.
*    - If the refresh fails due to invalid credentials (`ResultNotificationEnum.Unauthorized`), responds with status 401 (Unauthorized).
*    - For any other failure, responds with status 500.
* 4. Catches any exceptions that occur during the process of resending the confirmation code return error 500.
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
        SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.refresh_token}`, 'POST', 'Send to clint new pair access and refresh token', e)
        return res.sendStatus(500)
    }
})
/*
* 1. Attempts to log out the user using the refresh token provided in the request cookies.
* 2. Calls the service with the refresh token to revoke the user's session.
* 3. Handles the result returned from the service:
*    - If the logout is successful (`ResultNotificationEnum.Success`), clears the `refreshToken` cookie and responds with status 204 (No Content).
*    - If the logout fails due to invalid credentials (`ResultNotificationEnum.Unauthorized`), responds with status 401 (Unauthorized).
*    - For any other failure, responds with status 500.
* 4. Catches any exceptions that occur during the process of resending the confirmation code return error 500.
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
        SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.logout}`, 'POST', 'Logout client and revoked token', e)
        return res.sendStatus(500)
    }
})