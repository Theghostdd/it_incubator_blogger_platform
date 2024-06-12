import { Request, Response, Router, query } from "express";
import { authValidation } from "../../Applications/Validations/auth/auth";
import { RuleValidations, inputValidation } from "../../Applications/Validations/inputValidations/InputValidations";
import { UserInputModel, UserOutputType, UserQueryParamsType, UserViewModel, UsersOutputType } from "../../Applications/Types/UserTypes/UserTypes";
import { UserService } from "../../Service/UserService";
import { errorsApiFieldsType } from "../../Applications/Types/Types";
import { UserQueryRepo } from "../../Repositories/UserRepo/UserQueryRepo";


export const UserRouter = Router()

UserRouter.get('/',
    authValidation,
    RuleValidations.validQueryPageSize,
    RuleValidations.validQueryPageNumber,
    RuleValidations.validQuerySortDirection,
    RuleValidations.validSortBy,
    async (req: Request<any, any, any, UserQueryParamsType>, res: Response) => {
        const result: UsersOutputType = await UserQueryRepo.GetAllUsers(req.query)
        res.status(result.status).json(result.data)
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