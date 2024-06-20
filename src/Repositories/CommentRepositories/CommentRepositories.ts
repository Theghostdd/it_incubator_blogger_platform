import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatedMongoSuccessType, DeletedMongoSuccessType, UpdateMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { CommentCreateType, CommentInputModelType, CommentMongoViewType } from "../../Applications/Types-Models/Comment/CommentTypes"
import { MONGO_SETTINGS } from "../../settings"





export const CommentRepositories = {
    /* 
    * 1. Attempt to insert the provided `data` into the `comments` collection in the MongoDB database.
    * 2. If successful, return the result of the insertion which includes the ID of the newly created comment.
    * 3. If an error occurs during the insertion, catch the error and throw it as a generic Error.
    */
    async CreateComment (data: CommentCreateType): Promise<CreatedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.comments).insertOne({...data})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Convert the `id` from a string to a MongoDB `ObjectId`.
    * 2. Attempt to find and retrieve the post from the `comments` collection where `_id` matches the converted `ObjectId`.
    * 3. If a matching post is found, return the post document as `PostViewMongoModelType`.
    * 4. If no matching post is found, return null.
    * 5. If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async GetCommentByIdWithoutMap (id: string): Promise<CommentMongoViewType | null> {
        try {
            return await db.collection<CommentMongoViewType>(MONGO_SETTINGS.COLLECTIONS.comments).findOne({_id: new ObjectId(id)})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Attempts to delete a comment from the MongoDB collection identified by the specified ID (`id`):
    *    - The return value is an object of type `DeletedMongoSuccessType` which contains the result of the delete operation, including the `deletedCount`.
    * 2. Catches any exceptions that occur during the deletion process.
    */
    async DeleteCommentById (id: string): Promise<DeletedMongoSuccessType> {
        try {
            return await db.collection<DeletedMongoSuccessType>(MONGO_SETTINGS.COLLECTIONS.comments).deleteOne({_id: new ObjectId(id)})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Attempts to update a comment in the MongoDB collection identified by the specified ID (`id`):
    *    - The method returns an object of type `UpdateMongoSuccessType`, which includes the result of the update operation such as the `matchedCount` and `modifiedCount`.
    * 2. Catches any exceptions that occur during the update process.
    */
    async UpdateCommentById (id: string, data: CommentInputModelType): Promise<UpdateMongoSuccessType> {
        try {
            return await db.collection<UpdateMongoSuccessType>(MONGO_SETTINGS.COLLECTIONS.comments).updateOne({_id: new ObjectId(id)}, {$set: {...data}})
        } catch (e: any) {
            throw new Error(e)
        }
    }
}