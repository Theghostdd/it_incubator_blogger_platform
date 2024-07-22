import {WithId} from "mongodb"
import {JWTRefreshPayloadType} from "../BasicTypes";

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
    RefreshJWTPayload: JWTRefreshPayloadType,
    SessionData: SessionsMongoViewType
}
/*
*
*
*       Request Limiter Type
*
*
*/

export type RequestLimiterMongoViewType = WithId<RequestLimiterInputModelViewType>
export type RequestLimiterInputModelViewType = {
    ip: string,
    url: string,
    date: string,
    quantity: number
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