import mongoose from "mongoose";
import {UserViewMongoType} from "../../Applications/Types-Models/User/UserTypes";
import {MONGO_SETTINGS} from "../../settings";




export const UserSchema = new mongoose.Schema<UserViewMongoType>({
    login: {type: String, required: true, min: 3, max: 10, unique: true},
    email: {type: String, required: true, min: 3, unique: true},
    userConfirm: {
        ifConfirm: {type: Boolean, required: true, default: false},
        confirmationCode: {type: String, required: true},
        dataExpire: {type: String, required: true}
    },
    password: {type: String, required: true, min: 6, max: 20},
    createdAt: {type: String, required: true, default: new Date().toISOString()}
})



export const UserModel = mongoose.model(MONGO_SETTINGS.COLLECTIONS.users, UserSchema)

