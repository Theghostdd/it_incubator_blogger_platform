import { Request, Response, Router } from "express";
import { authValidation } from "../../Applications/Validations/auth/auth";
import { RuleValidations, inputValidation } from "../../Applications/Validations/inputValidations/InputValidations";
import { UserInputModel, UserOutputType, UserViewModel } from "../../Applications/Types/UserTypes/UserTypes";
import { UserService } from "../../Service/UserService";
import { errorsApiFieldsType } from "../../Applications/Types/Types";


export const UserRouter = Router()

UserRouter.get('/', async (req: Request, res: Response) => {
    res.send(200)
})

UserRouter.post('/', 
    authValidation,
    RuleValidations.validLogin, 
    RuleValidations.validPassword,
    RuleValidations.validEmail,
    inputValidation,
    async (req: Request<{}, {}, UserInputModel>, res: Response<UserViewModel | errorsApiFieldsType | null>) => {
        const result: UserOutputType = await UserService.CreateUser(req.body)
        res.status(result.status).json(result.data)
})

UserRouter.delete('/:id',
    authValidation,
    async (req: Request<{id: string}>, res: Response) => {
        const result: UserOutputType = await UserService.DeleteUser(req.params.id)
        res.sendStatus(result.status)
})