import { BlogQueryParamsType } from "../../../Applications/Types-Models/Blog/BlogTypes"





export const defaultBlogValues = {
    async defaultQueryValue (query: BlogQueryParamsType): Promise<BlogQueryParamsType> {
        return {
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: (query.sortDirection === 'asc' || query.sortDirection === 'desc') ? query.sortDirection : 'desc',
            pageNumber: query.pageNumber ? query.pageNumber : 1,
            pageSize: query.pageSize ? query.pageSize : 10,
            searchNameTerm: query.searchNameTerm ? query.searchNameTerm : ''
        }
    },

    async defaultCreateValues () {
        return {
            createdAt: new Date().toISOString(),
            isMembership: false
        }
    },
}