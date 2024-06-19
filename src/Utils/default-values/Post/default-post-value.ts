import { PostQueryValues } from "../../../Applications/Types-Models/Post/PostTypes"






export const defaultPostValues = {
    async defaultQueryValues (query: PostQueryValues): Promise<PostQueryValues> {
        return {
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: (query.sortDirection === 'asc' || query.sortDirection === 'desc') ? query.sortDirection : 'desc',
            pageNumber: query.pageNumber ? query.pageNumber : 1,
            pageSize: query.pageSize ? query.pageSize : 10,
        }
    }, 
    async defaultCreateValues (blogName: string) {
        return {
            createdAt: new Date().toISOString(),
            blogName: blogName
        }
    },
}