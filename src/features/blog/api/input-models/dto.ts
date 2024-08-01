export class CreateInputBlogDto {
    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string
    ) {}
}

export class UpdateInputBlogDto {
    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string
    ) {}
}
