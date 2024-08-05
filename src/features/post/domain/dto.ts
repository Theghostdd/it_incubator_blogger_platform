

class PostLikeInfoDto {
    constructor(
        public likesCount: number,
        public dislikesCount: number,
    ) {}
}


export class PostDto {
    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public createdAt: string,
        public blogName: string,
        public extendedLikesInfo: PostLikeInfoDto
    ) {}
}