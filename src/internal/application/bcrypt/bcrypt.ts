import bcrypt from 'bcrypt';
import { SETTINGS } from '../../../settings';

// export const bcryptService = {
//     async genSaltAndHash(password: string) {
//         try {
//             return await bcrypt.hash(password, SETTINGS.SALTRounds)
//         } catch (e: any) {
//             throw new Error(e)
//         }
//     },
//     async comparePass(password: string, existingPassword: string) {
//         try {
//             return await bcrypt.compare(password, existingPassword)
//         } catch (e: any) {
//             throw new Error(e)
//         }
//     }
// }


export class BcryptService {
    async genSaltAndHash(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, SETTINGS.SALTRounds)
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async comparePass(password: string, existingPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, existingPassword)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}