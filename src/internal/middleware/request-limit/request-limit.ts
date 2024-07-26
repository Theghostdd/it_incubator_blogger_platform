import { NextFunction, Request, Response } from "express";
import { MONGO_SETTINGS } from "../../../settings";
import { addSeconds, subSeconds} from "date-fns";
import { ResultNotificationEnum, ResultNotificationType } from "../../../typings/basic-types";
import {RequestLimiterInputModelViewType} from "../../../features/request-limiter/request-limiter-types";
import {saveError} from "../../utils/error-utils/save-error";
import {RequestLimiterService} from "../../../features/request-limiter/request-limiter-service";


export class RequestLimiter {
    constructor(
        protected requestLimiterService: RequestLimiterService,
    ) {}

    async requestLimiter (req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.ip || !req.socket.remoteAddress) return res.sendStatus(403)

            const data: RequestLimiterInputModelViewType = {
                ip: req.ip || req.socket.remoteAddress,
                url: req.originalUrl,
                date: addSeconds(new Date(), 10).toISOString(),
                quantity: 1
            }

            const result: ResultNotificationType = await this.requestLimiterService.requestLimiter(data)
            switch(result.status) {
                case ResultNotificationEnum.Success:
                    return next()
                case ResultNotificationEnum.BadRequest:
                    return res.sendStatus(429)
                default: return res.sendStatus(500)
            }
        } catch(e) {
            await saveError(`${MONGO_SETTINGS.COLLECTIONS.request_limit}`, 'MIDDLEWARE Request Limiter', 'Limiting requests', e)
            return res.sendStatus(500)
        }
    }

    async clearRequestCollection () {
        try {
            await this.requestLimiterService.clearRequestLimitCollection(subSeconds(new Date(), 30).toISOString())
        } catch(e: any) {
            await saveError(`${MONGO_SETTINGS.COLLECTIONS.request_limit}`, 'DELETE', 'Delete expire request', e)
        }
    }
}
// export const requestLimiter = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         if (!req.ip || !req.socket.remoteAddress) return res.sendStatus(403)
//
//         const data: RequestLimiterInputModelViewType = {
//             ip: req.ip || req.socket.remoteAddress,
//             url: req.originalUrl,
//             date: addSeconds(new Date(), 10).toISOString(),
//             quantity: 1
//         }
//         // TODO
//         const result: ResultNotificationType = await
//         switch(result.status) {
//             case ResultNotificationEnum.Success:
//                 return next()
//             case ResultNotificationEnum.BadRequest:
//                 return res.sendStatus(429)
//             default: return res.sendStatus(500)
//         }
//     } catch(e) {
//         await saveError(`${MONGO_SETTINGS.COLLECTIONS.request_limit}`, 'MIDDLEWARE Request Limiter', 'Limiting requests', e)
//         return res.sendStatus(500)
//     }
// }

// export const clearRequestCollection = async () => {
//     try {
//         // TODO
//         await // AuthService.ClearRequestLimitCollection(subSeconds(new Date(), 30).toISOString())
//     } catch(e) {
//         await saveError(`${MONGO_SETTINGS.COLLECTIONS.request_limit}`, 'DELETE', 'Delete expire request', e)
//     }
// }

