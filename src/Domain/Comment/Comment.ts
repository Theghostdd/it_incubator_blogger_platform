import mongoose from "mongoose";
import {MONGO_SETTINGS} from "../../settings";
import {CommentMongoViewType, LikeMongoViewType} from "../../features/comment/comment-types";
import {LikeStatusEnum} from "../../typings/basic-types";

const CommentSchema = new mongoose.Schema<CommentMongoViewType>({
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

export const CommentModel = mongoose.model(MONGO_SETTINGS.COLLECTIONS.comments, CommentSchema)



const LikeSchema = new mongoose.Schema<LikeMongoViewType>({
    userId: {type: String, required: true},
    postId: {type: String, required: true},
    commentId: {type: String, required: true},
    status: {type: String, enum: Object.values(LikeStatusEnum), required: true},
    createdAt: {type: String, required: true, default: new Date().toISOString()},
    lastUpdateAt: {type: String, required: true, default: new Date().toISOString()},
})

export const LikeModel = mongoose.model(MONGO_SETTINGS.COLLECTIONS.comments_like, LikeSchema)
