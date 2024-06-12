import { WithId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { UserMongoOutputType } from "../../Applications/Types/UserTypes/UserTypes"
import { SETTINGS } from "../../settings"




export const UserQueryRepo = {
    async GetUserByLoginOrEmail (login: string, email: string): Promise<UserMongoOutputType | null> {
        try {
            const result = await db.collection<UserMongoOutputType>(SETTINGS.MONGO.COLLECTIONS.users).findOne({$or: [{login: login}, {email: email}]})
            return result
        } catch (e: any) {
            throw new Error(e)
        }
    }
}