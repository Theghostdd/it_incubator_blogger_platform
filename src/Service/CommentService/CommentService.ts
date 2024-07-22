import { ResultNotificationEnum, ResultNotificationType } from "../../Applications/Types-Models/BasicTypes"
import { CommentInputModelType, CommentMongoViewType } from "../../Applications/Types-Models/Comment/CommentTypes"
import { CommentRepositories } from "../../Repositories/CommentRepositories/CommentRepositories"





export const CommentService = {
    /*
    * Check if the comment exists.
    * If the comment does not exist, return an error.
    * If a comment exists, check that it belongs to a specific user.
    * If the comment does not belong to the user, throw out the error.
    * If it belongs, you need to update the comment.
    * Catches any exceptions that occur during the process.
    */
    async UpdateCommentById (id: string, userId: string, data: CommentInputModelType): Promise<ResultNotificationType> {
        try {
            const getComment: CommentMongoViewType | null = await CommentRepositories.GetCommentById(id)
            if (!getComment) return {status: ResultNotificationEnum.NotFound}
            if (getComment.commentatorInfo.userId !== userId) return {status: ResultNotificationEnum.Forbidden}

            await CommentRepositories.UpdateCommentById(id, data)
            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Check if the comment exists.
    * If the comment does not exist, return an error.
    * If a comment exists, check that it belongs to a specific user.
    * If the comment does not belong to the user, throw out the error.
    * If the comment belongs to the user, delete the comment.
    * Catches any exceptions that occur during the process.
    */
    async DeleteCommentById (id: string, userId: string): Promise<ResultNotificationType> {
        try {
            const getComment: CommentMongoViewType | null = await CommentRepositories.GetCommentById(id)
            if (!getComment) return {status: ResultNotificationEnum.NotFound}
            if (getComment.commentatorInfo.userId !== userId) return {status: ResultNotificationEnum.Forbidden}

            await CommentRepositories.DeleteCommentById(id)
            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}