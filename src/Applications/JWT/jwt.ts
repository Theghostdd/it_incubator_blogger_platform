import jwt, { JwtPayload }  from 'jsonwebtoken'
import { SETTINGS } from '../../settings'



export const credentialJWT = {
    async SignJWT (payload: any) {
        try {
            return {
                accessToken: await jwt.sign(payload, SETTINGS.JWT_ACCESS_SECRET_KEY ,{expiresIn: '10s'}),
                refreshToken: await jwt.sign(payload, SETTINGS.JWT_REFRESH_SECRET_KEY ,{expiresIn: '20s'}),
            }
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async VerifyJWT (token: string) {
        try {
            return await jwt.verify(token, SETTINGS.JWT_ACCESS_SECRET_KEY)
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async VerifyJWTrefresh (token: string) {
        try {
            return await jwt.verify(token, SETTINGS.JWT_REFRESH_SECRET_KEY)
        } catch (e: any) {
            return null
        }
    }
} 