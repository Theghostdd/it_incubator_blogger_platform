import { BlogRepos } from "../Repositories/BlogRepo/BlogRepo"
import { Response } from "../Applications/Utils/Response"
import { SaveError } from '../Service/ErrorService/ErrorService'
import { SETTINGS } from "../settings"
import { BlogCreatingType, BlogInputType, BlogResponseType } from "../Applications/Types/BlogsTypes/BlogTypes"
import { CreatedMongoSuccessType, DeletedMongoSuccessType, UpdateMongoSuccessType } from "../Applications/Types/Types"



export const BlogService = {
    async CreateBlogService (data: BlogInputType): Promise<BlogResponseType> { // Creating a blog element and returning this element
        const DataBlog: BlogCreatingType = { // Creating data for insertion
            ...data,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        try {
            const result: CreatedMongoSuccessType = await BlogRepos.CreateBlog(DataBlog) 
            return {
                status: 201,
                elements: {
                    ...DataBlog,
                    id: result.insertedId.toString()
                }
            }
        } catch (e: any) {
            SaveError(SETTINGS.PATH.BLOG, 'POST', 'Creating a blog element', e)
            return Response.E500
        }
    },

    async UpdateBlogService (id: string, data: BlogInputType) {
        try {
            const result: UpdateMongoSuccessType = await BlogRepos.UpdateBlogById(id, data)
            if (result.matchedCount > 0) {
                if (result.modifiedCount > 0) {
                    return Response.S204
                }
                return Response.S202
            }
            return Response.E404
        } catch(e) {
            SaveError(SETTINGS.PATH.BLOG, 'PUT', 'Updating a blog by ID', e)
            return Response.E500
        }
    },

    async DeleteBlogService (id: string): Promise<BlogResponseType> {
        try {
            const result: DeletedMongoSuccessType = await BlogRepos.DellBlogById(id)
            return result.deletedCount > 0 ? Response.S204 : Response.E404
        } catch (e: any) {
            SaveError(SETTINGS.PATH.BLOG, 'DELETE', 'Deleting a blog by ID', e)
            return Response.E500
        }
    }
}