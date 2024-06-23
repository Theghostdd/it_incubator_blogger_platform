import { v4 as uuidv4 } from 'uuid';


export const GenerateUuid = {
    async GenerateCodeForConfirmEmail() {
        return await uuidv4()
    }
}