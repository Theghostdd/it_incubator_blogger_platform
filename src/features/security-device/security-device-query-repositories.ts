import {AuthSessionModel} from "../../Domain/Auth/Auth";
import {SessionOutputModelViewType, SessionsMongoViewType} from "../auth-registration/auth/auth-types";
import {securityMapper} from "../../internal/utils/map/securityMap";


export class SecurityDeviceQueryRepositories {
    constructor(
        protected authSessionModel: typeof AuthSessionModel
    ) {}
    async getSessionsByUserId (userId: string): Promise<SessionOutputModelViewType[] | []> {
        try {
            const filter = {userId: userId}

            const sessions: SessionsMongoViewType[] | [] = await this.authSessionModel
                .find(filter)
                .lean()

            return securityMapper.mapsDevices(sessions)

        } catch (e: any) {
            throw new Error(e)
        }
    }
}