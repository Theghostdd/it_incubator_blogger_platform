import { CreatePaginationType } from "../../Applications/Types-Models/BasicTypes";
import { CommentQueryRepositories } from "../../Repositories/CommentRepositories/CommentQueryRepositories";

/*
* Create a pagination for comments in accordance with the rules of pagination and filtering.
* Throws an error if there's an issue retrieving total count or calculating pagination.
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
