import { NextFunction, Request, Response } from "express";
import { MONGO_SETTINGS } from "../../../settings";
import { addSeconds, subSeconds} from "date-fns";
import { AuthService } from "../../../Service/AuthService/AuthService";
import { ResultNotificationEnum, ResultNotificationType } from "../../Types-Models/BasicTypes";
import { RequestLimiterInputModelViewType } from "../../Types-Models/Auth/AuthTypes";
import { SaveError } from "../../../Utils/error-utils/save-error";
/*
* 1. Gathers data including IP address, request URL, and a timestamp with 10 seconds added.
* 2. Calls an external service with the collected data.
*    a. If the service responds with `Success`, proceeds to the next middleware function.
*    b. If the service responds with `BadRequest`, sends a HTTP status code 429 (Too Many Requests).
*    c. If any other status is returned, sends a HTTP status code 500 (Internal Server Error).
* 3. Catches any errors that occur during the execution:
*    a. Logs the error using `SaveError` function with specific details.
*    b. Sends a HTTP status code 500 (Internal Server Error) in response.
*/
export const requestLimiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: RequestLimiterInputModelViewType = {
            ip: req.ip || req.socket.remoteAddress!,
            url: req.originalUrl,
            date: addSeconds(new Date(), 10).toISOString(),
            quantity: 1
        }
    
        const result: ResultNotificationType = await AuthService.RequestLimiter(data)
        switch(result.status) {
            case ResultNotificationEnum.Success:
                return next()
            case ResultNotificationEnum.BadRequest:
                return res.sendStatus(429)
            default: return res.sendStatus(500)
        }      
    } catch(e) {
        await SaveError(`${MONGO_SETTINGS.COLLECTIONS.request_limit}`, 'MIDDLEWARE Request Limiter', 'Limiting requests', e)
        return res.sendStatus(500)
    }
}
/*
* 1. Attempts to clear expired requests from the request limit collection.
*    a. Calls service with a timestamp that is 30 seconds before the current time.
*    b. If successful, the expired requests are removed from the collection.
*    c. If an error occurs during the operation, logs the error using `SaveError` function with specific details.
*/
export const clearRequestCollection = async () => {
    try {
        await AuthService.ClearRequestLimitCollection(subSeconds(new Date(), 30).toISOString())
    } catch(e) {
        await SaveError(`${MONGO_SETTINGS.COLLECTIONS.request_limit}`, 'DELETE', 'Delete expire request', e)
    }
}

