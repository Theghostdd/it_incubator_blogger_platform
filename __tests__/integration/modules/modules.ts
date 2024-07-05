import { db } from "../../../src/Applications/ConnectionDB/Connection"
import { MONGO_SETTINGS } from "../../../src/settings"





export const dropCollections = {
    async dropAllCollections () {
        await db.dropCollection(MONGO_SETTINGS.COLLECTIONS.users)
        await db.dropCollection(MONGO_SETTINGS.COLLECTIONS.blogs)
        await db.dropCollection(MONGO_SETTINGS.COLLECTIONS.comments)
        await db.dropCollection(MONGO_SETTINGS.COLLECTIONS.posts)
    },

    async dropUserCollection () {
        await db.dropCollection(MONGO_SETTINGS.COLLECTIONS.users)

    }
}


export const InsertData = async (data: any, collection: string) => {
    await db.collection(collection).insertOne({...data})
}
