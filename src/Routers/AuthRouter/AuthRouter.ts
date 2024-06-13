import { Router, Request, Response } from "express";
import { ROUTERS_SETTINGS } from "../../settings";
import { AuthService } from "../../Service/AuthService/AuthService";
import { RuleValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import { LoginInputModelType } from "../../Applications/Types-Models/Auth/AuthTypes";


export const AuthRouter = Router()

AuthRouter.post(`${ROUTERS_SETTINGS.AUTH.login}`,
RuleValidations.validLoginOrEmail,
RuleValidations.validPassword,
inputValidation,
    async (req: Request<{}, {}, LoginInputModelType>, res: Response) => {
        const result = await AuthService.AuthUser(req.body)
        res.sendStatus(result)
})