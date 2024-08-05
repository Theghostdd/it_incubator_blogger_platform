import {DeleteResult} from "mongodb";
import {RecoveryPasswordSessionModel} from "../domain/recovery-password-entity";
import {inject, injectable} from "inversify";
import {HydratedDocument} from "mongoose";
import {RecoveryPasswordSessionDto} from "../domain/dto";
import {IRecoveryPasswordSessionInstanceMethods} from "../domain/interfaces";

@injectable()
export class RecoveryPasswordSessionRepository {
    constructor(
        @inject(RecoveryPasswordSessionModel) private recoveryPasswordSessionModel: typeof RecoveryPasswordSessionModel
    ) {}

    async save(session: HydratedDocument<RecoveryPasswordSessionDto, IRecoveryPasswordSessionInstanceMethods>): Promise<void> {
        await session.save()
    }

    async delete(session: HydratedDocument<RecoveryPasswordSessionDto, IRecoveryPasswordSessionInstanceMethods>): Promise<boolean> {
        const result: DeleteResult = await session.deleteOne()
        if (result.deletedCount < 1) {
            throw new Error('Something went wrong')
        }
        return true
    }

    async getSessionByCode(code: string): Promise<HydratedDocument<RecoveryPasswordSessionDto, IRecoveryPasswordSessionInstanceMethods> | null> {
        return  this.recoveryPasswordSessionModel.findOne({code: code})
    }
}