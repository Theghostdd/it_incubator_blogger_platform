import { BlogViewType, BlogsViewType } from "./BlogsTypes/BlogTypes"
import { PostViewType, PostsViewType } from "./PostsTypes/PostTypes"
import { ObjectId } from "mongodb"
/*
*
*   Tests 
*
*/
export type InspectType = {
    status: number,
    headers: InspectHeadersType,
    checkValues: Object
}

type InspectHeadersType = {
    basic_auth: string
}
/*
*
*   Request 
*
*/
export type RequestParamsType = {
    id: string
}
/*
*
*   Response 
*
*/
export type ResponseType = BlogViewType | PostViewType

export type AllResponseType = BlogsViewType | PostsViewType

export type StatusResponse = {
    status: number
}
/*
*
*   Mongo Types 
*
*/
export type UpdateMongoSuccessType = {
    acknowledged: boolean,
    modifiedCount: number,
    upsertedId: ObjectId | null,
    upsertedCount: number,
    matchedCount: number
}
export type CreatedMongoSuccessType = {
    acknowledged: boolean,
    insertedId: ObjectId
}
export type DeletedMongoSuccessType = {
    acknowledged: boolean,
    deletedCount: number
}
/*
*
*   Pagination and Sort Types 
*
*/
export type PaginationType = {
    totalCount: number,
    pagesCount: number,
    skip: number,
    pageSize: number,
    page: number
}

export type errorsApiFieldsType = {
    errorsMessages: errorFieldType[]
}

type errorFieldType = {
    message: string,
    field: string
}
