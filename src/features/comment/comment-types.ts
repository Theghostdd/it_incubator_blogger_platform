import {WithId} from "mongodb"
import {LikeStatusEnum} from "../../typings/basic-types";
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
    likesInfo: LikeInfoType,
    createdAt: string,
}

export type CommentCreateType = CommentInputModelType & {
    commentatorInfo: CommentatorInfo
    postInfo: CommentPostInfoType,
    blogInfo: CommentBlogInfoType,
    likesInfo: Omit<LikeInfoType, 'myStatus'>,
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

export type CommentDtoViewType = CommentMongoViewType & {
    statusUserLike: LikeStatusEnum
}

export type CommentMongoViewType = WithId<CommentCreateType>
/*
*
*
*       Likes type
*
*
*/
type LikeInfoType = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatusEnum
}

export type LikeStatusType = {
    likeStatus: string
}

export type LikeMongoViewType = WithId<LikeCreateViewType>

export type LikeCreateViewType = {
    commentId: string,
    postId: string,
    userId: string,
    status: LikeStatusEnum,
    createdAt: string,
    lastUpdateAt: string,
}


