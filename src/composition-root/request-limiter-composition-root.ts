import {RequestLimiterService} from "../features/request-limiter/request-limiter-service";
import {RequestLimiterModel} from "../Domain/Auth/Auth";
import {RequestLimiterRepository} from "../features/request-limiter/request-limiter-repositories";
import {RequestLimiter} from "../internal/middleware/request-limit/request-limit";


export const requestLimiterRepository = new RequestLimiterRepository(RequestLimiterModel)
export const requestLimiterService = new RequestLimiterService(requestLimiterRepository, RequestLimiterModel)
export const requestLimiter = new RequestLimiter(requestLimiterService)