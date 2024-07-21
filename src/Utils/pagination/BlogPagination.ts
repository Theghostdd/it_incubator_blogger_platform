import { CreatePaginationType } from "../../Applications/Types-Models/BasicTypes";
import { BlogQueryRepositories } from "../../Repositories/BlogRepositories/BlogQueryRepositories";

/*
* Creating pagination according to filtering
* Throws an error if there's an issue retrieving total count or calculating pagination.
*/
export const createBlogsPagination = async (page: number, pageSize: number, filter: Object): Promise<CreatePaginationType> => {
    try {
        const getTotalCount: number = await BlogQueryRepositories.GetCountElements(filter);
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
