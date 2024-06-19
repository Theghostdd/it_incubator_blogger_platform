import { Router, Request, Response } from "express";
import { ROUTERS_SETTINGS } from "../../settings";
import { AuthService } from "../../Service/AuthService/AuthService";
import { RuleValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import { AuthOutputModelType, LoginInputModelType} from "../../Applications/Types-Models/Auth/AuthTypes";
import { SaveError } from "../../Utils/error-utils/save-error";
import { ResultNotificationType, ResultNotificationEnum } from "../../Applications/Types-Models/BasicTypes";
import { UserQueryRepositories } from "../../Repositories/UserRepostitories/UserQueryRepositories";
import { UserMeModelViewType } from "../../Applications/Types-Models/User/UserTypes";
import { AuthUser } from "../../Applications/Middleware/auth/UserAuth/AuthUser";

export const AuthRouter = Router()

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
            default: res.sendStatus(401)
        }
        return;
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.login}`, 'POST', 'Login the user', e)
        return res.sendStatus(500)
    }
})

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