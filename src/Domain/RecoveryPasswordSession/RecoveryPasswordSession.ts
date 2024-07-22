import mongoose from "mongoose";
import {MONGO_SETTINGS} from "../../settings";
import {PasswordRecoveryMongoViewType} from "../../Applications/Types-Models/Auth/AuthTypes";


const RecoveryPasswordSessionSchema = new mongoose.Schema<PasswordRecoveryMongoViewType>({
    email: {type: String, required: true, min: 3},
    code: {type: String, required: true, min: 1},
    expAt: {type: String, required: true},
})

export const RecoveryPasswordSessionModel = mongoose.model(MONGO_SETTINGS.COLLECTIONS.recovery_pass_session, RecoveryPasswordSessionSchema)

