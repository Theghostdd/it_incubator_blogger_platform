import {UserRequestType} from "./basic-types";

declare global {
    namespace Express {
        export interface Request {
            user: UserRequestType
        }
    }
}