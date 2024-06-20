import { CreatePaginationType } from "../../Applications/Types-Models/BasicTypes";
import { CommentQueryRepositories } from "../../Repositories/CommentRepositories/CommentQueryRepositories";



/* 1. Creates pagination metadata for querying comment.
*       - page - Page number (1-based index).
*       - pageSize - Number of items per page.
*       - filter - Filter criteria for querying comment.
* 2. Throws an error if there's an issue retrieving total count or calculating pagination.
*/
export const createCommentPagination = async (page: number, pageSize: number, filter: Object): Promise<CreatePaginationType> => {
    try {
        const getTotalCount: number = await CommentQueryRepositories.GetCountElements(filter);
        const totalCount = +getTotalCount;
        const pagesCount = Math.ceil(totalCount / pageSize);
        const skip = (page - 1) * pageSize;

        return {
            totalCount: +totalCount,
            pagesCount: +pagesCount,
            skip: +skip,
            pageSize: +pageSize,
            page: +page,
        };
    } catch (e) {
        throw new Error();
    }
}
