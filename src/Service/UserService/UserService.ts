import { genSaltAndHash } from "../../Applications/Middleware/bcrypt/bcrypt"
import { APIErrorsMessageType, CreatePaginationType, CreatedMongoSuccessType, DeletedMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { UserCreateInputModelType, UserInputModelType, UserViewModelType } from "../../Applications/Types-Models/User/UserTypes"
import { UserQueryRepositories } from "../../Repositories/UserRepostitories/UserQueryRepositories"
import { UserRepositories } from "../../Repositories/UserRepostitories/UserRepositories"
import { defaultUserValues } from "../../Utils/default-values/default-values"
import { map } from "../../Utils/map/map"




export const UserService = {

    async CreateUserItem (data: UserInputModelType): Promise<UserViewModelType | APIErrorsMessageType> {
        try {
            const checkLoginAndEmail = await UserQueryRepositories.GetUserByLoginOrEmail(data)
            if (checkLoginAndEmail) {
                const errors: APIErrorsMessageType = {errorsMessages: []};  
                data.login === checkLoginAndEmail.login ? errors.errorsMessages.push({message: 'Not unique login', field: 'login'}) : false
                data.email === checkLoginAndEmail.email ? errors.errorsMessages.push({message: 'Not unique email', field: 'email'}) : false
                return errors
            }

            const CreateData: UserCreateInputModelType = {...data, password: await genSaltAndHash(data.password), ...await defaultUserValues.defaultCreateValues()}
            const result: CreatedMongoSuccessType = await UserRepositories.CreateUser(CreateData)

            return await map.mapUser(CreateData, result)
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async DeleteUserById (id: string): Promise<boolean> {
        try {
            const result: DeletedMongoSuccessType = await UserRepositories.DeleteUserById(id)
            return result.deletedCount > 0 ? true : false
        } catch (e: any) {
            throw new Error(e)
        }
    }
}