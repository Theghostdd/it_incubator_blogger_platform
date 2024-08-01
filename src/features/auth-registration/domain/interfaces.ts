import {RecoveryPasswordSessionDto, SessionDto, UserDto} from "./dto";
import {HydratedDocument, Model} from "mongoose";
import {UserRegisterInputDto} from "../api/input-models/dto";


export interface ISessionInstanceMethods {
    updateSession (issueAt: number, expAt: number): void
}

export interface ISessionModel extends Model<SessionDto, {}, ISessionInstanceMethods> {
    createInstance(dId: string, userId: string, deviceName: string, ip: string, issueAt: number, expAt: number): HydratedDocument<SessionDto, ISessionInstanceMethods>
}





export interface IRecoveryPasswordSessionInstanceMethods {

}

export interface IRecoveryPasswordSessionModel extends Model<RecoveryPasswordSessionDto, {}, IRecoveryPasswordSessionInstanceMethods> {
    createInstance (email: string, code: string): HydratedDocument<RecoveryPasswordSessionDto, IRecoveryPasswordSessionInstanceMethods>
}




export interface IUserInstanceMethods {
    confirmEmail(): void
    updateConfirmCode(code: string): void
    updatePassword(newPassword: string): void
}

export interface IUserModel extends Model<UserDto, {}, IUserInstanceMethods> {
    createInstance (registerInputDto: UserRegisterInputDto, hashPass: string, confirmCode: string): HydratedDocument<UserDto, IUserInstanceMethods>
}
