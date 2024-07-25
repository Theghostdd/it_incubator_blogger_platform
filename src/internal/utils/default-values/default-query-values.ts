import {QueryParamsType} from "../../../Applications/Types-Models/BasicTypes";
import {BlogQueryParamsType} from "../../../features/blog/blog-types";


export const defaultQueryValues = {
    defaultQueryValue (query: QueryParamsType): QueryParamsType {
        return {
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: (query.sortDirection === 'asc' || query.sortDirection === 'desc') ? query.sortDirection : 'desc',
            pageNumber: query.pageNumber ? query.pageNumber : 1,
            pageSize: query.pageSize ? query.pageSize : 10,

        }
    },

    defaultQueryBlogValues (query: QueryParamsType<BlogQueryParamsType>): QueryParamsType<BlogQueryParamsType> {
        return {
            ...this.defaultQueryValue(query),
            searchNameTerm: query.searchNameTerm ? query.searchNameTerm : ''
        }
    }
}