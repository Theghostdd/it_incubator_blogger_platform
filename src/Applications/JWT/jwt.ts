import jwt, { JwtPayload }  from 'jsonwebtoken'
import { SETTINGS } from '../../settings'



export const credentialJWT = {
    async SignJWT (payload: any) {
        try {
            return await jwt.sign(payload, SETTINGS.JWT_ACCESS_SECRET_KEY ,{expiresIn: '1h'})
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
    }
} 