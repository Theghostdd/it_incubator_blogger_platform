import { CreatedMongoSuccessType, DeletedMongoSuccessType, ResultNotificationEnum, ResultNotificationType, UpdateMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { BlogCreateInputModelType, BlogInputModelType, BlogViewModelType, BlogViewMongoModelType } from "../../Applications/Types-Models/Blog/BlogTypes"
import { BlogRepositories } from "../../Repositories/BlogRepositories/BlogRepositories"
import { defaultBlogValues } from "../../Utils/default-values/Blog/default-blog-value"
import { BlogMapper } from "../../Utils/map/Blog/BlogMap"

export const BlogService = {
    /* 
    * 1. Combines input `data` with default values.
    * 2. Calls repositories to insert into the database.
    * 3. Retrieves the newly created blog item from the database.
    * 4. If the retrieved blog item is not found, returns a `NotFound` status.
    * 5. Maps the retrieved blog item.
    * 6. Returns a `Success` status along with the mapped blog data.
    * 7. Catches and throws any errors (`e`) that occur during the creation or retrieval process.
    */
    async CreateBlogItem (data: BlogInputModelType): Promise<ResultNotificationType<BlogViewModelType>> {
        try {
            const CreateData: BlogCreateInputModelType = {...data, ...await defaultBlogValues.defaultCreateValues()}
            const createdResult: CreatedMongoSuccessType = await BlogRepositories.CreateBlog(CreateData)
            const getCreatedElement: BlogViewMongoModelType | null = await BlogRepositories.GetBlogByIdWithoutMap(createdResult.insertedId.toString())

            if (!getCreatedElement) {
                return {status: ResultNotificationEnum.NotFound}
            }
            return {status: ResultNotificationEnum.Success, data: await BlogMapper.MapCreatedBlog(getCreatedElement)}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * 1. Calls repositories to update the blog item in the database.
    * 2. Checks the `matchedCount` property of the update result.
    * 3. If `matchedCount` is greater than 0, returns a `Success` status indicating the blog was updated.
    * 4. If no blog item is matched by the ID (`matchedCount` is 0), returns a `NotFound` status.
    * 5. Catches and throws any errors (`e`) that occur during the update operation.
    */ 
    async UpdateBlogById (id: string, data: BlogInputModelType): Promise<ResultNotificationType> {
        try {
            const result: UpdateMongoSuccessType = await BlogRepositories.UpdateBlogById(id, data)
            return result.matchedCount > 0 ? {status: ResultNotificationEnum.Success} : {status: ResultNotificationEnum.NotFound}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * 1. Calls repositories to delete the blog item from the database.
    * 2. Checks the `deletedCount` property of the deletion result.
    * 3. If `deletedCount` is greater than 0, returns a `Success` status indicating the blog item was deleted.
    * 4. If no blog item is matched by the ID (`deletedCount` is 0), returns a `NotFound` status.
    * 5. Catches and throws any errors (`e`) that occur during the deletion operation.
    */
    async DeleteBlogById (id: string): Promise<ResultNotificationType> {
        try {
            const result: DeletedMongoSuccessType = await BlogRepositories.DeleteBlogById(id)
            return result.deletedCount > 0 ? {status: ResultNotificationEnum.Success} : {status: ResultNotificationEnum.NotFound}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}