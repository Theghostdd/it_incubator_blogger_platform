import {
    CreatePaginationType,
    QueryParamsType,
    ResultDataWithPaginationType
} from "../../Applications/Types-Models/BasicTypes"
import { CommentViewModelType } from "../../Applications/Types-Models/Comment/CommentTypes"
import { CommentsMap } from "../../Utils/map/Comments/CommentsMap"
import { createCommentPagination } from "../../Utils/pagination/CommentPagination"
import {CommentModel} from "../../Domain/Comment/Comment";

export const CommentQueryRepositories = {
    /* 
    * Creating an object for sorting data.
    * Create a filter to sort the data.
    * Creating a pagination in accordance with the rules of pagination and filtering.
    * Getting all comments for a post by its ID.
    * Return of the data model.
    * If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async GetAllComments (query: QueryParamsType, postId: string): Promise<ResultDataWithPaginationType<CommentViewModelType[]>> {
        try {
            const sort = {
                [query.sortBy!]: query.sortDirection!
            }
            const filter = {
                postInfo: {postId: postId ? postId : {$ne: ''}}
            }

            const pagination: CreatePaginationType = await createCommentPagination(query.pageNumber!, query.pageSize!, filter)

            const result = await CommentModel
                .find(filter)
                .sort(sort)
                .skip(pagination.skip)
                .limit(pagination.pageSize)

            return await CommentsMap.MapComments(result, pagination)
        } catch (e: any) { 
            throw new Error(e)
        }
    },
    /* 
    * Getting a comment on his ID.
    * Return of the deleted comment model if the comment was found, if not, return null.
    * If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async GetCommentById (id: string): Promise<CommentViewModelType| null> {
        try {
            const result = await CommentModel.findById(id)
            return result ? await CommentsMap.MapComment(result) : null
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * Request the total number of comment documents, in accordance with the rules of filtering and pagination.
    * If an error occurs during the counting process, catch the error and throw it as a generic Error.
    */ 
    async GetCountElements (filter: Object): Promise<number> {
        try {
            return await CommentModel.countDocuments(filter)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}