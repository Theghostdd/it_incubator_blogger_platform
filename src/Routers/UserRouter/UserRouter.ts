import { Request, Response, Router } from "express";
import { authValidation } from "../../Applications/Middleware/auth/AdminAuth";
import { RuleValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import { SaveError } from "../../Utils/error-utils/save-error";
import { ROUTERS_SETTINGS } from "../../settings";
import { UserInputModelType, UserQueryParamsType, UserViewModelType, UsersViewModelType } from "../../Applications/Types-Models/User/UserTypes";
import { UserService } from "../../Service/UserService/UserService";
import { APIErrorsMessageType } from "../../Applications/Types-Models/BasicTypes";
import { defaultUserValues } from "../../Utils/default-values/default-values";
import { UserQueryRepositories } from "../../Repositories/UserRepostitories/UserQueryRepositories";


export const UserRouter = Router()

UserRouter.get('/',
authValidation,
async (req: Request<{}, {}, {}, UserQueryParamsType>, res: Response<UsersViewModelType>) => {
    try {
        const queryValue: UserQueryParamsType = await defaultUserValues.defaultQueryValue(req.query)
        const result = await UserQueryRepositories.GetAllUsers(queryValue)
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
        const result = await UserService.CreateUserItem(req.body)
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
        const result = await UserService.DeleteUserById(req.params.id)
        return res.sendStatus(result)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.USER.user}/:id`, 'DELETE', 'Delete the user item by ID', e)
        return res.sendStatus(500)
    }
})