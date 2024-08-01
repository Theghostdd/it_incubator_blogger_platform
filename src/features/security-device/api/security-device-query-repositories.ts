import {inject, injectable} from "inversify";
import {AuthSessionModel} from "../../auth-registration/domain/session-entity";
import {SessionViewModelDto} from "./view-models/dto";
import {HydratedDocument} from "mongoose";
import {SessionDto} from "../../auth-registration/domain/dto";
import {ISessionInstanceMethods} from "../../auth-registration/domain/interfaces";

@injectable()
export class SecurityDeviceQueryRepositories {
    constructor(
        @inject(AuthSessionModel) private authSessionModel: typeof AuthSessionModel
    ) {}

    async getSessionsByUserId(userId: string): Promise<SessionViewModelDto[] | []> {
        const filter = {userId: userId}
        const sessions: HydratedDocument<SessionDto, ISessionInstanceMethods>[] | [] = await this.authSessionModel
            .find(filter)

        return sessions.map((item: HydratedDocument<SessionDto, ISessionInstanceMethods>) => {
            return {
                ip: item.ip,
                title: item.deviceName,
                lastActiveDate: item.issueAt,
                deviceId: item.dId
            }
        })
    }
}