import {NextFunction, Request, Response} from "express"
import {
    JWTAccessTokenType,
    ResultNotificationEnum,
    ResultNotificationType,
} from "../../../../typings/basic-types";
import {AuthService} from "../../../../features/auth-registration/auth/auth-service";

export class AuthUserMiddleware {
    constructor(
        protected authService: AuthService,
    ) {}
    async authUserByAccessToken (req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.headers.authorization) return res.sendStatus(401)
            if (req.headers.authorization.split(' ')[0] !== "Bearer") return res.sendStatus(401)


            const authJwtAccessResult: ResultNotificationType<JWTAccessTokenType> = await this.authService.jwtAccessTokenAuth(req.headers.authorization.split(' ')[1])
            if (authJwtAccessResult.status != ResultNotificationEnum.Success) return res.sendStatus(401)


            req.user = {userId: authJwtAccessResult.data!.userId}
            return next()
        } catch (e: any) {
            return res.sendStatus(500)
        }
    }

    async verifyUserByAccessToken (req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== "Bearer")  {
                req.user = {userId: 'none'}
                return next()
            }

            const authJwtAccessResult: ResultNotificationType<JWTAccessTokenType> = await this.authService.jwtAccessTokenAuth(req.headers.authorization.split(' ')[1])
            if (authJwtAccessResult.status != ResultNotificationEnum.Success) {
                req.user = {userId: 'none'}
                return next()
            }

            req.user = {userId: authJwtAccessResult.data!.userId}
            return next()
        } catch (e: any) {
            return res.sendStatus(500)
        }
    }

}