import { credentialJWT } from "../../Applications/Middleware/auth/UserAuth/jwt"
import { comparePass } from "../../Applications/Middleware/bcrypt/bcrypt"
import { AuthOutputModelType, LoginInputModelType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { UserViewMongoModelType } from "../../Applications/Types-Models/User/UserTypes"
import { UserQueryRepositories } from "../../Repositories/UserRepostitories/UserQueryRepositories"
import { ResultNotificationType, ResultNotificationEnum } from "../../Applications/Types-Models/BasicTypes"


export const AuthService = {
    async AuthUser (data: LoginInputModelType): Promise<ResultNotificationType<AuthOutputModelType>> {
        try {
            const getUser: UserViewMongoModelType | null = await UserQueryRepositories.GetUserByLoginOrEmailWithOutMap(data)
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