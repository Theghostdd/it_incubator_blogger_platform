import {HydratedDocument, Model} from "mongoose";
import {RequestLimiterDto} from "./dto";
import {RequestLimiterInputModelDto} from "../api/input-models/dto";


export interface IRequestLimiterInstanceMethods  {}

export interface IRequestLimiterModel extends Model<RequestLimiterDto, {}, IRequestLimiterInstanceMethods> {
    createInstance (requestDto: RequestLimiterInputModelDto): HydratedDocument<RequestLimiterDto, IRequestLimiterInstanceMethods>
}