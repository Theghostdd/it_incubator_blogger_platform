

export class TokensDto {
    constructor(
        public accessToken: string,
        public refreshToken: string,
    ) {
    }
}


export class AccessTokenPayloadDto {
    constructor(
        public userId: string,
        public iat: number,
        public exp: number
    ) {
    }
}

export class RefreshTokenPayloadDto {
    constructor(
        public userId: string,
        public deviceId: string,
        public iat: number,
        public exp: number
    ) {
    }
}