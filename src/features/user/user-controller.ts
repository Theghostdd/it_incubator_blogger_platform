import {Request, Response} from "express";
import {
    APIErrorsMessageType,
    QueryParamsType,
    ResultDataWithPaginationType, ResultNotificationEnum, ResultNotificationType
} from "../../typings/basic-types";
import {ROUTERS_SETTINGS} from "../../settings";
import {saveError} from "../../internal/utils/error-utils/save-error";
import {UserQueryRepositories} from "./user-query-repositories";
import {UserQueryParamsType, UserViewModelType} from "./user-types";
import {RegistrationInputType} from "../auth-registration/registartion/registration-types";
import {UserService} from "./user-service";


export class UserController {
    constructor(
        protected userService: UserService,
        protected userQueryRepositories: UserQueryRepositories

    ) {
    }
    async getUsers(req: Request<{}, {}, {}, QueryParamsType<UserQueryParamsType>>, res: Response<ResultDataWithPaginationType<UserViewModelType[] | []>>) {
        try {
            const result: ResultDataWithPaginationType<UserViewModelType[] | []> = await this.userQueryRepositories.getAllUsers(req.query)
            return res.status(200).json(result)
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.USER.user}/`, 'GET', 'Get a user items', e)
            return res.sendStatus(500)
        }
    }

    async createUser (req: Request<{}, {}, RegistrationInputType>, res: Response<UserViewModelType | APIErrorsMessageType>) {
        try {
            const result: ResultNotificationType<UserViewModelType> = await this.userService.createUser(req.body)
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
            await saveError(`${ROUTERS_SETTINGS.USER.user}/`, 'POST', 'Create the user item', e)
            return res.sendStatus(500)
        }
    }

    async deleteUserById (req: Request<{id: string}>, res: Response) {
        try {
            const result: ResultNotificationType = await this.userService.deleteUserById(req.params.id)
            switch(result.status) {
                case ResultNotificationEnum.Success:
                    return res.sendStatus(204);
                case ResultNotificationEnum.NotFound:
                    return res.sendStatus(404);
                default: return res.sendStatus(500);
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.USER.user}/:id`, 'DELETE', 'Delete the user item by ID', e)
            return res.sendStatus(500)
        }
    }
}