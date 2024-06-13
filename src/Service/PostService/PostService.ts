import { CreatePaginationType, CreatedMongoSuccessType, DeletedMongoSuccessType, UpdateMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { BlogViewModelType } from "../../Applications/Types-Models/Blog/BlogTypes"
import { PostCreateInputModelType, PostInputModelType, PostViewModelType } from "../../Applications/Types-Models/Post/PostTypes"
import { BlogQueryRepositories } from "../../Repositories/BlogRepositories/BlogQueryRepositories"
import { PostQueryRepositories } from "../../Repositories/PostRepositories/PostQueryRepositories"
import { PostRepositories } from "../../Repositories/PostRepositories/PostRepositories"
import { defaultPostValues } from "../../Utils/default-values/default-values"
import { map } from "../../Utils/map/map"





export const PostService = {

    async CreatePostItemByBlogId (data: PostInputModelType): Promise<PostViewModelType | null> {
        try {
            const getBlogById: BlogViewModelType | null = await BlogQueryRepositories.GetBlogById(data.blogId)
            if (!getBlogById) {
                return null
            }

            const CreateData: PostCreateInputModelType  = {...data, ...await defaultPostValues.defaultCreateValues(getBlogById.name)}
            const result: CreatedMongoSuccessType= await PostRepositories.CreatePost(CreateData)
            return await map.mapPost(CreateData, result)
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async UpdatePostById (id: string, data: PostInputModelType): Promise<number> {
        try {
            const result: UpdateMongoSuccessType = await PostRepositories.UpdatePostById(id, data)
            return result.matchedCount > 0 ? 204 : 404
        } catch (e: any) {
            throw new Error(e)
        }   
    },

    async DeletePostById (id: string): Promise<number> {
        try {
            const result: DeletedMongoSuccessType = await PostRepositories.DeletePostById(id)
            return result.deletedCount > 0 ? 204 : 404
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async CreatePagination (page: number, pageSize: number, filter: Object): Promise<CreatePaginationType> {
        try {
            const getTotalCount: number = await PostQueryRepositories.GetCountElements(filter)
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