import { db } from "../../Applications/ConnectionDB/Connection";
import { PostInputType } from "../../Applications/Types/PostsTypes/PostTypes";
import { CreatedMongoSuccessType, DeletedMongoSuccessType, UpdateMongoSuccessType } from "../../Applications/Types/Types";
import { SETTINGS } from "../../settings";
import { ObjectId } from "mongodb";


export const PostRepo = {
    async DellPostById (id: string): Promise<DeletedMongoSuccessType> {
        try { 
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.posts).deleteOne({_id: new ObjectId(id)})
            return result;
        } catch (e: any) { 
            throw new Error(e)
        } 
    },

    async UpdatePostById (id: string, data: PostInputType ): Promise<UpdateMongoSuccessType> {
        try {
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.posts).updateOne({_id: new ObjectId(id)}, {$set: {...data}}) 
            return result;
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async CreatePost (data: PostInputType): Promise<CreatedMongoSuccessType> {
        try {
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.posts).insertOne({...data})
            return result
        } catch (e: any) { 
            throw new Error(e)
        }
    }
}