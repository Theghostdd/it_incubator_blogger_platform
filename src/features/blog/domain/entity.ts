import mongoose, {HydratedDocument, Model} from "mongoose";
import {MONGO_SETTINGS} from "../../../settings";
import {BlogDto} from "./dto";
import {IBlogInstanceMethod, IBlogModel} from "./interfaces";
import {CreateInputBlogDto, UpdateInputBlogDto} from "../api/input-models/dto";

export const BlogSchema = new mongoose.Schema<BlogDto, IBlogModel, IBlogInstanceMethod>({
    name: {type: String, required: true, min: 1, max: 15},
    description: {type: String, required: true, min: 1, max: 500},
    websiteUrl: {type: String, required: true, min: 13, max: 100},
    createdAt: {type: String, required: true, default: new Date().toISOString()},
    isMembership: {type: Boolean, required: true, default: false}
})


BlogSchema.statics.createInstance = function (blogDto: CreateInputBlogDto) {
    const blog: BlogDto = {
        name: blogDto.name,
        description: blogDto.description,
        websiteUrl: blogDto.websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: false,
    }
    return new BlogModel(blog)
}
BlogSchema.methods.updateInstance = function (updateBlogDto: UpdateInputBlogDto) {
    this.name = updateBlogDto.name
    this.description = updateBlogDto.description
    this.websiteUrl = updateBlogDto.websiteUrl
}


export const BlogModel = mongoose.model<BlogDto, IBlogModel>(MONGO_SETTINGS.COLLECTIONS.blogs, BlogSchema)



