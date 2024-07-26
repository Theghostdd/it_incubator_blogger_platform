import jwt from 'jsonwebtoken'
import { SETTINGS } from '../../../settings'



export const credentialJWT = {
    async signJWT (userId: string, dId: string) {
        try {
            return {
                accessToken: jwt.sign({userId: userId}, SETTINGS.JWT_ACCESS_SECRET_KEY ,{expiresIn: SETTINGS.JWTAccessToken_Expires}),
                refreshToken: jwt.sign({userId: userId, deviceId: dId}, SETTINGS.JWT_REFRESH_SECRET_KEY ,{expiresIn: SETTINGS.JWTRefreshToken_Expires}),
            }
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async verifyJWT (token: string) {
        try {
            return jwt.verify(token, SETTINGS.JWT_ACCESS_SECRET_KEY)
        } catch (e: any) {
            return null
        }
    },

    async verifyJWTrefresh (token: string) {
        try {
            return jwt.verify(token, SETTINGS.JWT_REFRESH_SECRET_KEY)
        } catch (e: any) {
            return null
        }
    }
} 
