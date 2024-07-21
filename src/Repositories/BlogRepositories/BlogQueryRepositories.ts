import {
    CreatePaginationType,
    QueryParamsType,
    ResultDataWithPaginationType
} from "../../Applications/Types-Models/BasicTypes"
import { BlogQueryParamsType, BlogViewModelType} from "../../Applications/Types-Models/Blog/BlogTypes"
import { createBlogsPagination } from "../../Utils/pagination/BlogPagination"
import { BlogMapper } from "../../Utils/map/Blog/BlogMap"
import {BlogModel} from "../../Domain/Blog/Blog";

export const BlogQueryRepositories = {
    /*
    * Creating an object to sort according to query.
    * Create a search filter in accordance with the query.
    * Create pagination based on pagination sorting and filtering.
    * Obtaining documents in accordance with all of the above.
    * Data mapping to create a returnable blog model.
    * If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async GetAllBlogs (query: QueryParamsType<BlogQueryParamsType>): Promise<ResultDataWithPaginationType<BlogViewModelType[]>> {
        try {
            const sort = {
                [query.sortBy!]: query.sortDirection!
            }
            const filter = {
                name: {$regex: query.searchNameTerm, $options: 'i'}
            }

            const pagination: CreatePaginationType = await createBlogsPagination(query.pageNumber!, query.pageSize!, filter)

            const result = await BlogModel
                .find(filter)
                .sort(sort)
                .skip(pagination.skip)
                .limit(pagination.pageSize)

            return await BlogMapper.MapBlogs(result, pagination)
        } catch (e: any) { 
            throw new Error(e)
        }
    },
    /*
    * Getting a blog by ID.
    * If the blog was found, return the updated model of this blog, otherwise return null.
    * If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */ 
    async GetBlogById (id: string): Promise<BlogViewModelType | null> {
        try {
            const result = await BlogModel.findById(id)
            return result ? await BlogMapper.MapBlog(result) : null
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Getting the total number of documents according to the specified filters.
    * If an error occurs during the counting process, catch the error and throw it as a generic Error.
    */ 
    async GetCountElements (filter: any): Promise<number> {
        try {
            return await BlogModel.countDocuments(filter)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}