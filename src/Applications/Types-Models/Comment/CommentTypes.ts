import { ObjectId } from "mongodb"
import { PaginationType } from "../BasicTypes"

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

export type CommentsViewModelType = PaginationType & {
    items:  CommentViewModelType[]
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
/*
*
*
*       Comment query type
*
*
*/
export type CommentQueryType = {
    pageNumber: number,
    pageSize: number,
    sortBy: string, 
    sortDirection: 'asc' | 'desc',
}