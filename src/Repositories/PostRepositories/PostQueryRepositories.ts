import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatePaginationType } from "../../Applications/Types-Models/BasicTypes"
import { PostQueryValues, PostViewModelType, PostViewMongoModelType, PostsViewModelType } from "../../Applications/Types-Models/Post/PostTypes"
import { MONGO_SETTINGS } from "../../settings"
import { createPostPagination } from "../../Utils/pagination/PostPagination"
import { PostMapper } from "../../Utils/map/Post/PostMap"





export const PostQueryRepositories = {
    /* The function performs the following steps:
    * 1. Constructs sorting criteria 
    * 2. Constructs a filter to optionally include posts only from a specific blog
    * 3. Generates pagination settings
    * 4. Queries the MongoDB `posts` collection:
    *    - Filters posts based on the constructed filter.
    *    - Sorts posts based on the constructed sort criteria.
    *    - Applies pagination using skip and limit operations.
    *    - Converts the query result to an array
    * 5. Maps the retrieved posts and pagination data to create a structured view model.
    * 6. Returns the structured view model containing the retrieved posts and pagination information.
    */
    async GetAllPost (query: PostQueryValues, blogId?: string): Promise<PostsViewModelType> {
        try {
            const sort = {
                [query.sortBy!]: query.sortDirection!
            }
            const filter = {
                blogId: blogId ? blogId : {$ne: ''}
            }

            const pagination: CreatePaginationType = await createPostPagination(query.pageNumber!, query.pageSize!, filter)

            const result = await db.collection<PostViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.posts)
                .find(filter)
                .sort(sort)
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray()

            return await PostMapper.mapPosts(result, pagination)
        } catch (e: any) { 
            throw new Error(e)
        }
    },
    /* The function performs the following steps:
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
    /* The function performs the following steps:
    * 1. Queries the MongoDB collection
    * 2. Counts the number of documents that match the provided `filter`.
    * 3. Returns the count of matching documents as a number.
    * 4. If an error occurs during the counting process, catch the error and throw it as a generic Error.
    */ 
    async GetCountElements (filter: Object): Promise<number> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.posts).countDocuments(filter)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}