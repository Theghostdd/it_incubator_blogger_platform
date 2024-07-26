import {WithId} from "mongodb"
import {JWTRefreshPayloadType} from "../../../typings/basic-types";

/*
*
*
*       Login type
*
*
*/
export type UserLoginInputViewType = {
    loginOrEmail: string,
    password: string
}
/*
*
*
*       Response after login type
*
*
*/
export type AuthOutputModelType = {
    accessToken: string
}
export type AuthModelServiceType = AuthOutputModelType & {
    refreshToken: string
}
/*
*
*
*       Sessions type
*
*
*/
export type SessionsMongoViewType = WithId<SessionsInputViewType>

export type SessionsInputViewType = {
    dId: string,
    userId: string,
    deviceName: string,
    ip: string,
    issueAt: string,
    expAt: string
}


export type SessionOutputModelViewType = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}

export type RefreshAuthOutputModelType = {
    refreshJWTPayload: JWTRefreshPayloadType,
    sessionData: SessionsMongoViewType
}
/*
*
*
*       Password recovery type
*
*
*/
export type PasswordRecoveryInputViewType = {
    email: string,
}

export type PasswordRecoveryCreateModelType = PasswordRecoveryInputViewType & {
    code: string,
    expAt: string
}

export type PasswordRecoveryMongoViewType = WithId<PasswordRecoveryCreateModelType>

export type ChangePasswordInputViewType = {
    newPassword: "string",
    recoveryCode: "string"
}