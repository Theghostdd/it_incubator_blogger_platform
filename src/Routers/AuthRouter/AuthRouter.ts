import { Router, Request, Response } from "express";
import { ROUTERS_SETTINGS } from "../../settings";
import { AuthService } from "../../Service/AuthService/AuthService";
import { RuleValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import { AuthOutputModelType, LoginInputModelType} from "../../Applications/Types-Models/Auth/AuthTypes";
import { SaveError } from "../../Utils/error-utils/save-error";
import { ResultNotificationType, ResultNotificationEnum } from "../../Applications/Types-Models/BasicTypes";
import { UserQueryRepositories } from "../../Repositories/UserRepostitories/UserQueryRepositories";
import { UserInputModelType, UserMeModelViewType } from "../../Applications/Types-Models/User/UserTypes";
import { AuthUser } from "../../Applications/Middleware/auth/UserAuth/AuthUser";

export const AuthRouter = Router()
/*
* 1. Validates data with use middleware.
* 2. Attempts to authenticate the user by calling service with the login data.
* 3. Handles the result returned from service:
*    - If authentication is successful (`ResultNotificationEnum.Success`), responds with status 200 and returns the authentication data (`result.data`).
*    - If authentication fails due to invalid credentials (`ResultNotificationEnum.Unauthorized`), responds with status 401 (Unauthorized).
*    - For any other authentication failure, responds with status 500.
* 4. Catches any exceptions that occur during the authentication process.
*/
AuthRouter.post(`${ROUTERS_SETTINGS.AUTH.login}`,
RuleValidations.validLoginOrEmail,
RuleValidations.validPassword,
inputValidation,
async (req: Request<{}, {}, LoginInputModelType>, res: Response<AuthOutputModelType>) => {
    try {
        const result: ResultNotificationType<AuthOutputModelType> = await AuthService.AuthUser(req.body)
        switch (result.status) {
            case ResultNotificationEnum.Success:
                res.status(200).json(result.data)
                break;
            case ResultNotificationEnum.Unauthorized:
                res.sendStatus(401)
                break;
            default: res.sendStatus(500)
        }
        return;
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