import {ResultNotificationEnum, ResultNotificationType} from "../../typings/basic-types";
import {compareAsc} from "date-fns";
import {RequestLimiterInputModelViewType, RequestLimiterMongoViewType} from "./request-limiter-types";
import {RequestLimiterModel} from "../../Domain/Auth/Auth";
import {RequestLimiterRepository} from "./request-limiter-repositories";

export class RequestLimiterService {
    constructor(
        protected requestLimiterRepository: RequestLimiterRepository,
        protected requestLimiterModel: typeof RequestLimiterModel
    ) {}

    async requestLimiter(data: RequestLimiterInputModelViewType): Promise<ResultNotificationType> {
        try {
            const request: InstanceType<typeof RequestLimiterModel> | null = await this.requestLimiterRepository.getRequestByIpAndUrl(data.ip, data.url)
            if (!request) {
                await this.requestLimiterRepository.save(new this.requestLimiterModel(data))
                return {status: ResultNotificationEnum.Success}
            }

            const { date } = request
            let { quantity} = request
            if (compareAsc(new Date(date), new Date()) === 1 && quantity >= 5) {
                return {status: ResultNotificationEnum.BadRequest}
            }

            if (compareAsc(new Date(date), new Date()) === 1 && quantity >= 1) {
                ++request.quantity
                await this.requestLimiterRepository.save(request)
                return {status: ResultNotificationEnum.Success}
            }
            request.quantity = 1
            request.date = data.date
            await this.requestLimiterRepository.save(request)
            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async clearRequestLimitCollection(subSecond: string): Promise<ResultNotificationType> {
        try {
            const requests: RequestLimiterMongoViewType[] | null = await this.requestLimiterRepository.getExpRequest(subSecond)
            if (requests && requests.length > 0) {
                await this.requestLimiterRepository.deleteMany(
                    requests.map((items) => items._id)
                )
            }

            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}
