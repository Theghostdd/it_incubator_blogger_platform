import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatePaginationType } from "../../Applications/Types-Models/BasicTypes"
import { BlogQueryParamsType, BlogViewModelType, BlogViewMongoModelType, BlogsViewModelType } from "../../Applications/Types-Models/Blog/BlogTypes"
import { map } from "../../Utils/map/map"
import { MONGO_SETTINGS } from "../../settings"
import { createBlogsPagination } from "../../Utils/pagination/BlogPagination"




export const BlogQueryRepositories = {
    async GetAllBlogs (query: BlogQueryParamsType): Promise<BlogsViewModelType> {
        try {
            const sort = {
                [query.sortBy!]: query.sortDirection!
            }
            const filter = {
                name: {$regex: query.searchNameTerm, $options: 'i'}
            }

            const pagination: CreatePaginationType = await createBlogsPagination(query.pageNumber!, query.pageSize!, filter)

            const result = await db.collection<BlogViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.blogs)
                .find(filter)
                .sort(sort)
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray()

            return await map.mapBlogs(result, pagination)
        } catch (e: any) { 
            throw new Error(e)
        }
    },

    async GetBlogById (id: string): Promise<BlogViewModelType | null> {
        try {
            const result = await db.collection<BlogViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.blogs).findOne({_id: new ObjectId(id)})
            return result ? await map.mapBlog(result, null) : null
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async GetCountElements (filter: Object): Promise<number> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.blogs).countDocuments(filter)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}