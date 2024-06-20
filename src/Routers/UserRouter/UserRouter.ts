import { Request, Response, Router } from "express";
import { authValidation } from "../../Applications/Middleware/auth/AdminAuth/AdminAuth";
import { RuleValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import { SaveError } from "../../Utils/error-utils/save-error";
import { ROUTERS_SETTINGS } from "../../settings";
import { UserInputModelType, UserQueryParamsType, UserViewModelType, UsersViewModelType } from "../../Applications/Types-Models/User/UserTypes";
import { UserService } from "../../Service/UserService/UserService";
import { APIErrorsMessageType, ResultNotificationEnum, ResultNotificationType } from "../../Applications/Types-Models/BasicTypes";
import { UserQueryRepositories } from "../../Repositories/UserRepostitories/UserQueryRepositories";
import { defaultUserValues } from "../../Utils/default-values/User/default-user-value";


export const UserRouter = Router()
/* 
* 1. Validates the user's authentication status using middleware.
* 2. Processes the incoming query parameters to ensure they meet the default expected values.
* 3. Calls query repositories to fetch users from the database based on the processed query parameters.
* 4. Returns a 200 status with the list of users in JSON format if any users are found.
* 5. Returns a 404 status if no users match the query parameters.
* 6. Catches and logs any errors that occur during the process, and returns a 500 status indicating a server error.
*/
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
/* 
* 1. Validates the request data using specified validation middlewares:
* 2. Calls the service method to attempt creating a new user with the provided data.
* 3. Evaluates the result and sends an appropriate HTTP response:
*    - 201 Created: If the user was successfully created. Responds with the newly created user data.
*    - 400 Bad Request: If there were validation errors in the provided data. Responds with error details.
*    - 404 Not Found: If a related resource was not found (though not typical in user creation).
*    - 500 Internal Server Error: For any unexpected errors that occur during the operation.
* 4. If an error occurs within the try block, it logs the error and returns a 500 status code.
*/ 
UserRouter.post('/', 
authValidation,
RuleValidations.validLogin, 
RuleValidations.validPassword,
RuleValidations.validEmail,
inputValidation,
async (req: Request<{}, {}, UserInputModelType>, res: Response<UserViewModelType | APIErrorsMessageType>) => {
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
        SaveError(`${ROUTERS_SETTINGS.USER.user}/`, 'POST', 'Create the user item', e)
        return res.sendStatus(500)
    }
})
/*
* 1. Extracts the user ID from the route parameters.
* 2. Calls the service method to attempt deletion of the user with the given ID.
* 3. Evaluates the result and sends an appropriate HTTP response:
*    - 204 No Content: If the user was successfully deleted.
*    - 404 Not Found: If no user with the provided ID exists.
*    - 500 Internal Server Error: For any unexpected errors that occur during the operation.
* 4. If an error occurs within the try block, it logs the error and returns a 500 status code.
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
        SaveError(`${ROUTERS_SETTINGS.USER.user}/:id`, 'DELETE', 'Delete the user item by ID', e)
        return res.sendStatus(500)
    }
})