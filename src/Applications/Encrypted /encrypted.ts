import bcrypt from 'bcrypt';
import { SETTINGS } from '../../settings';


export const genSaltAndHash = async (password: string) => {
    try {
        return await bcrypt.hash(password, SETTINGS.SALTRounds)
    } catch (e: any) {
        throw new Error(e)
    }
}