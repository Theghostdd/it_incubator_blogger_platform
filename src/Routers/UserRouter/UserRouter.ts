import { Request, Response, Router } from "express";
import { authValidation } from "../../Applications/Middleware/auth/AdminAuth/AdminAuth";
import { RuleValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import { SaveError } from "../../Utils/error-utils/save-error";
import { ROUTERS_SETTINGS } from "../../settings";
import { UserService } from "../../Service/UserService/UserService";
import {
    APIErrorsMessageType,
    QueryParamsType, ResultDataWithPaginationType,
    ResultNotificationEnum,
    ResultNotificationType
} from "../../Applications/Types-Models/BasicTypes";
import { UserQueryRepositories } from "../../Repositories/UserRepostitories/UserQueryRepositories";
import { defaultUserValues } from "../../Utils/default-values/User/default-user-value";
import {UserQueryParamsType, UserViewModelType} from "../../Applications/Types-Models/User/UserTypes";
import {RegistrationInputType} from "../../Applications/Types-Models/Registration/RegistrationTypes";


export const UserRouter = Router()
/* 
* Validation of the user who made the request using middleware.
* Setting default values for query parameters.
* Sending query parameters to get the user for get all users.
* Return a response for the customer.
* Catches and logs any errors that occur during the process, and returns a 500 status indicating a server error.
*/
UserRouter.get('/',
authValidation,
async (req: Request<{}, {}, {}, QueryParamsType<UserQueryParamsType>>, res: Response<ResultDataWithPaginationType<UserViewModelType[]>>) => {
    try {
        const queryValue: UserQueryParamsType = await defaultUserValues.defaultQueryValue(req.query)
        const result: ResultDataWithPaginationType<UserViewModelType[]> = await UserQueryRepositories.GetAllUsers(queryValue)
        return res.status(200).json(result)
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.USER.user}/`, 'GET', 'Get a user items', e)
        return res.sendStatus(500)
    }
})
/* 
* Validation of the user who made the request using middleware.
* Validation of the entered data from the client.
* Sending the data entered by the client to the service to create a new user.
* Processing the response from the service.
* If an error occurs within the try block, it logs the error and returns a 500 status code.
*/ 
UserRouter.post('/', 
authValidation,
RuleValidations.validLogin, 
RuleValidations.validPassword,
RuleValidations.validEmail,
inputValidation,
async (req: Request<{}, {}, RegistrationInputType>, res: Response<UserViewModelType | APIErrorsMessageType>) => {
    try {
        const result: ResultNotificationType<UserViewModelType> = await UserService.CreateUserItem(req.body)
        switch(result.status) {
            case ResultNotificationEnum.Success:
                return res.status(201).json(result.data);
            case ResultNotificationEnum.BadRequest:
                return res.status(400).json(result.errorField);
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.USER.user}/`, 'POST', 'Create the user item', e)
        return res.sendStatus(500)
    }
})
/*
* Validation of the user who made the request using middleware.
* Getting the user ID to delete from the parameters and sending the ID to the service for deletion.
* Processing the response from the service.
* If an error occurs within the try block, it logs the error and returns a 500 status code.
*/ 
UserRouter.delete('/:id',
authValidation,
async (req: Request<{id: string}>, res: Response) => {
    try {
        const result: ResultNotificationType = await UserService.DeleteUserById(req.params.id)
        switch(result.status) {
            case ResultNotificationEnum.Success:
                return res.sendStatus(204);
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500);
        }
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.USER.user}/:id`, 'DELETE', 'Delete the user item by ID', e)
        return res.sendStatus(500)
    }
})