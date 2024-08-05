import {v4 as uuidv4} from "uuid";
import {format} from "date-fns";
import {injectable} from "inversify";

@injectable()
export class Uuid {
    generateConfirmCode(): string {
        return uuidv4()
    }

    generateDeviceId (uniqId: string): string {
        return uuidv4().slice(0, 20) + `${format(new Date(), '-dd-MM-yyyy-HH-mm-ss')}-${uuidv4().slice(0, 10)}-${uniqId}`
    }
}