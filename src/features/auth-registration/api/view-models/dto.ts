export class AuthViewModelDto {
    constructor(
        public accessToken: string,
    ) {
    }
}


export class UserViewMeModelDto {
    constructor(
        public login: string,
        public email: string,
        public userId: string
    ) {
    }
}