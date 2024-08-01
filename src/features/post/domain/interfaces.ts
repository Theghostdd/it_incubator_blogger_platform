import {PostInputModel, PostUpdateModel} from "../api/input-models/dto";
import {HydratedDocument, Model} from "mongoose";
import {PostDto} from "./dto";

export interface IPostInstanceMethod {
    updateInstance(postUpdateDto: PostUpdateModel): void
}

export interface IPostModel extends Model<PostDto, {}, IPostInstanceMethod >{
    createInstance(postDto: PostInputModel, blogName: string): HydratedDocument<PostDto, IPostInstanceMethod>
}