import { ObjectId } from "mongodb"

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

