import {WithId} from "mongodb"
/*
*
*
*       Blog View type
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

export type BlogViewModelType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogViewMongoType = WithId<BlogCreateInputModelType>
/*
*
*
*       Blog query params
*
*
*/
export type BlogQueryParamsType = {
    searchNameTerm?: string
}