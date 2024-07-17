import { db } from "../../src/Applications/ConnectionDB/Connection"
import { MONGO_SETTINGS } from "../../src/settings"






export const InsertOneDataModule = async (data: any, collection: string) => {
    return await db.collection(collection).insertOne({...data})
}

export const InsertManyDataModule = async (data: any, collection: string) => {
    return await db.collection(collection).insertMany({...data})
}

export const FindOneModule = async (filter: any, collection: string) => {
    return await db.collection(collection).findOne(filter)
}

export const FindAllModule = async (filter: any, collection: string) => {
    return await db.collection(collection).find(filter).toArray()
}

export const FindAndUpdateModule = async (filter: any, data: any, collection: string) => {
    return await db.collection(collection).findOneAndUpdate(filter, {...data}, {returnDocument: 'after'})
}




export const DropCollections = {
    async DropAllCollections () {
        await db.dropCollection(MONGO_SETTINGS.COLLECTIONS.users)
        await db.dropCollection(MONGO_SETTINGS.COLLECTIONS.blogs)
        await db.dropCollection(MONGO_SETTINGS.COLLECTIONS.comments)
        await db.dropCollection(MONGO_SETTINGS.COLLECTIONS.posts)
        await db.dropCollection(MONGO_SETTINGS.COLLECTIONS.auth_session)
    },

    async DropUserCollection () {
        await db.dropCollection(MONGO_SETTINGS.COLLECTIONS.users)
    },

    async DropAuthSessionsCollection () {
        await db.dropCollection(MONGO_SETTINGS.COLLECTIONS.auth_session)
    },

    async DropBlogCollection () {
        await db.dropCollection(MONGO_SETTINGS.COLLECTIONS.blogs)
    },
}