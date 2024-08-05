import bcrypt from 'bcrypt';
import { SETTINGS } from '../../../settings';
import {injectable} from "inversify";

@injectable()
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