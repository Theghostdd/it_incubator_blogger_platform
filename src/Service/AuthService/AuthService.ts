import { comparePass } from "../../Applications/Middleware/bcrypt/bcrypt"
import { LoginInputModelType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { UserViewMongoModelType } from "../../Applications/Types-Models/User/UserTypes"
import { UserQueryRepositories } from "../../Repositories/UserRepostitories/UserQueryRepositories"


export const AuthService = {
    async AuthUser (data: LoginInputModelType): Promise<boolean> {
        try {
            const getUser: UserViewMongoModelType | null = await UserQueryRepositories.GetUserByLoginOrEmailWithOutMap(data)
            if (!getUser) {
                return false
            }

            if (!await comparePass(data.password, getUser.password)) {
                return false
            }
            return true
        } catch (e: any) {
            throw new Error(e)
        }
    }
}