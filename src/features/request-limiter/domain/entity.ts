import mongoose, {HydratedDocument} from "mongoose";
import {MONGO_SETTINGS} from "../../../settings";
import {RequestLimiterDto} from "./dto";
import {IRequestLimiterInstanceMethods, IRequestLimiterModel} from "./interfaces";
import {RequestLimiterInputModelDto} from "../api/input-models/dto";

export const RequestLimiterSchema = new mongoose.Schema<RequestLimiterDto, IRequestLimiterModel, IRequestLimiterInstanceMethods>({
    ip: {type: String, required: true},
    url: {type: String, required: true},
    date: {type: String, required: true},
    quantity: {type: Number, required: true}
})


RequestLimiterSchema.statics.createInstance = function (requestDto: RequestLimiterInputModelDto): HydratedDocument<RequestLimiterDto, IRequestLimiterInstanceMethods> {
    const request: RequestLimiterDto = {
        quantity: requestDto.quantity,
        date: requestDto.date,
        url: requestDto.url,
        ip: requestDto.ip,
    }
    return new RequestLimiterModel(request)
}

export const RequestLimiterModel = mongoose.model<RequestLimiterDto, IRequestLimiterModel>(MONGO_SETTINGS.COLLECTIONS.request_limit, RequestLimiterSchema)