import { credentialJWT } from "../../Applications/Middleware/auth/UserAuth/jwt"
import { comparePass } from "../../Applications/Middleware/bcrypt/bcrypt"
import { AuthOutputModelType, LoginInputModelType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { UserViewMongoModelType } from "../../Applications/Types-Models/User/UserTypes"
import { UserQueryRepositories } from "../../Repositories/UserRepostitories/UserQueryRepositories"
import { ResultNotificationType, ResultNotificationEnum } from "../../Applications/Types-Models/BasicTypes"
import { UserRepositories } from "../../Repositories/UserRepostitories/UserRepositories"


export const AuthService = {
    /* 
    * 1. Constructs a filter object to find a user document by login or email.
    * 2. Queries the MongoDB collection.
    * 3. Checks if a user document is found:
    *    a. If no user is found, returns a failure status (Unauthorized).
    *    b. If a user is found, verifies the provided password against the stored password using bcrypt.
    *       - If the password doesn't match, returns a failure status (Unauthorized).
    */
    async AuthUser (data: LoginInputModelType): Promise<ResultNotificationType<AuthOutputModelType>> {
        try {
            const filter = {
                $or: [
                    {login: data.loginOrEmail},
                    {email: data.loginOrEmail}
                ]
            }
            const getUser: UserViewMongoModelType | null = await UserRepositories.GetUserByLoginOrEmailWithOutMap(filter)
            if (!getUser) {
                return {status: ResultNotificationEnum.Unauthorized}
            }

            if (!await comparePass(data.password, getUser.password)) {
                return {status: ResultNotificationEnum.Unauthorized}
            }


            return {
                status: ResultNotificationEnum.Success,
                data: {
                    accessToken: await credentialJWT.SignJWT({userId: getUser._id})
                }
            }
        } catch (e: any) {
            throw new Error(e)
        }
    }
}