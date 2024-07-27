import {AuthSessionModel} from "../../../Domain/Auth/Auth";
import {DeleteResult, ObjectId} from "mongodb";
import {SessionsMongoViewType} from "./auth-types";


export class AuthRepositories {
    constructor(
        protected authSessionModel: typeof AuthSessionModel
    ) {
    }

    async saveSession (session: InstanceType<typeof AuthSessionModel>): Promise<InstanceType<typeof AuthSessionModel>> {
        try {
            return await session.save()
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async deleteSession (session: InstanceType<typeof AuthSessionModel>): Promise<DeleteResult> {
        try {
            return await session.deleteOne()
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async getSessionById (id: string): Promise<InstanceType<typeof AuthSessionModel> | null> {
        try {
            return await this.authSessionModel.findById(id)
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async getSessionsByUserId (id: string): Promise<SessionsMongoViewType[] | null> {
        try {
            return await this.authSessionModel.find({userId: id}).lean()
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async getSessionByDeviceId (id: string): Promise<InstanceType<typeof AuthSessionModel> | null> {
        try {
            return await this.authSessionModel.findOne({dId: id})
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async deleteSessions (ids: ObjectId[]): Promise<DeleteResult> {
        try {
            return await this.authSessionModel.deleteMany({ _id: { $in: ids } })
        } catch (e: any) {
            throw new Error(e)
        }
    }
}