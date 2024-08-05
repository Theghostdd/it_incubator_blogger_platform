


export class SessionViewModelDto {
    constructor(
        public ip: string,
        public title: string,
        public lastActiveDate: string,
        public deviceId: string
    ) {}
}