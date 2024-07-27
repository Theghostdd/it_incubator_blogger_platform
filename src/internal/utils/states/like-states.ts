import {LikeChangeType, LikeStateType, LikeStatusEnum} from "../../../typings/basic-types";

export function updateLikeState (changeState: LikeStatusEnum, currentState: LikeStatusEnum): LikeChangeType {
    const likeState: LikeStateType = {
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
    return likeState[changeState][currentState]
}