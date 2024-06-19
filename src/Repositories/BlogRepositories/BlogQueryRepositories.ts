import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatePaginationType } from "../../Applications/Types-Models/BasicTypes"
import { BlogQueryParamsType, BlogViewModelType, BlogViewMongoModelType, BlogsViewModelType } from "../../Applications/Types-Models/Blog/BlogTypes"
import { MONGO_SETTINGS } from "../../settings"
import { createBlogsPagination } from "../../Utils/pagination/BlogPagination"
import { BlogMapper } from "../../Utils/map/Blog/BlogMap"




export const BlogQueryRepositories = {
    /*
    * 1. Constructs sorting criteria (`sort`) based on `query.sortBy` and `query.sortDirection`.
    * 2. Constructs a filter (`filter`) to search for blogs by name using a case-insensitive regex match (`$regex`).
    * 3. Create pagination settings.
    * 4. Queries the database collection 
    *    - Finds blogs that match the filter criteria.
    *    - Sorts the results using the sorting criteria.
    *    - Applies pagination to limit the number of results returned.
    * 5. Maps the queried results (`result`) and pagination settings.
    * 6. Returns a mapped blog data and pagination information.
    * 7. If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
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

            return await BlogMapper.MapBlogs(result, pagination)
        } catch (e: any) { 
            throw new Error(e)
        }
    },
    /*
    * 1. Queries the database collection to find a blog item by its ID.
    * 2. Map the retrieved database model.
    * 3. Returns the mapped data if a blog item is found (`result` is not null).
    * 4. Returns `null` if no blog item is found (`result` is null).
    * 5. If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */ 
    async GetBlogById (id: string): Promise<BlogViewModelType | null> {
        try {
            const result = await db.collection<BlogViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.blogs).findOne({_id: new ObjectId(id)})
            return result ? await BlogMapper.MapBlog(result) : null
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
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.blogs).countDocuments(filter)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}