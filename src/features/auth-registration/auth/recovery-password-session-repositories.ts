import {RecoveryPasswordSessionModel} from "../../../Domain/RecoveryPasswordSession/RecoveryPasswordSession";
import {DeleteResult} from "mongodb";


export class RecoveryPasswordSessionRepository {
    constructor(
        protected recoveryPasswordSessionModel: typeof RecoveryPasswordSessionModel
    ) {
    }
    async save(session: InstanceType<typeof RecoveryPasswordSessionModel>): Promise<InstanceType<typeof RecoveryPasswordSessionModel>> {
        try {
            return await session.save()
        } catch (e: any) {
            throw new Error(e);
        }
    }

    async getSessionByCode(code: string): Promise<InstanceType<typeof RecoveryPasswordSessionModel> | null> {
        try {
            return await this.recoveryPasswordSessionModel.findOne({code: code})
        } catch (e: any) {
            throw new Error(e);
        }
    }

    async delete(session: InstanceType<typeof RecoveryPasswordSessionModel>): Promise<DeleteResult> {
        try {
            return await session.deleteOne()
        } catch (e: any) {
            throw new Error(e);
        }
    }
}