import {CommentDto} from "./dto";
import {HydratedDocument, Model} from "mongoose";
import {CommentCreateInputModelDto, CommentUpdateInputModelDto} from "../api/input-models/dto";
import {LikeStatusEnum} from "../../../typings/basic-types";


export interface ICommentInstanceMethod {
    updateInstance (commentUpdateDto: CommentUpdateInputModelDto): void
    updateLikesCount (newLikesCount: number, newDislikesCount: number, likeStatus?: LikeStatusEnum): void
}

export interface ICommentModel extends Model<CommentDto, {}, ICommentInstanceMethod>{
    createInstance(commentDto: CommentCreateInputModelDto, userId: string, userLogin: string, postId: string, blogId: string): HydratedDocument<CommentDto, ICommentInstanceMethod>
}