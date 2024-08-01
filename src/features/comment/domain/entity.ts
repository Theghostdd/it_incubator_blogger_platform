import mongoose, {HydratedDocument} from "mongoose";
import {MONGO_SETTINGS} from "../../../settings";
import {CommentDto} from "./dto";
import {ICommentInstanceMethod, ICommentModel} from "./interfaces";
import {CommentCreateInputModelDto, CommentUpdateInputModelDto} from "../api/input-models/dto";
import {LikeStatusEnum} from "../../../typings/basic-types";





const CommentSchema = new mongoose.Schema<CommentDto, ICommentModel, ICommentInstanceMethod>({
    content: {type: String, required: true, min: 1, max: 1000},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true},
    },
    postInfo: {
        postId: {type: String, required: true},
    },
    blogInfo: {
        blogId: {type: String, required: true},
    },
    likesInfo: {
        likesCount: {type: Number, required: true},
        dislikesCount: {type: Number, required: true},
    },
    createdAt: {type: String, required: true, default: new Date().toISOString()},
})

CommentSchema.methods.updateInstance = function (commentUpdateDto: CommentUpdateInputModelDto): void {
    this.content = commentUpdateDto.content;
}

CommentSchema.methods.updateLikesCount = function (newLikesCount: number, newDislikesCount: number, likeStatus?: LikeStatusEnum): void {
    if (likeStatus) {
        switch (likeStatus) {
            case LikeStatusEnum.Like:
                ++this.likesInfo.likesCount
                break;
            case LikeStatusEnum.Dislike:
                ++this.likesInfo.dislikesCount
                break;
        }
        return
    }

    this.likesInfo.likesCount += newLikesCount
    this.likesInfo.dislikesCount += newDislikesCount
}

CommentSchema.statics.createInstance = function (commentDto: CommentCreateInputModelDto, userId: string, userLogin: string, postId: string, blogId: string): HydratedDocument<CommentDto, ICommentInstanceMethod> {
    const comment: CommentDto = {
        content: commentDto.content,
        commentatorInfo: {
            userId: userId,
            userLogin: userLogin
        },
        postInfo: {
            postId: postId
        },
        blogInfo: {
            blogId: blogId
        },
        likesInfo: {
            likesCount: 0,
            dislikesCount: 0
        },
        createdAt: new Date().toISOString(),
    }
    return new CommentModel(comment)
}

export const CommentModel = mongoose.model<CommentDto, ICommentModel>(MONGO_SETTINGS.COLLECTIONS.comments, CommentSchema)



