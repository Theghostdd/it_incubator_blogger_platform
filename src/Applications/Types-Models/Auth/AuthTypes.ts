import { ObjectId } from "mongodb"
import { JWTRefreshPayload } from "../BasicTypes"

/*
*
*
*       Login Input type
*
*
*/
export type LoginInputModelType = {
    loginOrEmail: string,
    password: string
}
/*
*
*
*       Auth output model
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
*       Auth output model
*
*
*/
export type ConfirmCodeInputModelType = {
    code: string
}
/*
*
*
*       Token Mongo View Type
*
*
*/ 
export type TokenBlackListMongoViewType = {
    _id: ObjectId,
    token: string,
    userId: string,
    exp: number
}

export type TokenInputModelType = {
    token: string
    userId: string,
    exp: number
}
/*
*
*
*       Request Limiter Mongo View Type
*
*
*/ 
export type RequestLimiterMongoViewType = {
    _id: ObjectId,
    ip: string,
    url: string,
    date: Date,
    quantity: number
}

export type RequestLimiterInputModelViewType = {
    ip: string,
    url: string,
    date: Date,
    quantity: number
}
/*
*
*
*       Sessions type 
*
*
*/
export type SessionsMongoViewType = {
    _id: ObjectId,
    dId: string,
    userId: ObjectId,
    deviceName: string,
    ip: string,
    issueAt: string
}

export type SessionsInputModelViewType = {
    dId: string,
    userId: ObjectId,
    deviceName: string,
    ip: string,
    issueAt: string
}

export type SessionOutputModelViewType = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}








export type RefreshAuthOutputModelType = {
    RefreshJWTPayload: JWTRefreshPayload,
    SessionData: SessionsMongoViewType
}