import {DeleteResult, ObjectId} from "mongodb";
import {HydratedDocument} from "mongoose";
import {RequestLimiterDto} from "../domain/dto";
import {IRequestLimiterInstanceMethods} from "../domain/interfaces";
import {inject, injectable} from "inversify";
import {RequestLimiterModel} from "../domain/entity";

@injectable()
export class RequestLimiterRepository {
    constructor(
        @inject(RequestLimiterModel) private requestLimiterModel: typeof RequestLimiterModel
    ) {}

    async save (request: HydratedDocument<RequestLimiterDto, IRequestLimiterInstanceMethods>): Promise<void> {
        await request.save()
    }

    async delete (request: HydratedDocument<RequestLimiterDto, IRequestLimiterInstanceMethods>): Promise<boolean> {
        const result: DeleteResult = await request.deleteOne()
        if (result.deletedCount < 1) {
            throw new Error("Something went wrong")
        }
        return true
    }

    async deleteMany (ids: ObjectId[]): Promise<void> {
        await this.requestLimiterModel.deleteMany({ _id: { $in: ids } })
    }

    async getRequestByIpAndUrl (ip: string, url: string): Promise<HydratedDocument<RequestLimiterDto, IRequestLimiterInstanceMethods> | null> {
        return this.requestLimiterModel.findOne({ip: ip, url: url})
    }

    async getExpRequest (subSecond: string): Promise<HydratedDocument<RequestLimiterDto, IRequestLimiterInstanceMethods>[] | null> {
        return this.requestLimiterModel.find({date: {$lt: subSecond}})
    }
}