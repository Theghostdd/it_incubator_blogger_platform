import { NextFunction, Response, Request } from "express"
import { credentialJWT } from "../../../JWT/jwt"
import { UserQueryRepositories } from "../../../../Repositories/UserRepostitories/UserQueryRepositories"
import { PayloadJwtToken } from "../../../Types-Models/BasicTypes"


export const AuthUser = {
    async AuthUserByAccessToken (req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.headers.authorization) {
                return res.sendStatus(401)
            }

            const token = req.headers.authorization.split(' ')[1]
            const verify: any = await credentialJWT.VerifyJWT(token)

            if (verify.userId) {
                const getUser: PayloadJwtToken | null = await UserQueryRepositories.GetUserByIdAuthByJwtToken(verify.userId)
                if (!getUser) {
                    return res.sendStatus(401)
                }
                req.user = {userId: getUser!.userId}
                return next()
            }
    
            return res.sendStatus(401)

        } catch (e: any) {
            return res.sendStatus(401)
        }
    }
}