import {RequestLimiterModel} from "../../Domain/Auth/Auth";
import {DeleteResult, ObjectId} from "mongodb";
import {RequestLimiterMongoViewType} from "./request-limiter-types";


export class RequestLimiterRepository {
    constructor(
        protected requestLimiterModel: typeof RequestLimiterModel
    ) {
    }
    async save (request: InstanceType<typeof RequestLimiterModel>): Promise<InstanceType<typeof RequestLimiterModel>> {
        try {
            return await request.save()
        } catch (e:any) {
            throw new Error(e)
        }
    }

    async delete (request: InstanceType<typeof RequestLimiterModel>): Promise<DeleteResult> {
        try {
            return await request.deleteOne()
        } catch (e:any) {
            throw new Error(e)
        }
    }

    async deleteMany (ids: ObjectId[]): Promise<DeleteResult> {
        try {
            return await this.requestLimiterModel.deleteMany({ _id: { $in: ids } })
        } catch (e:any) {
            throw new Error(e)
        }
    }

    async getRequestByIpAndUrl (ip: string, url: string): Promise<InstanceType<typeof RequestLimiterModel> | null> {
        try {
            return await this.requestLimiterModel.findOne({ip: ip, url: url})
        } catch (e:any) {
            throw new Error(e)
        }
    }

    async getExpRequest (subSecond: string): Promise<RequestLimiterMongoViewType[] | []> {
        try {
            return await this.requestLimiterModel.find({date: {$lt: subSecond}}).lean()
        } catch (e: any){
            throw new Error(e)
        }
    }
}