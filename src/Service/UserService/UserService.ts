import { bcryptService } from "../../Applications/Middleware/bcrypt/bcrypt"
import { APIErrorsMessageType, ResultNotificationEnum, ResultNotificationType } from "../../Applications/Types-Models/BasicTypes"
import {UserViewModelType, UserViewMongoType} from "../../Applications/Types-Models/User/UserTypes"
import { UserRepositories } from "../../Repositories/UserRepostitories/UserRepositories"
import { defaultUserValues } from "../../utils/default-values/User/default-user-value"
import { UserMap } from "../../utils/map/User/UserMap"
import {
    RegistrationCreatType,
    RegistrationInputType
} from "../../Applications/Types-Models/Registration/RegistrationTypes";




export const UserService = {
    /* 
    * Check that the user with this username and password does not exist.
    * If the user exists, an error message is returned stating that the user is not unique.
    * Creating a user object.
    * Creating a user using the created object.
    * Mapping of the created user, and return.
    * If an error occurs during the process, the method throws an error which should be handled by the calling code.
    */ 
    async CreateUserItem (data: RegistrationInputType): Promise<ResultNotificationType<UserViewModelType>> {
        try {

            const checkLoginAndEmail: UserViewMongoType | null = await UserRepositories.GetUserByEmailOrLogin(data.email, data.login)
            if (checkLoginAndEmail) {
                const errors: APIErrorsMessageType = {errorsMessages: []};  
                data.login === checkLoginAndEmail.login ? errors.errorsMessages.push({message: 'Not unique login', field: 'login'}) : false
                data.email === checkLoginAndEmail.email ? errors.errorsMessages.push({message: 'Not unique email', field: 'email'}) : false
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
                ...await defaultUserValues.defaultCreateValue()
            }
            const result: UserViewMongoType = await UserRepositories.CreateUser(CreateData)
            return {status: ResultNotificationEnum.Success, data: await UserMap.UserMapperCreateView(result)}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * Deleting a user by ID.
    * If the user has not found an error return.
    * If an error occurs during the process, the method throws an error which should be handled by the calling code.
    */ 
    async DeleteUserById (id: string): Promise<ResultNotificationType> {
        try {
            const result: UserViewMongoType | null = await UserRepositories.DeleteUserById(id)
            return result ? {status: ResultNotificationEnum.Success} : {status: ResultNotificationEnum.NotFound}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}