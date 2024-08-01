


export class PostDto {
    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public createdAt: string,
        public blogName: string,
    ) {}
}