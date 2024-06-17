import { Router, Request, Response } from "express";
import { ROUTERS_SETTINGS } from "../../settings";
import { AuthService } from "../../Service/AuthService/AuthService";
import { RuleValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import { AuthOutputType, LoginInputModelType } from "../../Applications/Types-Models/Auth/AuthTypes";
import { SaveError } from "../../Utils/error-utils/save-error";

export const AuthRouter = Router()

AuthRouter.post(`${ROUTERS_SETTINGS.AUTH.login}`,
RuleValidations.validLoginOrEmail,
RuleValidations.validPassword,
inputValidation,
async (req: Request<{}, {}, LoginInputModelType>, res: Response<AuthOutputType>) => {
    try {
        const result: AuthOutputType | null = await AuthService.AuthUser(req.body)
        return result ? res.status(200).json(result) : res.sendStatus(401)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.AUTH.auth}${ROUTERS_SETTINGS.AUTH.login}`, 'POST', 'Login the user', e)
        return res.sendStatus(500)
    }
})