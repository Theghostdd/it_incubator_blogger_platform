import {LikeStatusEnum} from "../../../../typings/basic-types";


export class CommentatorInfoViewModel {
    constructor (
        public userId: string,
        public userLogin: string
    ) {}
}

export class CommentLikesInfoViewModel {
    constructor(
        public likesCount: number,
        public dislikesCount: number,
        public myStatus: LikeStatusEnum
    ) {
    }
}

export class CommentViewModelDto {
    constructor(
        public id: string,
        public content: string,
        public commentatorInfo: CommentatorInfoViewModel,
        public likesInfo: CommentLikesInfoViewModel,
        public createdAt: string,
    ) {

    }
}