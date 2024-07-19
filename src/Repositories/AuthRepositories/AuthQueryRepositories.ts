import { ObjectId } from "mongodb"
import { SessionOutputModelViewType, SessionsMongoViewType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { MONGO_SETTINGS } from "../../settings"
import { db } from "../../Applications/ConnectionDB/Connection"
import { SecurityMapper } from "../../Utils/map/Security/SecurityMap"





export const AuthQueryRepositories = {
    /*
    * Retrieves all sessions from the MongoDB database collection `auth_session` based on the user ID (`id`).
    * Converts the `id` to an `ObjectId` type before querying to match MongoDB's `_id` type.
    * Returns map array of sessions from Mapper, if sessions are found, or `null` if no sessions match the `userId`.
    * Catches and throws any exceptions that occur during the retrieval process.
    */
    async GetAllSessionsByUserId (id: string): Promise<SessionOutputModelViewType[] | []> {
        try {
            const GetAllSessions: SessionsMongoViewType[] | null = await db.collection<SessionsMongoViewType>(MONGO_SETTINGS.COLLECTIONS.auth_session)
                .find({userId: new ObjectId(id)})
                .toArray()
            
            return GetAllSessions.length > 0 ? await SecurityMapper.MapsDevices(GetAllSessions) : []
        } catch (e: any) {
            throw new Error(e)
        }
    },
}