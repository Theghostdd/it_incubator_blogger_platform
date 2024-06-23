import { ObjectId } from "mongodb"
import { PaginationType } from "../BasicTypes"
import { RegistrationConfirm } from "../Registration/RegistrationTypes"

/*
*
*
*       User Input type
*
*
*/
export type UserInputModelType = {
    login: string,
    email: string,
    password: string
}

export type UserCreateInputModelType = UserInputModelType & {
    createdAt: string
}
/*
*
*
*       User View type
*
*
*/
export type UserViewModelType = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type UsersViewModelType = PaginationType & {
    items: UserViewModelType[] | null
}
/*
*
*
*       User`s Query params type
*
*
*/
export type UserQueryParamsType = {
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
    pageNumber?: number,
    pageSize?: number,
    searchLoginTerm?: string,
    searchEmailTerm?: string
}
/*
*
*
*       Mongo user`s model
*
*
*/
export type UserViewMongoModelType = {
    _id: ObjectId,
    login: string,
    password: string,
    email: string,
    userConfirm: RegistrationConfirm
    createdAt: string
}
/*
*
*
*       User me model type
*
*
*/
export type UserMeModelViewType = {
    login: string,
    email: string,
    userId: string
}
/*
*
*
*       User login and email 
*
*
*/
export type userLogin = {
    login: string,
    email: string,
    userId: string
}