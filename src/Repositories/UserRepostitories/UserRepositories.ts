import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatedMongoSuccessType, DeletedMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { UserCreateInputModelType, UserViewMongoModelType } from "../../Applications/Types-Models/User/UserTypes"
import { MONGO_SETTINGS } from "../../settings"






export const UserRepositories = {
    async CreateUser (data: UserCreateInputModelType): Promise<CreatedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.users).insertOne({...data})
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async DeleteUserById (id: string): Promise<DeletedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.users).deleteOne({_id: new ObjectId(id)})
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async GetUserByIdWithoutMap (id: string): Promise<UserViewMongoModelType | null> {
        try {
            return await db.collection<UserViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.users).findOne({_id: new ObjectId(id)})
        } catch (e: any) {
            throw new Error(e)
        }
    }
}