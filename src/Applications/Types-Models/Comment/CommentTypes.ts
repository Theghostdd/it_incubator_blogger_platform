import { ObjectId } from "mongodb"

/*
*
*
*       Comment Input type
*
*
*/
export type CommentInputModelType = {
    content: string
}
/*
*
*
*       Comment View type
*
*
*/
export type CommentViewModelType = {
    id: string,
    content: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string
}

/*
*
*
*       Comment create type
*
*
*/
export type CommentCreateType = {
    content: string,
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
    blogName: string
}


type  CommentatorInfo = {
    userId: string,
    userLogin: string
}
/*
*
*
*       Comment mongo view type
*
*
*/

export type CommentMongoViewType = {
    _id: ObjectId
} & CommentCreateType