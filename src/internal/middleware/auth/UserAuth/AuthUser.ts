import {NextFunction, Request, Response} from "express"
import {AuthService} from "../../../../Service/AuthService/AuthService";
import {
    JWTAccessTokenType,
    ResultNotificationEnum,
    ResultNotificationType,
} from "../../../../Applications/Types-Models/BasicTypes";

export const AuthUser = {
    async AuthUserByAccessToken (req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.headers.authorization) return res.sendStatus(401)
            if (req.headers.authorization.split(' ')[0] !== "Bearer") return res.sendStatus(401)

            const AuthJwtAccessResult: ResultNotificationType<JWTAccessTokenType> = await AuthService.JWTAccessTokenAuth(req.headers.authorization.split(' ')[1])
            if (AuthJwtAccessResult.status != ResultNotificationEnum.Success) return res.sendStatus(401)
            req.user = {userId: AuthJwtAccessResult.data!.userId}
            return next()
        } catch (e: any) {
            return res.sendStatus(500)
        }
    }
}