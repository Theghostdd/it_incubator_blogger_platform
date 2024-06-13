import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatedMongoSuccessType, DeletedMongoSuccessType, UpdateMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { BlogCreateInputModelType, BlogInputModelType } from "../../Applications/Types-Models/Blog/BlogTypes"
import { MONGO_SETTINGS } from "../../settings"





export const BlogRepositories = {
    async CreateBlog (data: BlogCreateInputModelType): Promise<CreatedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.blogs).insertOne({...data})
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async UpdateBlogById (id: string, data: BlogInputModelType): Promise<UpdateMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.blogs).updateOne({_id: new ObjectId(id)}, {$set: {...data}})
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async DeleteBlogById (id: string): Promise<DeletedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.blogs).deleteOne({_id: new ObjectId(id)})
        } catch (e: any) {
            throw new Error(e)
        }
    }
}