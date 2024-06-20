import { CreatePaginationType } from "../../Applications/Types-Models/BasicTypes"
import { UserQueryRepositories } from "../../Repositories/UserRepostitories/UserQueryRepositories"
/* 1. Creates pagination metadata for querying user.
*       - page - Page number (1-based index).
*       - pageSize - Number of items per page.
*       - filter - Filter criteria for querying user.
* 2. Throws an error if there's an issue retrieving total count or calculating pagination.
*/
export const CreateUserPagination = async (page: number, pageSize: number, filter: Object): Promise<CreatePaginationType> => {
    try {
        const getTotalCount: number = await UserQueryRepositories.GetCountElements(filter)
        const totalCount = +getTotalCount 
        const pagesCount = Math.ceil(totalCount / pageSize)
        const skip = (page - 1) * pageSize

        return {
            totalCount: +totalCount,
            pagesCount: +pagesCount,
            skip: +skip,
            pageSize: +pageSize,
            page: +page
        }
    } catch (e) {
        throw new Error();
    }
}