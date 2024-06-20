import { genSaltAndHash } from "../../Applications/Middleware/bcrypt/bcrypt"
import { APIErrorsMessageType, CreatedMongoSuccessType, DeletedMongoSuccessType, ResultNotificationEnum, ResultNotificationType } from "../../Applications/Types-Models/BasicTypes"
import { UserCreateInputModelType, UserInputModelType, UserViewModelType, UserViewMongoModelType } from "../../Applications/Types-Models/User/UserTypes"
import { UserRepositories } from "../../Repositories/UserRepostitories/UserRepositories"
import { defaultUserValues } from "../../Utils/default-values/User/default-user-value"
import { UserMap } from "../../Utils/map/User/UserMap"




export const UserService = {
    /* 
    * 1. Checks if the provided login or email is already in use.
    *    - If either the login or email is found to be non-unique, it returns a `BadRequest` status with detailed error messages.
    * 2. Prepares the user data for creation:
    *    - Hashes the provided password using `genSaltAndHash`.
    *    - Merges the user data with default creation values.
    * 3. Attempts to create the user in the database.
    *    - Calls repositories to insert the user data into the database.
    *    - Retrieves the newly created user data using the `insertedId` from the create operation.
    * 4. Returns the result:
    *    - If the user is successfully created and found, it returns a `Success` status with the user data.
    *    - If the user is not found after creation, it returns a `NotFound` status.
    * If an error occurs during the process, the method throws an error which should be handled by the calling code.
    */ 
    async CreateUserItem (data: UserInputModelType): Promise<ResultNotificationType<UserViewModelType>> {
        try {
            const filter = {
                $or: [
                    {login: data.login},
                    {email: data.email}
                ]
            }
            const checkLoginAndEmail: UserViewMongoModelType | null = await UserRepositories.GetUserByLoginOrEmailWithOutMap(filter)
            if (checkLoginAndEmail) {
                const errors: APIErrorsMessageType = {errorsMessages: []};  
                data.login === checkLoginAndEmail.login ? errors.errorsMessages.push({message: 'Not unique login', field: 'login'}) : false
                data.email === checkLoginAndEmail.email ? errors.errorsMessages.push({message: 'Not unique email', field: 'email'}) : false
                return {status: ResultNotificationEnum.BadRequest, errorField: errors}
            }

            const CreateData: UserCreateInputModelType = {
                ...data, 
                password: await genSaltAndHash(data.password), 
                ...await defaultUserValues.defaultCreateValue()
            }
            const result: CreatedMongoSuccessType = await UserRepositories.CreateUser(CreateData)
            const GetCreatedUser: UserViewMongoModelType | null = await UserRepositories.GetUserByIdWithoutMap(result.insertedId.toString())
            if (!GetCreatedUser) {
                return {status: ResultNotificationEnum.NotFound}
            }

            return {status: ResultNotificationEnum.Success, data: await UserMap.UserMapperCreateView(GetCreatedUser)}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * 1. Attempts to delete the user from the database using their unique ID.
    *    - Calls the repositories method to perform the deletion.
    * 2. Returns the result of the deletion operation:
    *    - If the user was successfully deleted (i.e., `deletedCount` is greater than 0), it returns a `Success` status.
    *    - If no user was found with the given ID (i.e., `deletedCount` is 0), it returns a `NotFound` status.
    * If an error occurs during the process, the method throws an error which should be handled by the calling code.
    */ 
    async DeleteUserById (id: string): Promise<ResultNotificationType> {
        try {
            const result: DeletedMongoSuccessType = await UserRepositories.DeleteUserById(id)
            return result.deletedCount > 0 ? {status: ResultNotificationEnum.Success} : {status: ResultNotificationEnum.NotFound}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}