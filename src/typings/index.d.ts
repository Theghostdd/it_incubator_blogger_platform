import {UserRequestType} from "../Applications/Types-Models/BasicTypes";

declare global {
    namespace Express {
        export interface Request {
            user: UserRequestType
        }
    }
}