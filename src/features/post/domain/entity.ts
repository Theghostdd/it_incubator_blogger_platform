import mongoose from "mongoose";
import {MONGO_SETTINGS} from "../../../settings";
import {PostDto} from "./dto";
import {PostInputModel, PostUpdateModel} from "../api/input-models/dto";
import {IPostInstanceMethod, IPostModel} from "./interfaces";
import {LikeStatusEnum} from "../../../typings/basic-types";



const PostSchema = new mongoose.Schema<PostDto, IPostModel, IPostInstanceMethod>({
    title: {type: String, required: true, min: 1, max: 30},
    shortDescription: {type: String, required: true, min: 1, max: 100},
    content: {type: String, required: true, min: 1, max: 1000},
    blogId: {type: String, required: true},
    createdAt: {type: String, required: true, default: new Date().toISOString()},
    blogName: {type: String, required: true, min: 1, max: 15},
    extendedLikesInfo: {
        likesCount: {type: Number, required: true, default: 0},
        dislikesCount: {type: Number, required: true, default: 0},
    }
})


PostSchema.statics.createInstance = function (postDto: PostInputModel, blogName: string) {
    const result: PostDto = {
        title: postDto.title,
        shortDescription: postDto.shortDescription,
        content: postDto.content,
        blogId: postDto.blogId,
        createdAt: new Date().toISOString(),
        blogName: blogName,
        extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0
        }
    }
    return new PostModel(result)
}
PostSchema.methods.updateInstance = function (postUpdateDto: PostUpdateModel) {
    this.title = postUpdateDto.title
    this.shortDescription = postUpdateDto.shortDescription
    this.content = postUpdateDto.content
}
PostSchema.methods.updateLikesCount = function (newLikesCount: number, newDislikesCount: number, likeStatus?: LikeStatusEnum): void {
    if (likeStatus) {
        switch (likeStatus) {
            case LikeStatusEnum.Like:
                ++this.extendedLikesInfo.likesCount
                break;
            case LikeStatusEnum.Dislike:
                ++this.extendedLikesInfo.dislikesCount
                break;
        }
        return
    }

    this.extendedLikesInfo.likesCount += newLikesCount
    this.extendedLikesInfo.dislikesCount += newDislikesCount
}

export const PostModel = mongoose.model<PostDto, IPostModel>(MONGO_SETTINGS.COLLECTIONS.posts, PostSchema)



