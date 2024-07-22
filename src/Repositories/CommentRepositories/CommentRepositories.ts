import { CommentCreateType, CommentInputModelType, CommentMongoViewType } from "../../Applications/Types-Models/Comment/CommentTypes"
import {CommentModel} from "../../Domain/Comment/Comment";





export const CommentRepositories = {
    /* 
    * Create a comment document.
    * Return the result of the operation.
    * If an error occurs during the insertion, catch the error and throw it as a generic Error.
    */
    async CreateComment (data: CommentCreateType): Promise<CommentMongoViewType> {
        try {
            return await new CommentModel(data).save()
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Getting a comment on his ID.
    * Return of the result of the operation.
    * If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async GetCommentById (id: string): Promise<CommentMongoViewType | null> {
        try {
            return await CommentModel.findById(id)
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Delete comment by ID.
    * Return of the result of the operation.
    * Catches any exceptions that occur during the deletion process.
    */
    async DeleteCommentById (id: string): Promise<CommentMongoViewType | null> {
        try {
            return await CommentModel.findByIdAndDelete(id)
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Update comment by ID.
    *   - content.
    * Return of the result of the operation.
    * If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async UpdateCommentById (id: string, data: CommentInputModelType): Promise<CommentMongoViewType | null> {
        try {
            return await CommentModel.findByIdAndUpdate(id, {
                content: data.content
            })
        } catch (e: any) {
            throw new Error(e)
        }
    }
}