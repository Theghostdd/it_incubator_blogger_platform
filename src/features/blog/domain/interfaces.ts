import {CreateInputBlogDto, UpdateInputBlogDto} from "../api/input-models/dto";
import {HydratedDocument, Model} from "mongoose";
import {BlogDto} from "./dto";

export interface IBlogInstanceMethod {
    updateInstance(updateBlogDto: UpdateInputBlogDto): void
}

export interface IBlogModel extends Model<BlogDto, {}, IBlogInstanceMethod>{
    createInstance(blogDto: CreateInputBlogDto): HydratedDocument<BlogDto, IBlogInstanceMethod>
}