import { Response } from "../Applications/Utils/Response"
import { SaveError } from '../Service/ErrorService/ErrorService'
import { SETTINGS } from "../settings"
import { CreatedMongoSuccessType, DeletedMongoSuccessType, UpdateMongoSuccessType } from "../Applications/Types/Types"
import { PostRepo } from "../Repositories/PostRepo/PostRepo"
import { BlogQueryRepos } from "../Repositories/BlogRepo/BlogQueryRepo"
import { PostCreateType, PostInputType, PostResponseType } from "../Applications/Types/PostsTypes/PostTypes"
import { BlogResponseType } from "../Applications/Types/BlogsTypes/BlogTypes"



export const PostService = {
    async CreatePostService (data: PostInputType): Promise<PostResponseType> {
        try {
            const getBlog: BlogResponseType = await BlogQueryRepos.GetBlogById(data.blogId)
            if (!getBlog) { 
                return Response.E404
            }  
    
            const DataPost: PostCreateType = {
                ...data,
                blogName: getBlog.elements!.name,
                createdAt: new Date().toISOString()
            }

            const result: CreatedMongoSuccessType = await PostRepo.CreatePost(DataPost) 
            return {
                status: 201,
                elements: {
                    ...DataPost,
                    id: result.insertedId.toString(),
                }
            }
        } catch (e: any) {
            SaveError(SETTINGS.PATH.POST, 'POST', 'Creating a post element', e)
            return Response.E500
        }
    },

    async UpdatePostService (id: string, data: PostInputType) {
        try {
            const getBlog: BlogResponseType = await BlogQueryRepos.GetBlogById(data.blogId)
            if (!getBlog) { 
                return Response.E404
            }  
            const result: UpdateMongoSuccessType = await PostRepo.UpdatePostById(id, data)
            if (result.matchedCount > 0) {
                if (result.modifiedCount > 0) {
                    return Response.S204
                }
                return Response.S202
            }
            return Response.E404
        } catch(e) {
            SaveError(SETTINGS.PATH.BLOG, 'PUT', 'Updating a post by ID', e)
            return Response.E500
        }
    },

    async DeletePostService (id: string): Promise<PostResponseType> {
        try {
            const result: DeletedMongoSuccessType = await PostRepo.DellPostById(id)
            return result.deletedCount > 0 ? Response.S204 : Response.E404
        } catch (e: any) {
            SaveError(SETTINGS.PATH.BLOG, 'DELETE', 'Deleting a post by ID', e)
            return Response.E500
        }
    }
}