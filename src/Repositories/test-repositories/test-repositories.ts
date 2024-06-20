import { db } from "../../Applications/ConnectionDB/Connection"
import { MONGO_SETTINGS } from "../../settings"


export const TestRepositories = {
    async deleteManyAllData () {
        try {
            await db.collection(MONGO_SETTINGS.COLLECTIONS.blogs).deleteMany({})
            await db.collection(MONGO_SETTINGS.COLLECTIONS.posts).deleteMany({})
            await db.collection(MONGO_SETTINGS.COLLECTIONS.users).deleteMany({})
            return 
        } catch (e: any) {
            throw new Error(e)
        }
    }
}