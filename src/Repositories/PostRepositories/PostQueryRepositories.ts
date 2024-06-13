import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatePaginationType, SortAndPaginationQueryType } from "../../Applications/Types-Models/BasicTypes"
import { PostViewModelType, PostViewMongoModelType, PostsViewModelType } from "../../Applications/Types-Models/Post/PostTypes"
import { PostService } from "../../Service/PostService/PostService"
import { map } from "../../Utils/map/map"
import { MONGO_SETTINGS } from "../../settings"





export const PostQueryRepositories = {
    async GetAllBlogs (query: SortAndPaginationQueryType): Promise<PostsViewModelType> {
        try {
            const sort = {
                [query.sortBy!]: query.sortDirection!
            }

            const pagination: CreatePaginationType = await PostService.CreatePagination(query.pageNumber!, query.pageSize!)

            const result = await db.collection<PostViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.posts)
                .find()
                .sort(sort)
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray()

            return await map.mapPosts(result, pagination)
        } catch (e: any) { 
            throw new Error(e)
        }
    },

    async GetBlogById (id: string): Promise<PostViewModelType | null> {
        try {
            const result = await db.collection<PostViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.posts).findOne({_id: new ObjectId(id)})
            return result ? await map.mapPost(result, null) : null
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async GetCountElements (): Promise<number> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.posts).countDocuments()
        } catch (e: any) {
            throw new Error(e)
        }
    }
}