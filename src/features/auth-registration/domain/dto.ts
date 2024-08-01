import {RefreshTokenPayloadDto} from "../../../internal/application/jwt/domain/dto";

export class UserConfirmInfoDto {
    constructor(
        public ifConfirm: boolean,
        public confirmationCode: string,
        public dataExpire: string
    ) {
    }
}

export class UserDto {
    constructor(
        public login: string,
        public email: string,
        public userConfirm: UserConfirmInfoDto,
        public password: string,
        public createdAt: string
    ) {}
}

export class SessionDto {
    constructor(
        public dId: string,
        public ip: string,
        public deviceName: string,
        public userId: string,
        public issueAt: string,
        public expAt: string,
    ) {
    }
}


export class RecoveryPasswordSessionDto {
    constructor(
        public email: string,
        public code: string,
        public expAt: string,
    ) {}
}



export class RefreshAuthOutputModelDto {
    constructor(
        public refreshJWTPayload: RefreshTokenPayloadDto,
        public sessionData: SessionDto
    ) {
    }
}