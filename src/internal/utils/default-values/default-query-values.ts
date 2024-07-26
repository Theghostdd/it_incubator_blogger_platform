import {QueryParamsType} from "../../../typings/basic-types";
import {BlogQueryParamsType} from "../../../features/blog/blog-types";
import {UserQueryParamsType} from "../../../features/user/user-types";


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
    },

    defaultQueryUserValues (query: QueryParamsType<UserQueryParamsType>): QueryParamsType<UserQueryParamsType> {
        return {
            ...this.defaultQueryValue(query),
            searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : '',
            searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : ''
        }
    }
}