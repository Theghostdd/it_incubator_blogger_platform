export class BlogDto {
    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean,
    ) {}
}