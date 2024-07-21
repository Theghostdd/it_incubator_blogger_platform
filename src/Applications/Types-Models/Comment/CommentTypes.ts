import {WithId} from "mongodb"
/*
*
*
*       Comment View type
*
*
*/
export type CommentInputModelType = {
    content: string
}

export type CommentViewModelType = {
    id: string,
    content: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string
}

export type CommentCreateType = CommentInputModelType & {
    commentatorInfo: CommentatorInfo
    postInfo: CommentPostInfoType,
    blogInfo: CommentBlogInfoType,
    createdAt: string
}

type CommentPostInfoType = {
    postId: string
}

type CommentBlogInfoType = {
    blogId: string,
}

type CommentatorInfo = {
    userId: string,
    userLogin: string
}

export type CommentMongoViewType = WithId<CommentCreateType>

