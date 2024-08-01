import {ResultNotificationEnum, ResultNotificationType} from "../../../typings/basic-types";
import {compareAsc} from "date-fns";
import {RequestLimiterRepository} from "../infrastructure/request-limiter-repositories";
import {RequestLimiterModel} from "../domain/entity";
import {inject, injectable} from "inversify";
import {RequestLimiterInputModelDto} from "../api/input-models/dto";
import {HydratedDocument} from "mongoose";
import {RequestLimiterDto} from "../domain/dto";
import {IRequestLimiterInstanceMethods} from "../domain/interfaces";

@injectable()
export class RequestLimiterService {
    constructor(
        @inject(RequestLimiterRepository) private requestLimiterRepository: RequestLimiterRepository,
        @inject(RequestLimiterModel) private requestLimiterModel: typeof RequestLimiterModel
    ) {}

    async requestLimiter(requestDto: RequestLimiterInputModelDto): Promise<ResultNotificationType> {
        const request: HydratedDocument<RequestLimiterDto, IRequestLimiterInstanceMethods> | null = await this.requestLimiterRepository.getRequestByIpAndUrl(requestDto.ip, requestDto.url)
        if (!request) {
            const newRequest: HydratedDocument<RequestLimiterDto, IRequestLimiterInstanceMethods> = this.requestLimiterModel.createInstance(requestDto);
            await this.requestLimiterRepository.save(newRequest)
            return {status: ResultNotificationEnum.Success, data: null}
        }

        const {date} = request
        let {quantity} = request
        if (compareAsc(new Date(date), new Date()) === 1 && quantity >= 5) {
            return {status: ResultNotificationEnum.BadRequest, data: null}
        }

        if (compareAsc(new Date(date), new Date()) === 1 && quantity >= 1) {
            ++request.quantity
            await this.requestLimiterRepository.save(request)
            return {status: ResultNotificationEnum.Success, data: null}
        }
        request.quantity = 1
        request.date = requestDto.date
        await this.requestLimiterRepository.save(request)
        return {status: ResultNotificationEnum.Success, data: null}
    }

    async clearRequestLimitCollection(subSecond: string): Promise<ResultNotificationType> {
        const requests:HydratedDocument<RequestLimiterDto, IRequestLimiterInstanceMethods>[] | null = await this.requestLimiterRepository.getExpRequest(subSecond)
        if (requests && requests.length > 0) {
            await this.requestLimiterRepository.deleteMany(
                requests.map((items) => items._id)
            )
        }

        return {status: ResultNotificationEnum.Success, data: null}
    }
}
