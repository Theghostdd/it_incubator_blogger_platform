import mongoose from "mongoose";
import {MONGO_SETTINGS} from "../../settings";
import {PostViewMongoModelType} from "../../features/post/post-types";


const PostSchema = new mongoose.Schema<PostViewMongoModelType>({
    title: {type: String, required: true, min: 1, max: 30},
    shortDescription: {type: String, required: true, min: 1, max: 100},
    content: {type: String, required: true, min: 1, max: 1000},
    blogId: {type: String, required: true},
    createdAt: {type: String, required: true, default: new Date().toISOString()},
    blogName: {type: String, required: true, min: 1, max: 15},
})

export const PostModel = mongoose.model(MONGO_SETTINGS.COLLECTIONS.posts, PostSchema)

