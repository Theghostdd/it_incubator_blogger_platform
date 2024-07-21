import {QueryParamsType} from "../../../Applications/Types-Models/BasicTypes";

export const defaultPostValues = {
    /*
    * Sets default values for post query parameters if they are not provided or invalid.
    */
    async defaultQueryValues (query: QueryParamsType): Promise<QueryParamsType> {
        return {
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: (query.sortDirection === 'asc' || query.sortDirection === 'desc') ? query.sortDirection : 'desc',
            pageNumber: query.pageNumber ? query.pageNumber : 1,
            pageSize: query.pageSize ? query.pageSize : 10,
        }
    }, 
    /*
    * Sets default values for creating the new post.
    */
    async defaultCreateValues (blogName: string) {
        return {
            createdAt: new Date().toISOString(),
            blogName: blogName
        }
    },
}