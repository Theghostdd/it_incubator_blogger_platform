import {
    APIErrorsMessageType,
    ResultNotificationEnum,
    ResultNotificationType
} from "../../typings/basic-types";
import {bcryptService} from "../../internal/application/bcrypt/bcrypt";
import {UserViewModelType} from "./user-types";
import {UserModel} from "../../Domain/User/User";
import {UserRepositories} from "./user-repositories";
import {RegistrationCreatType, RegistrationInputType} from "../auth-registration/registartion/registration-types";
import {userMap} from "../../internal/utils/map/userMap";


export class UserService {
    constructor(
        protected userRepositories: UserRepositories,
        protected userModel: typeof UserModel
    ) {
    }
    async createUser(data: RegistrationInputType): Promise<ResultNotificationType<UserViewModelType>> {
        try {

            const user: InstanceType<typeof UserModel> | null = await this.userRepositories.getUserByEmailOrLogin(data.email, data.login)
            if (user) {
                const errors: APIErrorsMessageType = {errorsMessages: []};
                data.login === user.login ? errors.errorsMessages.push({message: 'Not unique login', field: 'login'}) : false
                data.email === user.email ? errors.errorsMessages.push({message: 'Not unique email', field: 'email'}) : false
                return {status: ResultNotificationEnum.BadRequest, errorField: errors}
            }

            const CreateData: RegistrationCreatType = {
                login: data.login,
                email: data.email,
                password: await bcryptService.genSaltAndHash(data.password),
                userConfirm: {
                    ifConfirm: true,
                    confirmationCode: 'not code',
                    dataExpire: "not date"
                },
                createdAt: new Date().toISOString()
            }

            const result: InstanceType<typeof UserModel> = await this.userRepositories.save(new this.userModel(CreateData))
            return {status: ResultNotificationEnum.Success, data: userMap.userMapperView(result)}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async deleteUserById (id: string): Promise<ResultNotificationType> {
        try {
            const user: InstanceType<typeof UserModel> | null = await this.userRepositories.getUserById(id)
            if(!user) return {status: ResultNotificationEnum.NotFound}

            await this.userRepositories.delete(user)
            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}