import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatedMongoSuccessType, DeletedMongoSuccessType } from "../../Applications/Types/Types"
import { UserCreateModel } from "../../Applications/Types/UserTypes/UserTypes"
import { SETTINGS } from "../../settings"




export const UserRepo = {
    async CreateUser (data: UserCreateModel): Promise<CreatedMongoSuccessType> {
        try {
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.users).insertOne(data)
            return result
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async DeleteUser (id: string): Promise<DeletedMongoSuccessType> {
        try {   
            return await db.collection(SETTINGS.MONGO.COLLECTIONS.users).deleteOne({_id: new ObjectId(id)})
        } catch (e: any) {
            throw new Error(e)
        }
    }
}