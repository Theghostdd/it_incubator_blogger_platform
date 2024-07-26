import {WithId} from "mongodb"
/*
*
*
*       post View type
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

export type PostViewModelType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type PostViewMongoModelType = WithId<PostCreateInputModelType>