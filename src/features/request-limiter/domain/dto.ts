export class RequestLimiterDto {
    constructor(
        public ip: string,
        public url: string,
        public date: string,
        public quantity: number,
    ) {
    }

}