import { ObjectId } from "mongodb"
import {
    CreatePaginationType,
    QueryParamsType,
    ResultDataWithPaginationType
} from "../../Applications/Types-Models/BasicTypes"
import { PostViewModelType, PostViewMongoModelType } from "../../Applications/Types-Models/Post/PostTypes"
import { createPostPagination } from "../../Utils/pagination/PostPagination"
import { PostMapper } from "../../Utils/map/Post/PostMap"
import {PostModel} from "../../Domain/Post/Post";





export const PostQueryRepositories = {
    /* 
    * Create sorting and filtering by blog ID to get all posts.
    * Creating pagination in accordance with pagination data and filtering.
    * Search for all documents in accordance with filters by sorting and pagination.
    * Data mapping and return of the potts model.
    * If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async GetAllPost (query: QueryParamsType, blogId?: string): Promise<ResultDataWithPaginationType<PostViewModelType[]>> {
        try {
            const sort = {
                [query.sortBy!]: query.sortDirection!
            }
            const filter = {
                blogId: blogId ? blogId : {$ne: ''}
            }

            const pagination: CreatePaginationType = await createPostPagination(query.pageNumber!, query.pageSize!, filter)

            const result = await PostModel
                .find(filter)
                .sort(sort)
                .skip(pagination.skip)
                .limit(pagination.pageSize)

            return await PostMapper.mapPosts(result, pagination)
        } catch (e: any) { 
            throw new Error(e)
        }
    },
    /* 
    * 1. Convert the `id` from a string to a MongoDB `ObjectId`.
    * 2. Attempt to find and retrieve the post from the `posts` collection where `_id` matches the converted `ObjectId`.
    * 3. If a matching post is found (`result` is truthy), map the retrieved post
    * 4. If no matching post is found (`result` is falsy), return null.
    * 5. If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async GetPostById (id: string): Promise<PostViewModelType | null> {
        try {
            const result = await db.collection<PostViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.posts).findOne({_id: new ObjectId(id)})
            return result ? await PostMapper.MapPost(result) : null
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * Getting the total number of documents posts according to filtering
    * If an error occurs during the counting process, catch the error and throw it as a generic Error.
    */ 
    async GetCountElements (filter: Object): Promise<number> {
        try {
            return await PostModel.countDocuments(filter)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}