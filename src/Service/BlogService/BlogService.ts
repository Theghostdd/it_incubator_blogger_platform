import { CreatePaginationType, CreatedMongoSuccessType, DeletedMongoSuccessType, UpdateMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { BlogCreateInputModelType, BlogInputModelType, BlogViewModelType } from "../../Applications/Types-Models/Blog/BlogTypes"
import { BlogQueryRepositories } from "../../Repositories/BlogRepositories/BlogQueryRepositories"
import { BlogRepositories } from "../../Repositories/BlogRepositories/BlogRepositories"
import { defaultBlogValues } from "../../Utils/default-values/default-values"
import { map } from "../../Utils/map/map"

export const BlogService = {

    async CreateBlogItem (data: BlogInputModelType): Promise<BlogViewModelType> {
        try {
            const CreateData: BlogCreateInputModelType = {...data, ...await defaultBlogValues.defaultCreateValues()}
            const result: CreatedMongoSuccessType = await BlogRepositories.CreateBlog(CreateData)

            return await map.mapBlog(CreateData, result)
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async UpdateBlogById (id: string, data: BlogInputModelType): Promise<number> {
        try {
            const result: UpdateMongoSuccessType = await BlogRepositories.UpdateBlogById(id, data)
            return result.matchedCount > 0 ? 204 : 404
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async DeleteBlogById (id: string): Promise<number> {
        try {
            const result: DeletedMongoSuccessType = await BlogRepositories.DeleteBlogById(id)
            return result.deletedCount > 0 ? 204 : 404
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async CreatePagination (page: number, pageSize: number, filter: Object): Promise<CreatePaginationType> {
        try {
            const getTotalCount: number = await BlogQueryRepositories.GetCountElements(filter)
            const totalCount = +getTotalCount 
            const pagesCount = Math.ceil(totalCount / pageSize)
            const skip = (page - 1) * pageSize

            return {
                totalCount: +totalCount,
                pagesCount: +pagesCount,
                skip: +skip,
                pageSize: +pageSize,
                page: +page
            }
        } catch (e) {
            throw new Error();
        }
    }

}