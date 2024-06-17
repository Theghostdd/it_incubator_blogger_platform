import { Jwt } from "jsonwebtoken"
import { credentialJWT } from "../../Applications/Middleware/auth/UserAuth/jwt"
import { comparePass } from "../../Applications/Middleware/bcrypt/bcrypt"
import { AuthOutputType, LoginInputModelType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { UserViewMongoModelType } from "../../Applications/Types-Models/User/UserTypes"
import { UserQueryRepositories } from "../../Repositories/UserRepostitories/UserQueryRepositories"


export const AuthService = {
    async AuthUser (data: LoginInputModelType): Promise<AuthOutputType | null> {
        try {
            const getUser: UserViewMongoModelType | null = await UserQueryRepositories.GetUserByLoginOrEmailWithOutMap(data)
            if (!getUser) {
                return null
            }

            if (!await comparePass(data.password, getUser.password)) {
                return null
            }


            return {
                accessToken: await credentialJWT.SignJWT({userId: getUser._id})
            }
        } catch (e: any) {
            throw new Error(e)
        }
    }
}