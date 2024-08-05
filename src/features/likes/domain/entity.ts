import mongoose, {HydratedDocument} from "mongoose";
import {LikeStatusEnum} from "../../../typings/basic-types";
import {MONGO_SETTINGS} from "../../../settings";
import {LikeChangeCount, LikeDto, LikeStatusState} from "./dto";
import {ILikesInstanceMethods, ILikesModel} from "./interfaces";
import {LikeInputModelDto} from "../api/input-models/dto";



const LikeSchema = new mongoose.Schema<LikeDto, ILikesModel, ILikesInstanceMethods>({
    userId: {type: String, required: true},
    parentId: {type: String, required: true},
    status: {type: String, enum: Object.values(LikeStatusEnum), required: true},
    createdAt: {type: String, required: true, default: new Date().toISOString()},
    lastUpdateAt: {type: String, required: true, default: new Date().toISOString()},
})


LikeSchema.statics.createInstance = function (likeInputDto: LikeInputModelDto, parentId: string, userId: string): HydratedDocument<LikeDto, ILikesInstanceMethods> {
    const comment: LikeDto = {
        parentId: parentId,
        userId: userId,
        status: likeInputDto.likeStatus as LikeStatusEnum,
        createdAt: new Date().toISOString(),
        lastUpdateAt: new Date().toISOString()
    }
    return new LikeModel(comment)
}

LikeSchema.methods.changeCountLike = function (likeStatus: LikeStatusEnum, currentStatus: LikeStatusEnum): LikeChangeCount {
    const likeState: LikeStatusState = {
        [LikeStatusEnum.Like]: {
            [LikeStatusEnum.Like]: {newLikesCount: 0, newDislikesCount: 0, newStatus: LikeStatusEnum.Like},
            [LikeStatusEnum.Dislike]: {newLikesCount: +1, newDislikesCount: -1, newStatus: LikeStatusEnum.Like},
            [LikeStatusEnum.None]: {newLikesCount: +1, newDislikesCount: 0, newStatus: LikeStatusEnum.Like},
        },

        [LikeStatusEnum.Dislike]: {
            [LikeStatusEnum.Like]: {newLikesCount: -1, newDislikesCount: +1, newStatus: LikeStatusEnum.Dislike},
            [LikeStatusEnum.Dislike]: {newLikesCount: 0, newDislikesCount: 0, newStatus: LikeStatusEnum.Dislike},
            [LikeStatusEnum.None]: {newLikesCount: 0, newDislikesCount: +1, newStatus: LikeStatusEnum.Dislike},
        },

        [LikeStatusEnum.None]: {
            [LikeStatusEnum.Like]: {newLikesCount: -1, newDislikesCount: 0, newStatus: LikeStatusEnum.None},
            [LikeStatusEnum.Dislike]: {newLikesCount: 0, newDislikesCount: -1, newStatus: LikeStatusEnum.None},
            [LikeStatusEnum.None]: {newLikesCount: 0, newDislikesCount: 0, newStatus: LikeStatusEnum.None},
        }
    }

    return likeState[likeStatus][currentStatus]
}

LikeSchema.methods.updateLikeStatus = function (likeStatus: LikeStatusEnum): void {
    this.status = likeStatus;
}

export const LikeModel = mongoose.model<LikeDto, ILikesModel>(MONGO_SETTINGS.COLLECTIONS.comments_like, LikeSchema)
