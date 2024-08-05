
export class RequestLimiterInputModelDto {
    constructor(
        public ip: string,
        public url: string,
        public date: string,
        public quantity: number
    ) {}
}