import { Request, Response, Router } from "express";
import { authValidation } from "../../Applications/Middleware/auth/AdminAuth";
import { RuleValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import { SaveError } from "../../Utils/error-utils/save-error";
import { ROUTERS_SETTINGS } from "../../settings";
import { UserInputModelType, UserQueryParamsType, UserViewModelType, UsersViewModelType } from "../../Applications/Types-Models/User/UserTypes";
import { UserService } from "../../Service/UserService/UserService";
import { APIErrorsMessageType } from "../../Applications/Types-Models/BasicTypes";
import { UserQueryRepositories } from "../../Repositories/UserRepostitories/UserQueryRepositories";
import { defaultUserValues } from "../../Utils/default-values/User/default-user-value";


export const UserRouter = Router()

UserRouter.get('/',
authValidation,
async (req: Request<{}, {}, {}, UserQueryParamsType>, res: Response<UsersViewModelType>) => {
    try {
        const queryValue: UserQueryParamsType = await defaultUserValues.defaultQueryValue(req.query)
        const result: UsersViewModelType = await UserQueryRepositories.GetAllUsers(queryValue)
        return res.status(200).json(result)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.USER.user}/`, 'GET', 'Get a user items', e)
        return res.sendStatus(500)
    }
})

UserRouter.post('/', 
authValidation,
RuleValidations.validLogin, 
RuleValidations.validPassword,
RuleValidations.validEmail,
inputValidation,
async (req: Request<{}, {}, UserInputModelType>, res: Response<UserViewModelType | APIErrorsMessageType>) => {
    try {
        const result: UserViewModelType | APIErrorsMessageType = await UserService.CreateUserItem(req.body)
        return ('errorsMessages' in result) ? res.status(400).json(result) : res.status(201).json(result)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.USER.user}/`, 'POST', 'Create the user item', e)
        return res.sendStatus(500)
    }
})

UserRouter.delete('/:id',
authValidation,
async (req: Request<{id: string}>, res: Response) => {
    try {
        const result: boolean = await UserService.DeleteUserById(req.params.id)
        return result ? res.sendStatus(204) : res.sendStatus(404)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.USER.user}/:id`, 'DELETE', 'Delete the user item by ID', e)
        return res.sendStatus(500)
    }
})