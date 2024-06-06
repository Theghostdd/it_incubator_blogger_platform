import { db } from "../../Applications/ConnectionDB/Connection"
import { SETTINGS } from "../../settings"
import {  BlogInputType, BlogCreatingType } from '../../Applications/Types/BlogsTypes/BlogTypes'
import { ObjectId } from "mongodb"
import { CreatedMongoSuccessType, DeletedMongoSuccessType, UpdateMongoSuccessType } from "../../Applications/Types/Types"

export const BlogRepos = {
    async DellBlogById (id: string): Promise<DeletedMongoSuccessType> {
        try {
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.blogs).deleteOne({_id: new ObjectId(id)})
            return result;
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async UpdateBlogById (id: string, data: BlogInputType): Promise<UpdateMongoSuccessType> {
        try {
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.blogs).updateOne({_id: new ObjectId(id)}, {$set: {...data}})
            return result
        } catch (e: any) { 
            throw new Error(e)
        }
    },

    async CreateBlog (data: BlogCreatingType): Promise<CreatedMongoSuccessType> {
        try {
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.blogs).insertOne({...data})
            return result
        } catch (e: any) {
            throw new Error(e)
        }
    }
}