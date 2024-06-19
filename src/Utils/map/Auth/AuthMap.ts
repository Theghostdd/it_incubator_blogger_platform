import { InfoAboutUserByAccessTokenType, MeViewModelType } from "../../../Applications/Types-Models/Auth/AuthTypes";
import { UserViewMongoModelType } from "../../../Applications/Types-Models/User/UserTypes";



export const AuthMap = {
    async AuthMapUser (data: UserViewMongoModelType): Promise<InfoAboutUserByAccessTokenType> {
        return {
            userId: data._id.toString()
        }
    },

    async CurrentUserAuthMap (data: UserViewMongoModelType): Promise<MeViewModelType> {
        return {
            email: data.email,
            login: data.login,
            userId: data._id.toString()
        }
    }
}