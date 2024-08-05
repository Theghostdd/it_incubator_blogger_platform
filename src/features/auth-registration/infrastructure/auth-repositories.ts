import {DeleteResult, ObjectId} from "mongodb";
import {HydratedDocument} from "mongoose";
import {SessionDto} from "../domain/dto";
import {ISessionInstanceMethods} from "../domain/interfaces";
import {inject, injectable} from "inversify";
import {AuthSessionModel} from "../domain/session-entity";

@injectable()
export class AuthRepositories {
    constructor(
        @inject(AuthSessionModel) private authSessionModel: typeof AuthSessionModel
    ) {
    }

    async save(session: HydratedDocument<SessionDto, ISessionInstanceMethods>): Promise<void> {
        await session.save()
    }

    async delete(session: InstanceType<typeof AuthSessionModel>): Promise<boolean> {
        const result: DeleteResult = await session.deleteOne()
        if (result.deletedCount < 1) {
            throw new Error('Something went wrong')
        }
        return true
    }

    async getSessionById(id: string): Promise<HydratedDocument<SessionDto, ISessionInstanceMethods> | null> {
        return this.authSessionModel.findById(id)
    }

    async getSessionsByUserId(id: string): Promise<HydratedDocument<SessionDto, ISessionInstanceMethods>[] | null> {
        return this.authSessionModel.find({userId: id})
    }

    async getSessionByDeviceId(id: string): Promise<HydratedDocument<SessionDto, ISessionInstanceMethods> | null> {
        return this.authSessionModel.findOne({dId: id})
    }

    async deleteSessions(ids: ObjectId[]): Promise<void> {
        await this.authSessionModel.deleteMany({_id: {$in: ids}})
    }
}