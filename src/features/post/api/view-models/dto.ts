import {LikeStatusEnum} from "../../../../typings/basic-types";


export class LastLikesDto {
    constructor (
        public postId: string,
        public likes: NewestLikesDto[]
    ) {}
}

export class NewestLikesDto {
    constructor(
        public addedAt: string,
        public userId: string,
        public login: string
    ) {}
}

class PostLikeInfoDto {
    constructor(
        public likesCount: number,
        public dislikesCount: number,
        public myStatus: LikeStatusEnum,
        public newestLikes: NewestLikesDto[]
    ) {
    }
}

export class PostViewModel {
    constructor(
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,
        public extendedLikesInfo: PostLikeInfoDto
    ) {
    }
}


