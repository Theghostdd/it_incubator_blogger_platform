class CommentatorInfoDto {
    constructor(
        public userId: string,
        public userLogin: string
    ) {}
}

class CommentLikesInfoDto {
    constructor(
        public likesCount: number,
        public dislikesCount: number,
    ) {}
}

class CommentPostInfoDto {
    constructor(
        public postId: string
    ) {}
}

class CommentBlogInfoDto {
    constructor(
        public blogId: string,
    ) {}
}

export class CommentDto {
    constructor(
        public content: string,
        public createdAt: string,
        public commentatorInfo: CommentatorInfoDto,
        public postInfo: CommentPostInfoDto,
        public blogInfo: CommentBlogInfoDto,
        public likesInfo: CommentLikesInfoDto
    ) {}
}
