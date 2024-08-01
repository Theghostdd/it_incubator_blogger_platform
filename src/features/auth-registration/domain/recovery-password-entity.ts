import mongoose, {HydratedDocument} from "mongoose";
import {MONGO_SETTINGS} from "../../../settings";
import {RecoveryPasswordSessionDto} from "./dto";
import {IRecoveryPasswordSessionInstanceMethods, IRecoveryPasswordSessionModel} from "./interfaces";
import {addMinutes} from "date-fns";





const RecoveryPasswordSessionSchema = new mongoose.Schema<RecoveryPasswordSessionDto, IRecoveryPasswordSessionModel, IRecoveryPasswordSessionInstanceMethods>({
    email: {type: String, required: true, min: 3},
    code: {type: String, required: true, min: 1},
    expAt: {type: String, required: true},
})

RecoveryPasswordSessionSchema.statics.createInstance = function (email: string, code: string): HydratedDocument<RecoveryPasswordSessionDto, IRecoveryPasswordSessionInstanceMethods> {
    const session: RecoveryPasswordSessionDto = {
        email: email,
        code: code,
        expAt: addMinutes(new Date(), 20).toISOString()
    }
    return new RecoveryPasswordSessionModel(session)
}

export const RecoveryPasswordSessionModel = mongoose.model<RecoveryPasswordSessionDto, IRecoveryPasswordSessionModel>(MONGO_SETTINGS.COLLECTIONS.recovery_pass_session, RecoveryPasswordSessionSchema)

