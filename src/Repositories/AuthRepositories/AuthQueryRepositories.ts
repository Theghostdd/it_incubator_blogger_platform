import { SessionOutputModelViewType, SessionsMongoViewType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { SecurityMapper } from "../../Utils/map/Security/SecurityMap"
import {AuthSessionModel} from "../../Domain/Auth/Auth";


export const AuthQueryRepositories = {
    /*
    * Search for all user sessions by their ID.
    * If sessions were found, mapping data to return the model, if sessions were not found, return an empty array.
    * Catches and throws any exceptions that occur during the retrieval process.
    */
    async GetAllSessionsByUserId (id: string): Promise<SessionOutputModelViewType[] | []> {
        try {
            const GetAllSessions: SessionsMongoViewType[] | null = await AuthSessionModel.find({userId: id})
            return GetAllSessions.length > 0 ? await SecurityMapper.MapsDevices(GetAllSessions) : []
        } catch (e: any) {
            throw new Error(e)
        }
    },
}