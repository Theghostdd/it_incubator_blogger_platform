import { BlogQueryParamsType } from "../../../Applications/Types-Models/Blog/BlogTypes"


export const defaultBlogValues = {
    /*
    * Sets default values for blog query parameters if they are not provided or invalid.
    */
    async defaultQueryValue (query: BlogQueryParamsType): Promise<BlogQueryParamsType> {
        return {
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: (query.sortDirection === 'asc' || query.sortDirection === 'desc') ? query.sortDirection : 'desc',
            pageNumber: query.pageNumber ? query.pageNumber : 1,
            pageSize: query.pageSize ? query.pageSize : 10,
            searchNameTerm: query.searchNameTerm ? query.searchNameTerm : ''
        }
    },
    /*
    * Sets default values for creating the new blog.
    */
    async defaultCreateValues () {
        return {
            createdAt: new Date().toISOString(),
            isMembership: false
        }
    },
}