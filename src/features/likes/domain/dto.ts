import {LikeStatusEnum} from "../../../typings/basic-types";

export class LikeDto {
    constructor(
        public parentId: string,
        public userId: string,
        public status: LikeStatusEnum,
        public createdAt: string,
        public lastUpdateAt: string,
    ) {}
}

export class LikeChangeCount {
    constructor(
        public newLikesCount: number,
        public newDislikesCount: number,
        public newStatus: LikeStatusEnum
    ) {}
}

export class LikeStatusState {
    [key: string]: {
        [key: string]: LikeChangeCount
    };

    constructor(likeStatus: { [key: string]: { [key: string]: LikeChangeCount } }) {
        Object.assign(this, likeStatus);
    }
}