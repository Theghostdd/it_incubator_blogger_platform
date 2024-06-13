import { SortAndPaginationQueryType } from "../../Applications/Types-Models/BasicTypes"
import { BlogQueryParamsType } from "../../Applications/Types-Models/Blog/BlogTypes"
import { UserQueryParamsType } from "../../Applications/Types-Models/User/UserTypes"


export const defaultValueBasic = {
    async defaultPaginationAndSortValues (query: SortAndPaginationQueryType): Promise<SortAndPaginationQueryType> {
        return {
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: (query.sortDirection === 'asc' || query.sortDirection === 'desc') ? query.sortDirection : 'desc',
            pageNumber: query.pageNumber ? query.pageNumber : 1,
            pageSize: query.pageSize ? query.pageSize : 10,
        }
    }
}
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


export const defaultPostValues = {
    async defaultCreateValues (blogName: string) {
        return {
            createdAt: new Date().toISOString(),
            blogName: blogName
        }
    },
}


export const defaultUserValues = {
    async defaultQueryValue (query: UserQueryParamsType): Promise<UserQueryParamsType> {
        return {
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: (query.sortDirection === 'asc' || query.sortDirection === 'desc') ? query.sortDirection : 'desc',
            pageNumber: query.pageNumber ? query.pageNumber : 1,
            pageSize: query.pageSize ? query.pageSize : 10,
            searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : '',
            searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : ''
        }
    },


    async defaultCreateValues () {
        return {
            createdAt: new Date().toISOString(),
        }
    },
}
