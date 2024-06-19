import { ObjectId } from "mongodb"
import { PaginationType } from "../BasicTypes"

/*
*
*
*       Post Input type
*
*
*/
export type PostInputModelType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type PostCreateInputModelType = PostInputModelType & {
    createdAt: string,
    blogName: string
}
/*
*
*
*       Post View type
*
*
*/
export type PostViewModelType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type PostsViewModelType = PaginationType & {
    items: PostInputModelType[] | null
}
/*
*
*
*       Mongo post`s model
*
*
*/
export type PostViewMongoModelType = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}
/*
*
*
*       Post query values
*
*
*/
export type PostQueryValues = {
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    pageNumber?: number
    pageSize?: number
}