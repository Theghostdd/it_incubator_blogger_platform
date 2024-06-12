import { ObjectId } from "mongodb"
import { PaginationType, errorsApiFieldsType } from "../Types"


export type UserInputModel = {
    login: string,
    password: string,
    email: string
}

export type UserCreateModel = UserInputModel & {
    createdAt: string
}

export type UserViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}



export type UserMongoOutputType = {
    _id: ObjectId,
    login: string,
    email: string,
    password: string,
    createdAt: string
}

export type UserOutputType = {
    status: number,
    data: UserViewModel | errorsApiFieldsType | null
}

export type UsersOutputType = {
    status: number;
    data: {
        pagesCount: number,
        page: number,
        pageSize: number,
        totalCount: number,
        items: UserViewModel[];
    } | null
};

export type UserQueryParamsType = {
    sortBy?: string,
    sortDirection?: string,
    pageNumber?: number,
    pageSize?: number,
    searchLoginTerm?: string,
    searchEmailTerm?: string
}
