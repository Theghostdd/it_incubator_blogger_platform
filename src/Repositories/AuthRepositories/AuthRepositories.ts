import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { RequestLimiterInputModelViewType, RequestLimiterMongoViewType, SessionsInputModelViewType, SessionsMongoViewType, TokenBlackListMongoViewType, TokenInputModelType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { CreatedMongoSuccessType, DeletedMongoSuccessType, UpdateMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { MONGO_SETTINGS } from "../../settings"


export const AuthRepositories = {
    /*
    * 1. Attempts to retrieve a user's request record based on IP address and URL.
    *    a. Queries the `request_limit` collection in the database using the provided `ip` and `url`.
    * 2. Returns the found record, or `null` if no matching record is found.
    * 3. Catches any exceptions that occur during the database insertion and rethrows them as errors.
    */
    async GetUsersRequestByIpAndUrl (ip: string, url: string): Promise<RequestLimiterMongoViewType | null> {
        try {
            return await db.collection<RequestLimiterMongoViewType>(MONGO_SETTINGS.COLLECTIONS.request_limit).findOne({ip: ip, url: url})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Attempts to add a new request record to the `request_limit` collection.
    *    b. The data to be inserted is spread from the `data` parameter.
    * 2. Returns the result of the insert operation, typically indicating success.
    * 3. Catches any exceptions that occur during the database insertion and rethrows them as errors.
    */
    async AddRequest (data: RequestLimiterInputModelViewType): Promise<CreatedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.request_limit).insertOne({...data})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Attempts to update the expiration date of a request record identified by its ID.
    *    a. Converts the `id` string to an `ObjectId` using `new ObjectId(id)`.
    *    b. Updates the document in the `request_limit` collection where `_id` matches the provided ID.
    *    c. Sets the `date` and 'quantity' field of the document to the new data and quantity.
    * 2. Returns the result of the update operation, typically indicating success.
    * 3. Catches any exceptions that occur during the database insertion and rethrows them as errors.
    */
    async UpdateRequestById (id: string, quantity: number, date: Date): Promise<UpdateMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.request_limit).updateOne({_id: new ObjectId(id)}, {$set: {quantity: quantity, date: date}})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Attempts to retrieve all expired request records from the `request_limit` collection.
    *    a. Queries the collection for documents where the `date` field is less than the provided `subSecond` timestamp using `{$lt: subSecond}`.
    *    b. Converts the matching documents to an array using `.toArray()`.
    * 2. Returns the array of expired request records, or `null` if no matching records are found.
    * 3. Catches any exceptions that occur during the database insertion and rethrows them as errors.
   */
    async GetAllExpRequest (subSecond: Date): Promise<RequestLimiterMongoViewType[] | null> {
        try {
            return await db.collection<RequestLimiterMongoViewType>(MONGO_SETTINGS.COLLECTIONS.request_limit)
                .find({date: {$lt: subSecond}})
                .toArray();
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Attempts to delete expired request records from the `request_limit` collection based on their IDs.
    *    a. Uses `deleteMany` to remove documents where `_id` is in the array of provided IDs (`{$in: id}`).
    * 2. Returns the result of the delete operation, typically indicating the number of documents deleted.
    * 3. Catches any exceptions that occur during the database insertion and rethrows them as errors.
    */
    async ClearExpRequest (id: ObjectId[]): Promise<DeletedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.request_limit).deleteMany({_id: {$in: id}});
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Attempts to create a new session in the MongoDB database collection `auth_session` using the provided `data`.
    * Returns a promise that resolves to a `CreatedMongoSuccessType` object representing the result of the insertion.
    * Catches and throws any exceptions that occur during the insertion process.
    */
    async CreateSession (data: SessionsInputModelViewType): Promise<CreatedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.auth_session).insertOne({...data})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Retrieves a session from the MongoDB database collection `auth_session` based on the device ID (`dId`).
    * Returns a promise that resolves to a `SessionsMongoViewType` object if found, or `null` if no session matches the `dId`.
    * Catches and throws any exceptions that occur during the retrieval process.
    */
    async GetSessionByDeviceId (dId: string): Promise<SessionsMongoViewType | null> {
        try {
            return await db.collection<SessionsMongoViewType>(MONGO_SETTINGS.COLLECTIONS.auth_session).findOne({dId: dId})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Retrieves a session from the MongoDB database collection `auth_session` based on the device ID (`dId`) and user ID (`userId`).
    * Converts the `userId` to an `ObjectId` type before querying to match MongoDB's `_id` type.
    * Returns a promise that resolves to a `SessionsMongoViewType` object if found, or `null` if no session matches the `dId` and `userId`.
    * Catches and throws any exceptions that occur during the retrieval process.
    */
    async GetSessionByDeviceIdAndUserId (dId: string, userId: string): Promise<SessionsMongoViewType | null> {
        try {
            return await db.collection<SessionsMongoViewType>(MONGO_SETTINGS.COLLECTIONS.auth_session).findOne({dId: dId, userId: new ObjectId(userId)})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Retrieves all sessions from the MongoDB database collection `auth_session` based on the user ID (`id`).
    * Converts the `id` to an `ObjectId` type before querying to match MongoDB's `_id` type.
    * Returns a promise that resolves to an array of `SessionsMongoViewType` objects if sessions are found,
    * or `null` if no sessions match the `userId`.
    * Catches and throws any exceptions that occur during the retrieval process.
    */
    async GetAllSessionsByUserId (id: string): Promise<SessionsMongoViewType[] | null> {
        try {
            return await db.collection<SessionsMongoViewType>(MONGO_SETTINGS.COLLECTIONS.auth_session).find({userId: new ObjectId(id)}).toArray()
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Updates the `issueAt` field of a session in the MongoDB database collection `auth_session` identified by `id`.
    * Converts the `id` to an `ObjectId` type before querying to match MongoDB's `_id` type.
    * Returns a promise that resolves to an `UpdateMongoSuccessType` object representing the result of the update operation.
    * Catches and throws any exceptions that occur during the update process.
    */
    async UpdateSessionById (id: string, issueAt: string): Promise<UpdateMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.auth_session).updateOne({_id: new ObjectId(id)}, {$set: {issueAt: issueAt}})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Deletes a session from the MongoDB database collection `auth_session` based on the session ID (`id`).
    * Converts the `id` to an `ObjectId` type before querying to match MongoDB's `_id` type.
    * Returns a promise that resolves to a `DeletedMongoSuccessType` object representing the result of the deletion operation.
    * Catches and throws any exceptions that occur during the deletion process.
    */
    async DeleteSessionById (id: string): Promise<DeletedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.auth_session).deleteOne({_id: new ObjectId(id)})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Deletes multiple sessions from the MongoDB database collection `auth_session` based on an array of session IDs (`id`).
    * Uses `$in` operator to match multiple `_id` values in the MongoDB query.
    * Returns a promise that resolves to a `DeletedMongoSuccessType` object representing the result of the deletion operation.
    * Catches and throws any exceptions that occur during the deletion process.
    */
    async DeleteSessionsById (id: ObjectId[]): Promise<DeletedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.auth_session).deleteMany({_id: {$in: id}})
        } catch (e: any) {
            throw new Error(e)
        }
    }, 
}