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

    async DeleteUserById (id: string): Promise<number> {
        try {
            const result: DeletedMongoSuccessType = await UserRepositories.DeleteUserById(id)
            return result.deletedCount > 0 ? 204 : 404
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async CreatePagination (page: number, pageSize: number, filter: Object): Promise<CreatePaginationType> {
        try {
            const getTotalCount: number = await UserQueryRepositories.GetCountElements(filter)
            const totalCount = +getTotalCount 
            const pagesCount = Math.ceil(totalCount / pageSize)
            const skip = (page - 1) * pageSize

            return {
                totalCount: +totalCount,
                pagesCount: +pagesCount,
                skip: +skip,
                pageSize: +pageSize,
                page: +page
            }
        } catch (e) {
            throw new Error();
        }
    }

}