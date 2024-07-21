import { ObjectId } from "mongodb"
import {
    RequestLimiterInputModelViewType,
    RequestLimiterMongoViewType,
    SessionsInputViewType,
    SessionsMongoViewType,
} from "../../Applications/Types-Models/Auth/AuthTypes"
import { DeletedMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import {AuthSessionModel, RequestLimiterModel} from "../../Domain/Auth/Auth";


export const AuthRepositories = {
    /*
    * Attempts to create a new session in the DB.
    * Returns the result of the insert operation.
    * Catches and throws any exceptions that occur during the insertion process.
    */
    async CreateSession (data: SessionsInputViewType): Promise<SessionsMongoViewType> {
        try {
            return await new AuthSessionModel(data).save()
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Retrieves a session from the DB by session ID.
    * Returns a result, or `null` if no session match.
    * Catches and throws any exceptions that occur during the retrieval process.
    */
    async GetSessionById (id: string): Promise<SessionsMongoViewType | null> {
        try {
            return await AuthSessionModel.findById(id)
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Retrieves all sessions from the DB by user ID.
    * Returns a array result, or `null` if no sessions match the `userId`.
    * Catches and throws any exceptions that occur during the retrieval process.
    */
    async GetAllSessionsByUserId (id: string): Promise<SessionsMongoViewType[] | null> {
        try {
            return await AuthSessionModel.find({userId: id})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Retrieves a session from the DB by uniq Device ID.
    * Returns the result of operation, or `null` if no matching records are found.
    * Catches and throws any exceptions that occur during the retrieval process.
    */
    async GetSessionByDeviceId (id: string): Promise<SessionsMongoViewType | null> {
        try {
            return await AuthSessionModel.findOne({dId: id})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Updates the session, issue and expire time by session ID
    * Returns a result the operation.
    * Catches and throws any exceptions that occur during the update process.
    */
    async UpdateSessionTimeById (id: string, issueAt: string, expAt: string): Promise<SessionsMongoViewType | null> {
        try {
            return await AuthSessionModel.findByIdAndUpdate(id, {
                issueAt: issueAt,
                expAt: expAt
            })
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Deletes a session from the DB by session ID.
    * Returns a result the operation.
    * Catches and throws any exceptions that occur during the deletion process.
    */
    async DeleteSessionById (id: string): Promise<SessionsMongoViewType | null> {
        try {
            return await AuthSessionModel.findByIdAndDelete(id)
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Deletes multiple sessions from the DB by them ID.
    * Returns a result the operation.
    * Catches and throws any exceptions that occur during the deletion process.
    */
    async DeleteSessionsById (id: ObjectId[]): Promise<DeletedMongoSuccessType> {
        try {
            return await AuthSessionModel.deleteMany({_id: {$in: id}})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Attempts to retrieve a user's request record based on IP address and URL.
    * 2. Returns the found record, or `null` if no matching record is found.
    * 3. Catches any exceptions that occur during the database insertion and rethrows them as errors.
    */
    async GetUsersRequestByIpAndUrl(ip: string, url: string): Promise<RequestLimiterMongoViewType | null> {
        try {
            return await RequestLimiterModel.findOne({ip: ip, url: url})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Attempts to retrieve a user's request record based by request ID.
    * 2. Returns the found record, or `null` if no matching record is found.
    * 3. Catches any exceptions that occur during the database insertion and rethrows them as errors.
    */
    async GetUsersRequestById(id: string): Promise<RequestLimiterMongoViewType | null> {
        try {
            return await RequestLimiterModel.findById(id)
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Add a new user`s request record to the DB.
    * 2. Returns the result of the insert operation.
    * 3. Catches any exceptions that occur during the database insertion and rethrows them as errors.
    */
    async AddUserRequest (data: RequestLimiterInputModelViewType): Promise<RequestLimiterMongoViewType> {
        try {
            return await new RequestLimiterModel(data).save()
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Update user`s request, by request ID.
    *   - Updating "Quantity" and "Date"
    * 2. Returns the result of the update operation.
    * 3. Catches any exceptions that occur during the database insertion and rethrows them as errors.
    */
    async UpdateUserRequestQuantityAndDateById (id: string, quantity: number, date: string): Promise<RequestLimiterMongoViewType | null> {
        try {
            return await RequestLimiterModel.findByIdAndUpdate(id, {
                quantity: quantity,
                date: date
            })
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Attempts to retrieve all expired request records from the DB.
    * 2. Returns the array of expired request records, or `null` if no matching records are found.
    * 3. Catches any exceptions that occur during the database insertion and rethrows them as errors.
    */
    async GetAllExpUserRequest (subSecond: String): Promise<RequestLimiterMongoViewType[] | null> {
        try {
            return await RequestLimiterModel.find({date: {$lt: subSecond}})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Attempts to delete expired request records from the DB by ID.
    * 2. Returns the result of the delete operation.
    * 3. Catches any exceptions that occur during the database insertion and rethrows them as errors.
    */
    async ClearAllExpUserRequest (id: ObjectId[]): Promise<DeletedMongoSuccessType> {
        try {
            return await RequestLimiterModel.deleteMany({_id: {$in: id}});
        } catch (e: any) {
            throw new Error(e)
        }
    },
}