import { PaginationType, SortAndPaginationQueryType } from "../BasicTypes"

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
export type UserQueryParamsType = SortAndPaginationQueryType & {
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
    _id: string,
    login: string,
    password: string,
    email: string,
    createdAt: string
}
