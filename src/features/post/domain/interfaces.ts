import {PostInputModel, PostUpdateModel} from "../api/input-models/dto";
import {HydratedDocument, Model} from "mongoose";
import {PostDto} from "./dto";
import {LikeStatusEnum} from "../../../typings/basic-types";

export interface IPostInstanceMethod {
    updateInstance (postUpdateDto: PostUpdateModel): void
    updateLikesCount (newLikesCount: number, newDislikesCount: number, likeStatus?: LikeStatusEnum): void
}

export interface IPostModel extends Model<PostDto, {}, IPostInstanceMethod >{
    createInstance(postDto: PostInputModel, blogName: string): HydratedDocument<PostDto, IPostInstanceMethod>
}