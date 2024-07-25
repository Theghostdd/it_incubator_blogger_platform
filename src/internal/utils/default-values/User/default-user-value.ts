import { UserQueryParamsType } from "../../../Applications/Types-Models/User/UserTypes"
import {QueryParamsType} from "../../../Applications/Types-Models/BasicTypes";

export const defaultUserValues = {
    /*
    * Sets default values for user query parameters if they are not provided or invalid.
    */
    async defaultQueryValue (query: QueryParamsType<UserQueryParamsType>): Promise<QueryParamsType<UserQueryParamsType>> {
        return {
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: (query.sortDirection === 'asc' || query.sortDirection === 'desc') ? query.sortDirection : 'desc',
            pageNumber: query.pageNumber ? query.pageNumber : 1,
            pageSize: query.pageSize ? query.pageSize : 10,
            searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : '',
            searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : ''
        }
    },
    /*
    * Sets default values for creating the new user.
    */
    async defaultCreateValue () {
        return {
            createdAt: new Date().toISOString()
        }
    }

}
