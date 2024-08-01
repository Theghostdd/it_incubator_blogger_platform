import mongoose, {HydratedDocument} from "mongoose";
import {MONGO_SETTINGS} from "../../../settings";
import {UserDto} from "./dto";
import {IUserInstanceMethods, IUserModel} from "./interfaces";
import {UserRegisterInputDto} from "../api/input-models/dto";
import {addDays} from "date-fns";


export const UserSchema = new mongoose.Schema<UserDto, IUserModel, IUserInstanceMethods>({
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

UserSchema.statics.createInstance = function (registerInputDto: UserRegisterInputDto, hashPass: string, confirmCode: string): HydratedDocument<UserDto, IUserInstanceMethods>{
    const user: UserDto = {
        login: registerInputDto.login,
        email: registerInputDto.email,
        password: hashPass,
        userConfirm: {
            ifConfirm: false,
            confirmationCode: confirmCode,
            dataExpire: addDays(new Date(), 1).toISOString()
        },
        createdAt: new Date().toISOString()
    }
    return new UserModel(user)
}

UserSchema.methods.confirmEmail = function (): void {
    this.userConfirm.ifConfirm = true
}

UserSchema.methods.updateConfirmCode = function (code: string): void {
    this.userConfirm.confirmationCode = code
    this.userConfirm.dataExpire = addDays(new Date(), 1).toISOString()
}

UserSchema.methods.updatePassword = function (newPassword: string): void {
    this.password = newPassword
}

export const UserModel = mongoose.model<UserDto, IUserModel>(MONGO_SETTINGS.COLLECTIONS.users, UserSchema)

