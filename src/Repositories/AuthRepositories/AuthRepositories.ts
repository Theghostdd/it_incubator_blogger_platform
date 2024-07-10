import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { RequestLimiterInputModelViewType, RequestLimiterMongoViewType, TokenBlackListMongoViewType, TokenInputModelType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { CreatedMongoSuccessType, DeletedMongoSuccessType, UpdateMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { MONGO_SETTINGS } from "../../settings"


export const AuthRepositories = {
    /*
    * 1. Searches for the provided token in the black list in the database.
    *    - If a matching token is found, returns the token data (`TokenBlackListMongoViewType`).
    *    - If no matching token is found, returns `null`.
    * 3. Catches any exceptions that occur during the database query and rethrows them as errors.
    */
    async GetTokenBlackList (token: string): Promise<TokenBlackListMongoViewType | null> {
        try {
            return await db.collection<TokenBlackListMongoViewType>(MONGO_SETTINGS.COLLECTIONS.token_black_list).findOne({token: token})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Adds a token to the black list collection in database.
    * 2. The document includes the token and associated details, encapsulated in `TokenInputModelType`.
    * 3. Returns the result of the insertion, typically containing the inserted document's ID (`CreatedMongoSuccessType`).
    * 4. Catches any exceptions that occur during the database insertion and rethrows them as errors.
    */
    async AddTokenToBlackList (data: TokenInputModelType): Promise<CreatedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.token_black_list).insertOne({...data})
        } catch (e: any) {
            throw new Error(e)
        }
    },
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

    
}