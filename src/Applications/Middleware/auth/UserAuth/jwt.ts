import jwt  from 'jsonwebtoken'
import { SETTINGS } from '../../../../settings'



export const credentialJWT = {
    async SignJWT (payload: any) {
        try {
            return jwt.sign(payload, SETTINGS.JWT_ACCESS_SECRET_KEY ,{expiresIn: '1h'})
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async VerifyJWT () {
        return 
    }
} 