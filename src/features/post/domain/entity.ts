import mongoose, {HydratedDocument, Model} from "mongoose";
import {PostViewMongoModelType} from "../post-types";
import {MONGO_SETTINGS} from "../../../settings";
import {PostDto} from "./dto";
import {PostInputModel, PostUpdateModel} from "../api/input-models/dto";





export interface IPostInstanceMethod {
    updateInstance(postUpdateDto: PostUpdateModel): void
}

export interface IPostModel extends Model<PostDto, {}, IPostInstanceMethod >{
    createInstance(postDto: PostInputModel, blogName: string): HydratedDocument<PostDto, IPostInstanceMethod>
}


const PostSchema = new mongoose.Schema<PostDto, IPostModel, IPostInstanceMethod>({
    title: {type: String, required: true, min: 1, max: 30},
    shortDescription: {type: String, required: true, min: 1, max: 100},
    content: {type: String, required: true, min: 1, max: 1000},
    blogId: {type: String, required: true},
    createdAt: {type: String, required: true, default: new Date().toISOString()},
    blogName: {type: String, required: true, min: 1, max: 15},
})


PostSchema.statics.createInstance = function (postDto: PostInputModel, blogName: string) {
    const result: PostDto = {
        title: postDto.title,
        shortDescription: postDto.shortDescription,
        content: postDto.content,
        blogId: postDto.blogId,
        createdAt: new Date().toISOString(),
        blogName: blogName,
    }
    return new PostModel(result)
}
PostSchema.methods.updateInstance = function (postUpdateDto: PostUpdateModel) {
    this.title = postUpdateDto.title
    this.shortDescription = postUpdateDto.shortDescription
    this.content = postUpdateDto.content
}



export const PostModel = mongoose.model<PostDto, IPostModel>(MONGO_SETTINGS.COLLECTIONS.posts, PostSchema)

