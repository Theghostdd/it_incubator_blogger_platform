import { CommentQueryType } from "../../../Applications/Types-Models/Comment/CommentTypes"

export const defaultCommentValues = {
    /*
    * Sets default values for comment query parameters if they are not provided or invalid.
    */
    async defaultQueryValue (query: CommentQueryType): Promise<CommentQueryType> {
        return {
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: (query.sortDirection === 'asc' || query.sortDirection === 'desc') ? query.sortDirection : 'desc',
            pageNumber: query.pageNumber ? query.pageNumber : 1,
            pageSize: query.pageSize ? query.pageSize : 10,
        }
    },
    /*
    * Sets default values for creating the new comment.
    */
    async defaultCreateValues () {
        return {
            createdAt: new Date().toISOString(),
        }
    },
}