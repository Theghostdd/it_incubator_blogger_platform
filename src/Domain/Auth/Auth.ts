import mongoose from "mongoose";
import {MONGO_SETTINGS} from "../../settings";
import {SessionsMongoViewType} from "../../features/auth-registration/auth/auth-types";
import {RequestLimiterMongoViewType} from "../../features/request-limiter/request-limiter-types";



export const AuthSessionSchema = new mongoose.Schema<SessionsMongoViewType>({
    dId: {type: String, required: true, unique: true},
    ip: {type: String, required: true},
    deviceName: {type: String, required: true},
    userId: {type: String},
    issueAt: {type: String, required: true},
    expAt: {type: String, required: true},
})

export const AuthSessionModel = mongoose.model(MONGO_SETTINGS.COLLECTIONS.auth_session, AuthSessionSchema)

export const RequestLimiterSchema = new mongoose.Schema<RequestLimiterMongoViewType>({
    ip: {type: String, required: true},
    url: {type: String, required: true},
    date: {type: String, required: true},
    quantity: {type: Number, required: true}
})

export const RequestLimiterModel = mongoose.model(MONGO_SETTINGS.COLLECTIONS.request_limit, RequestLimiterSchema)