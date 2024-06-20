import { DeletedMongoSuccessType, ResultNotificationEnum, ResultNotificationType, UpdateMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { CommentInputModelType, CommentMongoViewType } from "../../Applications/Types-Models/Comment/CommentTypes"
import { CommentRepositories } from "../../Repositories/CommentRepositories/CommentRepositories"





export const CommentService = {
    /*
    * 1. Tries to retrieve the comment with the specified ID (`id`).
    *    - If no comment is found, returns a result with status `ResultNotificationEnum.NotFound`.
    * 2. Checks if the user requesting the update (`userId`) is the same as the user who created the comment:
    *    - If the users do not match, returns a result with status `ResultNotificationEnum.Forbidden`.
    * 3. Calls repositories to update the comment data:
    *    - The `data` object contains the new comment information to be updated.
    *    - If the update operation matches and updates any document (`result.matchedCount > 0`), returns a result with status `ResultNotificationEnum.Success`.
    *    - If no document is matched for the update, returns a result with status `ResultNotificationEnum.NotFound`.
    * 4. Catches any exceptions that occur during the process.
    */
    async UpdateCommentById (id: string, userId: string, data: CommentInputModelType): Promise<ResultNotificationType> {
        try {
            const getComment: CommentMongoViewType | null = await CommentRepositories.GetCommentByIdWithoutMap(id)
            if (!getComment) {
                return {status: ResultNotificationEnum.NotFound}
            }
            if (getComment.commentatorInfo.userId !== userId) {
                return {status: ResultNotificationEnum.Forbidden}
            }
            const result: UpdateMongoSuccessType = await CommentRepositories.UpdateCommentById(id, data)
            return result.matchedCount > 0 ? {status: ResultNotificationEnum.Success} : {status: ResultNotificationEnum.NotFound}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Tries to retrieve the comment with the specified ID (`id`).
    *    - If no comment is found, returns a result with status `ResultNotificationEnum.NotFound`.
    * 2. Checks if the user requesting the deletion (`userId`) is the same as the user who created the comment:
    *    - If the users do not match, returns a result with status `ResultNotificationEnum.Forbidden`.
    * 3. Calls `CommentRepositories.DeleteCommentById` to delete the comment:
    *    - If the deletion operation successfully deletes any document (`result.deletedCount > 0`), returns a result with status `ResultNotificationEnum.Success`.
    *    - If no document is matched and deleted, returns a result with status `ResultNotificationEnum.NotFound`.
    * 4. Catches any exceptions that occur during the process.
    */
    async DeleteCommentById (id: string, userId: string): Promise<ResultNotificationType> {
        try {
            const getComment: CommentMongoViewType | null = await CommentRepositories.GetCommentByIdWithoutMap(id)
            if (!getComment) {
                return {status: ResultNotificationEnum.NotFound}
            }
            if (getComment.commentatorInfo.userId !== userId) {
                return {status: ResultNotificationEnum.Forbidden}
            }

            const result: DeletedMongoSuccessType = await CommentRepositories.DeleteCommentById(id)
            return result.deletedCount > 0 ? {status: ResultNotificationEnum.Success} : {status: ResultNotificationEnum.NotFound}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}