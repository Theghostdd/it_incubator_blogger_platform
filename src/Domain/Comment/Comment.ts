import mongoose from "mongoose";
import {MONGO_SETTINGS} from "../../settings";
import {CommentMongoViewType} from "../../Applications/Types-Models/Comment/CommentTypes";

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
    createdAt: {type: String, required: true},
})

export const CommentModel = mongoose.model(MONGO_SETTINGS.COLLECTIONS.comments, CommentSchema)

