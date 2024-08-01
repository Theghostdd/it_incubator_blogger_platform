export type QueryParamsType<T = {}> = PaginationQueryType & SortQueryType & T

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
    data: T
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
*   Like status
*
*/
export enum LikeStatusEnum {
    'None' = 'None',
    'Like' = 'Like',
    'Dislike' = 'Dislike'
}

export type BlogQueryParamsType = {
    searchNameTerm?: string
}

export type UserQueryParamsType = {
    searchLoginTerm?: string,
    searchEmailTerm?: string
}