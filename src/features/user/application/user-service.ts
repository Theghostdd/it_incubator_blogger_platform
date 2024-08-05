import {
    APIErrorsMessageType,
    ResultNotificationEnum,
    ResultNotificationType
} from "../../../typings/basic-types";
import {UserRepositories} from "../infrastructure/user-repositories";
import {inject, injectable} from "inversify";
import {HydratedDocument} from "mongoose";
import {UserDto} from "../../auth-registration/domain/dto";
import {IUserInstanceMethods} from "../../auth-registration/domain/interfaces";
import {UserModel} from "../../auth-registration/domain/user-entity";
import {BcryptService} from "../../../internal/application/bcrypt/bcrypt";
import {UserRegisterInputDto} from "../../auth-registration/api/input-models/dto";

@injectable()
export class UserService {
    constructor(
        @inject(UserRepositories) private userRepositories: UserRepositories,
        @inject(UserModel) private userModel: typeof UserModel,
        @inject(BcryptService) private bcryptService: BcryptService,
    ) {}

    async createUser(userRegisterInputDto: UserRegisterInputDto): Promise<ResultNotificationType<string | null>> {
        const user: HydratedDocument<UserDto, IUserInstanceMethods> | null = await this.userRepositories.getUserByEmailOrLogin(userRegisterInputDto.email, userRegisterInputDto.login)
        if (user) {
            const errors: APIErrorsMessageType = {errorsMessages: []};
            userRegisterInputDto.login === user.login ? errors.errorsMessages.push({
                message: 'Not unique login',
                field: 'login'
            }) : false
            userRegisterInputDto.email === user.email ? errors.errorsMessages.push({
                message: 'Not unique email',
                field: 'email'
            }) : false
            return {status: ResultNotificationEnum.BadRequest, errorField: errors, data: null}
        }

        const hashPass: string =  await this.bcryptService.genSaltAndHash(userRegisterInputDto.password)
        const newUser: HydratedDocument<UserDto, IUserInstanceMethods> = this.userModel.createInstance(userRegisterInputDto, hashPass, 'none')

        await this.userRepositories.save(newUser)
        return {status: ResultNotificationEnum.Success, data: newUser._id.toString()}
    }

    async deleteUserById(id: string): Promise<ResultNotificationType> {

        const user: HydratedDocument<UserDto, IUserInstanceMethods> | null = await this.userRepositories.getUserById(id)
        if (!user) return {status: ResultNotificationEnum.NotFound, data: null}

        await this.userRepositories.delete(user)
        return {status: ResultNotificationEnum.Success, data: null}
    }
}