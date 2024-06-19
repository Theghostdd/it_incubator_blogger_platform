import { SortAndPaginationQueryType } from "../../../Applications/Types-Models/BasicTypes"

export const defaultPaginationAndSortValue = {
    async defaultPaginationAndSortValues (query: SortAndPaginationQueryType): Promise<SortAndPaginationQueryType> {
        return {
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: (query.sortDirection === 'asc' || query.sortDirection === 'desc') ? query.sortDirection : 'desc',
            pageNumber: query.pageNumber ? query.pageNumber : 1,
            pageSize: query.pageSize ? query.pageSize : 10,
        }
    }
}