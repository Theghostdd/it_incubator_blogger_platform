import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatePaginationType } from "../../Applications/Types-Models/BasicTypes"
import { CommentMongoViewType, CommentQueryType, CommentViewModelType, CommentsViewModelType } from "../../Applications/Types-Models/Comment/CommentTypes"
import { CommentsMap } from "../../Utils/map/Comments/CommentsMap"
import { createCommentPagination } from "../../Utils/pagination/CommentPagination"
import { MONGO_SETTINGS } from "../../settings"


export const CommentQueryRepositories = {
    /* 
    * 1. Constructs sorting criteria 
    * 2. Constructs a filter to optionally include comments only from a specific post 
    * 3. Generates pagination settings
    * 4. Queries the MongoDB `comments` collection:
    *    - Filters comments based on the constructed filter.
    *    - Sorts comments based on the constructed sort criteria.
    *    - Applies pagination using skip and limit operations.
    *    - Converts the query result to an array
    * 5. Maps the retrieved comments and pagination data to create a structured view model.
    * 6. Returns the structured view model containing the retrieved comments and pagination information.
    */
    async GetAllComments (query: CommentQueryType, postId: string): Promise<CommentsViewModelType> {
        try {
            const sort = {
                [query.sortBy!]: query.sortDirection!
            }
            const filter = {
                postInfo: {postId: postId ? postId : {$ne: ''}}
            }

            const pagination: CreatePaginationType = await createCommentPagination(query.pageNumber!, query.pageSize!, filter)

            const result = await db.collection<CommentMongoViewType>(MONGO_SETTINGS.COLLECTIONS.comments)
                .find(filter)
                .sort(sort)
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray()

            return await CommentsMap.MapComments(result, pagination)
        } catch (e: any) { 
            throw new Error(e)
        }
    },
    /* 
    * 1. Convert the `id` from a string to a MongoDB `ObjectId`.
    * 2. Attempt to find and retrieve the comment from the `comments` collection where `_id` matches the converted `ObjectId`.
    * 3. If a matching comment is found (`result` is truthy), map the retrieved comment
    * 4. If no matching comment is found (`result` is falsy), return null.
    * 5. If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async GetCommentById (id: string): Promise<CommentViewModelType| null> {
        try {
            const result = await db.collection<CommentMongoViewType>(MONGO_SETTINGS.COLLECTIONS.comments).findOne({_id: new ObjectId(id)})
            return result ? await CommentsMap.MapComment(result) : null
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * 1. Queries the MongoDB collection
    * 2. Counts the number of documents that match the provided `filter`.
    * 3. Returns the count of matching documents as a number.
    * 4. If an error occurs during the counting process, catch the error and throw it as a generic Error.
    */ 
    async GetCountElements (filter: Object): Promise<number> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.comments).countDocuments(filter)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}