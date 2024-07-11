import jwt, { JwtPayload }  from 'jsonwebtoken'
import { SETTINGS } from '../../settings'
import { format, getTime, parseISO } from 'date-fns';
import { JWTRefreshPayload } from '../Types-Models/BasicTypes';



export const credentialJWT = {
    async SignJWT (userId: string, dId: string, issueAt: string) {
        try {
            const milliseconds = getTime(issueAt)    
            return {
                accessToken: await jwt.sign({userId: userId, iat: milliseconds}, SETTINGS.JWT_ACCESS_SECRET_KEY ,{expiresIn: '10s'}),
                refreshToken: await jwt.sign({userId: userId, deviceId: dId, iat: milliseconds}, SETTINGS.JWT_REFRESH_SECRET_KEY ,{expiresIn: '20s'}),
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
