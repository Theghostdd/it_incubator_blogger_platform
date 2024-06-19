import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatedMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { CommentCreateType, CommentMongoViewType } from "../../Applications/Types-Models/Comment/CommentTypes"
import { MONGO_SETTINGS } from "../../settings"





export const CommentRepositories = {
    async CreateComment (data: CommentCreateType): Promise<CreatedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.comments).insertOne({...data})
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async GetCommentByIdWithoutMap (id: string): Promise<CommentMongoViewType | null> {
        try {
            return await db.collection<CommentMongoViewType>(MONGO_SETTINGS.COLLECTIONS.comments).findOne({_id: new ObjectId(id)})
        } catch (e: any) {
            throw new Error(e)
        }
    }
}