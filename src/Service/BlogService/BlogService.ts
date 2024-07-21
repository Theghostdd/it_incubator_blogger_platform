import { ResultNotificationEnum, ResultNotificationType, } from "../../Applications/Types-Models/BasicTypes"
import {
    BlogCreateInputModelType,
    BlogInputModelType,
    BlogViewModelType,
    BlogViewMongoType
} from "../../Applications/Types-Models/Blog/BlogTypes"
import { BlogRepositories } from "../../Repositories/BlogRepositories/BlogRepositories"
import { defaultBlogValues } from "../../Utils/default-values/Blog/default-blog-value"
import { BlogMapper } from "../../Utils/map/Blog/BlogMap"

export const BlogService = {
    /*
    * Creating an object for creating a blog.
    * Transfer the blog creation object to the repository.
    * Return of the heated object.
    * Catches and throws any errors that occur during the creation or retrieval process.
    */
    async CreateBlogItem (data: BlogInputModelType): Promise<ResultNotificationType<BlogViewModelType>> {
        try {
            const CreateData: BlogCreateInputModelType = {...data, ...await defaultBlogValues.defaultCreateValues()}
            const createdResult: BlogViewMongoType = await BlogRepositories.CreateBlog(CreateData)

            return {status: ResultNotificationEnum.Success, data: await BlogMapper.MapBlog(createdResult)}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * Updating the blog by ID.
    * If the blog was not found, the error was returned.
    * If the blog is updated, return success.
    * Catches and throws any errors that occur during the update operation.
    */ 
    async UpdateBlogById (id: string, data: BlogInputModelType): Promise<ResultNotificationType> {
        try {
            const result: BlogViewMongoType | null = await BlogRepositories.UpdateBlogById(id, data)
            return result ? {status: ResultNotificationEnum.Success} : {status: ResultNotificationEnum.NotFound}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * Deleting a blog by its ID.
    * If the blog was found to return the success, otherwise the return is error.
    * Catches and throws any errors (`e`) that occur during the deletion operation.
    */
    async DeleteBlogById (id: string): Promise<ResultNotificationType> {
        try {
            const result: BlogViewMongoType | null = await BlogRepositories.DeleteBlogById(id)
            return result ? {status: ResultNotificationEnum.Success} : {status: ResultNotificationEnum.NotFound}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}