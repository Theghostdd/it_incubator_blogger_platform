import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatePaginationType, SortAndPaginationQueryType } from "../../Applications/Types-Models/BasicTypes"
import { PostViewModelType, PostViewMongoModelType, PostsViewModelType } from "../../Applications/Types-Models/Post/PostTypes"
import { PostService } from "../../Service/PostService/PostService"
import { map } from "../../Utils/map/map"
import { MONGO_SETTINGS } from "../../settings"





export const PostQueryRepositories = {
    async GetAllPost (query: SortAndPaginationQueryType, blogId?: string): Promise<PostsViewModelType> {
        try {
            const sort = {
                [query.sortBy!]: query.sortDirection!
            }

            const filter = {
                blogId: blogId ? blogId : {$ne: ''}
            }

            const pagination: CreatePaginationType = await PostService.CreatePagination(query.pageNumber!, query.pageSize!, filter)

            const result = await db.collection<PostViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.posts)
                .find(filter)
                .sort(sort)
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray()

            return await map.mapPosts(result, pagination)
        } catch (e: any) { 
            throw new Error(e)
        }
    },

    async GetPostById (id: string): Promise<PostViewModelType | null> {
        try {
            const result = await db.collection<PostViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.posts).findOne({_id: new ObjectId(id)})
            return result ? await map.mapPost(result, null) : null
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async GetCountElements (filter: Object): Promise<number> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.posts).countDocuments(filter)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}