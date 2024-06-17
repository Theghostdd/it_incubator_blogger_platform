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
/*
*
*   Sorting and Pagination Query Types 
*
*/
export type SortAndPaginationQueryType = {
    sortBy?: string,
    sortDirection?: 'asc' | 'desc'
    pageNumber?: number,
    pageSize?: number
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
/*
*
*   JWT Type
*
*/
export type JwtType = {
    accessToken: string
}