import {Request, Response} from "express";
import {
    APIErrorsMessageType,
    QueryParamsType,
    ResultDataWithPaginationType, ResultNotificationEnum, ResultNotificationType
} from "../../../typings/basic-types";
import {ROUTERS_SETTINGS} from "../../../settings";
import {saveError} from "../../../internal/utils/error-utils/save-error";
import {UserQueryRepositories} from "./user-query-repositories";
import {UserQueryParamsType} from "../user-types";
import {UserService} from "../application/user-service";
import {UserRegisterInputDto} from "../../auth-registration/api/input-models/dto";
import {inject, injectable} from "inversify";
import {UserViewModelDto} from "./view-models/dto";

@injectable()
export class UserController {
    constructor(
        @inject(UserService) private userService: UserService,
        @inject(UserQueryRepositories) private userQueryRepositories: UserQueryRepositories

    ) {
    }
    async getUsers(req: Request<{}, {}, {}, QueryParamsType<UserQueryParamsType>>, res: Response<ResultDataWithPaginationType<UserViewModelDto[] | []>>) {
        try {
            const result: ResultDataWithPaginationType<UserViewModelDto[] | []> = await this.userQueryRepositories.getAllUsers(req.query)
            return res.status(200).json(result)
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.USER.user}/`, 'GET', 'Get a user items', e)
            return res.sendStatus(500)
        }
    }

    async createUser (req: Request<{}, {}, UserRegisterInputDto>, res: Response<UserViewModelDto | APIErrorsMessageType>) {
        try {
            const result: ResultNotificationType<string | null> = await this.userService.createUser(req.body)
            switch(result.status) {
                case ResultNotificationEnum.Success:
                    const user: UserViewModelDto | null = await this.userQueryRepositories.getUserById(result.data!)
                    return user ? res.status(201).json(user) : res.sendStatus(404)
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