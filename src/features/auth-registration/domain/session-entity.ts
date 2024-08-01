import mongoose, {HydratedDocument} from "mongoose";
import {MONGO_SETTINGS} from "../../../settings";
import {SessionDto} from "./dto";
import {ISessionInstanceMethods, ISessionModel} from "./interfaces";


export const AuthSessionSchema = new mongoose.Schema<SessionDto, ISessionModel, ISessionInstanceMethods>({
    dId: {type: String, required: true, unique: true},
    ip: {type: String, required: true},
    deviceName: {type: String, required: true},
    userId: {type: String},
    issueAt: {type: String, required: true},
    expAt: {type: String, required: true},
})


AuthSessionSchema.statics.createInstance = function (dId: string, userId: string, deviceName: string, ip: string, issueAt: number, expAt: number): HydratedDocument<SessionDto, ISessionInstanceMethods> {
    const session: SessionDto = {
        dId: dId,
        userId: userId,
        deviceName: deviceName,
        ip: ip,
        issueAt: new Date(issueAt * 1000).toISOString(),
        expAt: new Date(expAt * 1000).toISOString()
    }
    return new AuthSessionModel(session)
}

AuthSessionSchema.methods.updateSession = function (issueAt: number, expAt: number): void {
    this.issueAt = new Date(issueAt * 1000).toISOString()
    this.expAt = new Date(expAt * 1000).toISOString()
}

export const AuthSessionModel = mongoose.model<SessionDto, ISessionModel>(MONGO_SETTINGS.COLLECTIONS.auth_session, AuthSessionSchema)