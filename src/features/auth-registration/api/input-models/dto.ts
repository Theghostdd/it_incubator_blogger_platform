

export class UserLoginInputDto {
    constructor(
        public loginOrEmail: string,
        public password: string
    ) {}
}




export class UserRegisterInputDto {
    constructor(
        public login: string,
        public password: string,
        public email: string
    ) {}
}

export class UserRegistrationConfirmCodeInputDto {
    constructor(
        public code: string
    ) {}
}


export class UserRegistrationResendConfirmCodeInputDto {

    constructor(
       public email: string
    ) {}
}

export class UserPasswordRecoveryInputDto {
    constructor(
        public email: string,
    ) {}
}

export class UserChangePasswordInputDto {
    constructor(
        public newPassword: "string",
        public recoveryCode: "string"
    ) {}
}
