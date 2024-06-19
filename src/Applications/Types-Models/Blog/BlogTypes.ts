import { ObjectId } from "mongodb"
import { PaginationType, SortAndPaginationQueryType } from "../BasicTypes"

/*
*
*
*       Blog Input type
*
*
*/
export type BlogInputModelType = {
    name: string,
    description: string,
    websiteUrl: string
}

export type BlogCreateInputModelType = BlogInputModelType & {
    createdAt: string,
    isMembership: boolean
}
/*
*
*
*       Blog View type
*
*
*/
export type BlogViewModelType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogsViewModelType = PaginationType & {
    items: BlogViewModelType[] | null
}
/*
*
*
*       Blog query params
*
*
*/
export type BlogQueryParamsType = {
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
    pageNumber?: number,
    pageSize?: number,
    searchNameTerm?: string
}
/*
*
*
*       Mongo blog`s model
*
*
*/
export type BlogViewMongoModelType = {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}