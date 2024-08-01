import {WithId} from "mongodb"
import {RegistrationCreatType} from "../auth-registration/registration-types";
/*
*
*
*       User Model type
*
*
*/
export type UserViewMongoType = WithId<RegistrationCreatType>

export type UserConfirmationViewType = {
    ifConfirm: boolean,
    confirmationCode: string,
    dataExpire: string
}

export type UserMeModelViewType = {
    login: string,
    email: string,
    userId: string
}

export type UserViewModelType = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}
/*
*
*
*       User query type
*
*
*/
export type UserQueryParamsType = {
    searchLoginTerm?: string,
    searchEmailTerm?: string
}