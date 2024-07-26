import {ObjectId, WithId} from "mongodb";
/*
*
*   jwt Payload
*
*/
export type JWTAccessTokenType = {
    userId: string,
    iat: number,
    exp: number
}

export type JWTRefreshPayloadType = {
    deviceId: string,
    userId: string,
    iat: number,
    exp: number
}
/*
*
*   Query Types
*
*/
export type QueryParamsType<T = {}> = PaginationQueryType & SortQueryType & T

/*
*
*   Pagination and sort Types
*
*/
type PaginationQueryType = {
    pageNumber?: number,
    pageSize?: number,
}

type SortQueryType = {
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
}

type PaginationType = {
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
*   Response Notification Type Enum
*
*/
export enum ResultNotificationEnum {
    'Success' = 'Success',
    'NotFound' = 'NotFound',
    'BadRequest' = 'BadRequest',
    'Forbidden' = 'Forbidden',
    'Unauthorized' = 'Unauthorized',
    'InternalError' = 'InternalError'
}

export type ResultNotificationType<T = null> = {
    status: ResultNotificationEnum,
    errorMessage?: string,
    errorField?: APIErrorsMessageType
    data?: T
}

export type ResultDataWithPaginationType<T = []> = PaginationType & {
    items: T
}

export type APIErrorsMessageType = {
    errorsMessages: APIErrorMessageType[]
}

type APIErrorMessageType = {
    message: string,
    field: string
}
/*
*
*   User request types
*
*/
export type UserRequestType = {
    userId: string,
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
*   Patterns mail
*
*/
export type PatternMailType = {
    subject: string,
    html: string
}
