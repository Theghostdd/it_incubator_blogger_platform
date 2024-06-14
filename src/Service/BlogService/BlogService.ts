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

    async UpdateBlogById (id: string, data: BlogInputModelType): Promise<boolean> {
        try {
            const result: UpdateMongoSuccessType = await BlogRepositories.UpdateBlogById(id, data)
            return result.matchedCount > 0 ? true : false
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async DeleteBlogById (id: string): Promise<boolean> {
        try {
            const result: DeletedMongoSuccessType = await BlogRepositories.DeleteBlogById(id)
            return result.deletedCount > 0 ? true : false
        } catch (e: any) {
            throw new Error(e)
        }
    }
}