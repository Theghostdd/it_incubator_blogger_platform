import mongoose from "mongoose";
import {MONGO_SETTINGS} from "../../settings";
import { BlogViewMongoType} from "../../Applications/Types-Models/Blog/BlogTypes";



const BlogSchema = new mongoose.Schema<BlogViewMongoType>({
    name: {type: String, required: true, min: 1, max: 15},
    description: {type: String, required: true, min: 1, max: 500},
    websiteUrl: {type: String, required: true, min: 13, max: 100},
    createdAt: {type: String, required: true, default: new Date().toISOString()},
    isMembership: {type: Boolean, required: true, default: false},
})

export const BlogModel = mongoose.model(MONGO_SETTINGS.COLLECTIONS.blogs, BlogSchema)

