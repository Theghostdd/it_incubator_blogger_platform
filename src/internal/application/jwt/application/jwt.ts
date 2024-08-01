import jwt from 'jsonwebtoken'
import { SETTINGS } from '../../../../settings'
import {AccessTokenPayloadDto, RefreshTokenPayloadDto, TokensDto} from "../domain/dto";



// export const credentialJWT = {
//     async signJWT (userId: string, dId: string) {
//         try {
//             return {
//                 accessToken: jwt.sign({userId: userId}, SETTINGS.JWT_ACCESS_SECRET_KEY ,{expiresIn: SETTINGS.JWTAccessToken_Expires}),
//                 refreshToken: jwt.sign({userId: userId, deviceId: dId}, SETTINGS.JWT_REFRESH_SECRET_KEY ,{expiresIn: SETTINGS.JWTRefreshToken_Expires}),
//             }
//         } catch (e: any) {
//             throw new Error(e)
//         }
//     },
//
//     async verifyJWT (token: string) {
//         try {
//             return jwt.verify(token, SETTINGS.JWT_ACCESS_SECRET_KEY)
//         } catch (e: any) {
//             return null
//         }
//     },
//
//     async verifyJWTrefresh (token: string) {
//         try {
//             return jwt.verify(token, SETTINGS.JWT_REFRESH_SECRET_KEY)
//         } catch (e: any) {
//             return null
//         }
//     }
// }

export class JWTService {
    async signJWT (userId: string, dId: string): Promise<TokensDto> {
        try {
            return {
                accessToken: jwt.sign({userId: userId}, SETTINGS.JWT_ACCESS_SECRET_KEY ,{expiresIn: SETTINGS.JWTAccessToken_Expires}),
                refreshToken: jwt.sign({userId: userId, deviceId: dId}, SETTINGS.JWT_REFRESH_SECRET_KEY ,{expiresIn: SETTINGS.JWTRefreshToken_Expires}),
            }
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async verifyAccessJWTToken (token: string): Promise<AccessTokenPayloadDto | null> {
        try {
            return jwt.verify(token, SETTINGS.JWT_ACCESS_SECRET_KEY) as AccessTokenPayloadDto
        } catch (e: any) {
            return null
        }
    }

    async verifyRefreshJWTToken (token: string): Promise<RefreshTokenPayloadDto | null> {
        try {
            return jwt.verify(token, SETTINGS.JWT_REFRESH_SECRET_KEY) as RefreshTokenPayloadDto
        } catch (e: any) {
            return null
        }
    }
}

