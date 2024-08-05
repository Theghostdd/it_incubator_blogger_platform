

export class UserViewModelDto {
    constructor(
        public id: string,
        public login: string,
        public email: string,
        public createdAt: string
    ) {}
}


export class UserMeViewModelDto {
    constructor(
        public login: string,
        public email: string,
        public userId: string
    ) {}
}