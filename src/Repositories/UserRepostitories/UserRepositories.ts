import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatedMongoSuccessType, DeletedMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { UserCreateInputModelType, UserInputModelType, UserViewMongoModelType } from "../../Applications/Types-Models/User/UserTypes"
import { MONGO_SETTINGS } from "../../settings"
import { LoginInputModelType } from "../../Applications/Types-Models/Auth/AuthTypes"






export const UserRepositories = {
    /*
    * 1. Inserts the user data into the collection in MongoDB.
    *    - Uses the `insertOne` method to add the user record.
    * 2. Returns the result of the insertion operation, which includes the ID of the newly created user.
    * If an error occurs during the insertion, the method throws an error to be handled by the calling code.
    */ 
    async CreateUser (data: UserCreateInputModelType): Promise<CreatedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.users).insertOne({...data})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * 1. Attempts to delete the user with the specified ID from the collection in MongoDB.
    *    - Uses the `deleteOne` method to remove the user record.
    *    - The ID is converted to a MongoDB ObjectId to match the database format.
    * 2. Returns the result of the deletion operation, which indicates how many documents were deleted.
    * If an error occurs during the deletion process, the method throws an error to be handled by the calling code.
    */ 
    async DeleteUserById (id: string): Promise<DeletedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.users).deleteOne({_id: new ObjectId(id)})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Attempts to find a user in the collection whose `_id` matches the specified ID.
    *    - The ID is converted to a MongoDB ObjectId to match the database format.
    *    - Uses the `findOne` method to search for the user document.
    * 2. Returns the found user document directly from the database, without any transformation or mapping.
    * If no user is found, the method returns `null`.
    * If an error occurs during the retrieval process, the method throws an error to be handled by the calling code.
    */ 
    async GetUserByIdWithoutMap (id: string): Promise<UserViewMongoModelType | null> {
        try {
            return await db.collection<UserViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.users).findOne({_id: new ObjectId(id)})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * 1. Queries the MongoDB collection.
    * 2. Uses the `findOne` method to find a single document that matches the given filter.
    * 3. Returns the found document if it exists, or null if no document matches the filter.
    * 4. We get filter from service.
    * 5. Catch some error and return new error if process has some error.
    */
    async GetUserByLoginOrEmailWithOutMap (filter: Object): Promise<UserViewMongoModelType | null> {
        try {
            const result = await db.collection<UserViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.users).findOne(filter)
            return result ? result : null
        } catch (e: any) {
            throw new Error(e)
        }
    },


}