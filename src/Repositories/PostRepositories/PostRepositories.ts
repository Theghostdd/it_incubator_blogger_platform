import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatedMongoSuccessType, DeletedMongoSuccessType, UpdateMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { PostCreateInputModelType, PostInputModelType } from "../../Applications/Types-Models/Post/PostTypes"
import { MONGO_SETTINGS } from "../../settings"



export const PostRepositories = {
    async CreatePost (data: PostCreateInputModelType): Promise<CreatedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.posts).insertOne({...data})
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async UpdatePostById (id: string, data: PostInputModelType): Promise<UpdateMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.posts).updateOne({_id: new ObjectId(id)}, {$set: {...data}})
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async DeletePostById (id: string): Promise<DeletedMongoSuccessType> {
        try {   
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.posts).deleteOne({_id: new ObjectId(id)})
        } catch (e: any) {
            throw new Error(e)
        }
    }
}