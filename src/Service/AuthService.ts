import { LoginInputModel } from "../Applications/Types/AuthTypes/AuthTypes";
import { Response } from "../Applications/Utils/Response";
import { UserQueryRepo } from "../Repositories/UserRepo/UserQueryRepo";
import bcrypt from 'bcrypt';


export const AuthService = {
    async AuthUser (data: LoginInputModel) {
        const getUser = await UserQueryRepo.GetUserByLoginOrEmail(data.loginOrEmail)
        if (!getUser) {
            return Response.E401
        }

        const compare = await bcrypt.compare(data.password, getUser.password)

        return compare ? Response.S204New : Response.E401    
    }
}