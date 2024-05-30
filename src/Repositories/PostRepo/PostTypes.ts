import { ObjectId } from "mongodb"

export type PostsViewType = PostViewType[]

export type PostViewType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type PostInputType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type PostsResponseType = {
    status: number,
    message: string,
    elements: PostsViewType | null
}

export type PostResponseType = {
    status: number,
    message: string,
    elements: PostViewType | null
}

/*
*
* Mongo Types
*
*/
export type PostsMongoType = PostMongoType[]
export type PostMongoType = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}