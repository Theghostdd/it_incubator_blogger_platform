import { NextFunction, Response, Request } from "express"
import { credentialJWT } from "../../../JWT/jwt"
import { UserRepositories } from "../../../../Repositories/UserRepostitories/UserRepositories"
import { UserViewMongoModelType } from "../../../Types-Models/User/UserTypes"
import { UserMap } from "../../../../Utils/map/User/UserMap"

export const AuthUser = {
    async AuthUserByAccessToken (req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.headers.authorization) {
                return res.sendStatus(401)
            }

            const token = req.headers.authorization.split(' ')[1]
            const verify: any = await credentialJWT.VerifyJWT(token)

            if (verify.userId) {
                const getUser: UserViewMongoModelType | null = await UserRepositories.GetUserByIdWithoutMap(verify.userId)
                if (!getUser) {
                    return res.sendStatus(401)
                }
                req.user = {...await UserMap.UserMapperAuthByAccessToken(getUser)} 
                return next()
            }
    
            return res.sendStatus(401)

        } catch (e: any) {
            return res.sendStatus(401)
        }
    }
}