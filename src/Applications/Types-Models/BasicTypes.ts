import { ObjectId } from "mongodb"

/*
*
*   Pagination Types 
*
*/
export type PaginationType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
}
export type CreatePaginationType = PaginationType & {
    skip: number
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
*   API Error Types 
*
*/
export type APIErrorsMessageType = {
    errorsMessages: APIErrorMessageType[]
}

type APIErrorMessageType = {
    message: string,
    field: string
}
export type PayloadJwtTokenType = {
    userId: string
}
/*
*
*   Response Notification Type Enum
*
*/
export enum ResultNotificationEnum {
    'Success' = 'Success',
    'NotFound' = 'NotFound',
    'BadRequest' = 'BadRequest',
    'Forbidden' = 'Forbidden',
    'Unauthorized' = 'Unauthorized'
}

export type ResultNotificationType<T = null> = {
    status: ResultNotificationEnum,
    errorMessage?: string,
    errorField?: APIErrorsMessageType
    data?: T
}












/*
*
*   NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW
*
*/

/*
*
*   Query Types
*
*/
type SortQueryBasicModelType = {
    sortBy: string,
    sortDirection: 'asc' | 'desc'
}

type PaginationQueryBasicModelType = {
    pageNumber: number,
    pageSize: number
}
/*
*
*   Pagination Type
*
*/
type PaginationBasicModelType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
}

type CreatePaginationBasicModelType = PaginationBasicModelType & {
    skip: number
}