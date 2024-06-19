import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatedMongoSuccessType, DeletedMongoSuccessType, UpdateMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { BlogCreateInputModelType, BlogInputModelType, BlogViewMongoModelType } from "../../Applications/Types-Models/Blog/BlogTypes"
import { MONGO_SETTINGS } from "../../settings"





export const BlogRepositories = {
    /* 
    * 1. Attempts to insert a new blog document into the collection.
    * 2. Uses the `insertOne` function from the MongoDB driver to add the provided blog data.
    * 3. If the insertion is successful, returns the result containing details about the created document.
    * 4. If an error occurs during the insertion process, it throws a new Error with the caught exception.
    */    
    async CreateBlog (data: BlogCreateInputModelType): Promise<CreatedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.blogs).insertOne({...data})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * 1. Converts the provided `id` string into a MongoDB ObjectId.
    * 2. Attempts to update the blog document with the matching `_id` by setting the fields specified in `data`.
    * 3. Uses the `$set` operator to apply only the fields included in the `data` object to the existing document.
    * 4. If the update operation is successful, returns the result containing details such as matchedCount and modifiedCount.
    * 5. If an error occurs during the update process, it throws a new Error with the caught exception.
    */ 
    async UpdateBlogById (id: string, data: BlogInputModelType): Promise<UpdateMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.blogs).updateOne({_id: new ObjectId(id)}, {$set: {...data}})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Converts the provided `id` string into a MongoDB ObjectId.
    * 2. Attempts to delete the blog document that matches the given `_id` in the `blogs` collection.
    * 3. If successful, returns a result containing details about the deletion, including the count of deleted documents.
    * 4. If an error occurs during the deletion process, it throws a new Error with the caught exception.
    */ 
    async DeleteBlogById (id: string): Promise<DeletedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.blogs).deleteOne({_id: new ObjectId(id)})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * 1. Converts the provided `id` string into a MongoDB ObjectId.
    * 2. Attempts to find the blog document that matches the given `_id` in the `blogs` collection.
    * 3. Returns the blog document as is, or `null` if no matching document is found.
    * 4. If an error occurs during the retrieval process, it throws a new Error with the caught exception.
    */ 
    async GetBlogByIdWithoutMap (id: string): Promise<BlogViewMongoModelType | null> {
        try {
            return await db.collection<BlogViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.blogs).findOne({_id: new ObjectId(id)})
        } catch (e: any) {
            throw new Error(e)
        }
    }
}