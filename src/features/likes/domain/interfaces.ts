import {LikeChangeCount, LikeDto} from "./dto";
import {HydratedDocument, Model} from "mongoose";
import {LikeInputModelDto} from "../api/input-models/dto";
import {LikeStatusEnum} from "../../../typings/basic-types";


export interface ILikesInstanceMethods {
    updateLikeStatus(likeStatus: LikeStatusEnum): void
    changeCountLike(likeStatus: LikeStatusEnum, currentStatus: LikeStatusEnum): LikeChangeCount

}

export interface ILikesModel extends Model<LikeDto, {}, ILikesInstanceMethods>{
    createInstance(likeInputDto: LikeInputModelDto, parentId: string, userId: string): HydratedDocument<LikeDto, ILikesInstanceMethods>;
}