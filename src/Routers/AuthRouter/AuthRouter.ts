import { Router, Request, Response } from "express";
import { SETTINGS } from "../../settings";
import { AuthService } from "../../Service/AuthService";
import { RuleValidations, inputValidation } from "../../Applications/Validations/inputValidations/InputValidations";




export const AuthRouter = Router()

AuthRouter.post(`/${SETTINGS.PATH.additionalAuth.login}`, 
    RuleValidations.validPassword,
    inputValidation,
    async (req: Request, res: Response) => {
        const result = await AuthService.AuthUser(req.body)
        res.sendStatus(result.status)
})