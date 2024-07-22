import {
    CreatePaginationType,
    QueryParamsType,
    ResultDataWithPaginationType
} from "../../Applications/Types-Models/BasicTypes"
import { PostViewModelType } from "../../Applications/Types-Models/Post/PostTypes"
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
    * Query the database to get a post by ID.
    * * If the post is not found, the return of emptiness is found.
    * If the post was found, the updated post model will be returned.
    * If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async GetPostById (id: string): Promise<PostViewModelType | null> {
        try {
            const result = await PostModel.findById(id)
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