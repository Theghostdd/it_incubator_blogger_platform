import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatedMongoSuccessType, DeletedMongoSuccessType, UpdateMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { PostCreateInputModelType, PostInputModelType, PostViewMongoModelType } from "../../Applications/Types-Models/Post/PostTypes"
import { MONGO_SETTINGS } from "../../settings"



export const PostRepositories = {
    /* 
    * 1. Attempt to insert the provided `data` into the `posts` collection in the MongoDB database.
    * 2. If successful, return the result of the insertion which includes the ID of the newly created post.
    * 3. If an error occurs during the insertion, catch the error and throw it as a generic Error.
    */
    async CreatePost (data: PostCreateInputModelType): Promise<CreatedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.posts).insertOne({...data})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*     
    * 1. Convert the `id` from a string to a MongoDB `ObjectId`.
    * 2. Attempt to update the specified post in the `posts` collection by setting the new values from the provided `data`.
    * 3. If successful, return the result of the update operation, which includes the count of matched and modified documents.
    * 4. If an error occurs during the update, catch the error and throw it as a generic Error.
    */
    async UpdatePostById (id: string, data: PostInputModelType): Promise<UpdateMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.posts).updateOne({_id: new ObjectId(id)}, {$set: {...data}})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * 1. Convert the `id` from a string to a MongoDB `ObjectId`.
    * 2. Attempt to delete the specified post from the `posts` collection where `_id` matches the converted `ObjectId`.
    * 3. If successful, return the result of the delete operation, which includes the count of deleted documents.
    * 4. If an error occurs during the delete operation, catch the error and throw it as a generic Error.
    */
    async DeletePostById (id: string): Promise<DeletedMongoSuccessType> {
        try {   
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.posts).deleteOne({_id: new ObjectId(id)})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Convert the `id` from a string to a MongoDB `ObjectId`.
    * 2. Attempt to find and retrieve the post from the `posts` collection where `_id` matches the converted `ObjectId`.
    * 3. If a matching post is found, return the post document as `PostViewMongoModelType`.
    * 4. If no matching post is found, return null.
    * 5. If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async GetPostByIdWithoutMap (id: string): Promise<PostViewMongoModelType | null> {
        try {   
            return await db.collection<PostViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.posts).findOne({_id: new ObjectId(id)})
        } catch (e: any) {
            throw new Error(e)
        }
    }
}