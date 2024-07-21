import { CreatePaginationType } from "../../Applications/Types-Models/BasicTypes"
import { PostQueryRepositories } from "../../Repositories/PostRepositories/PostQueryRepositories"
/*
* Creating pagination for posts with filter.
* Throws an error if there's an issue retrieving total count or calculating pagination.
*/
export const createPostPagination = async (page: number, pageSize: number, filter: Object): Promise<CreatePaginationType> => {
    try {
        const getTotalCount: number = await PostQueryRepositories.GetCountElements(filter)
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