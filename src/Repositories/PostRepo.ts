import { PostResponseType, PostsResponseType, PostsViewType, PostInputType} from "../Applications/Types/Types";
import { Response } from '../Applications/Response/Response'
import { CreateId } from "../Applications/Utils/CreateId";
import { BlogRepos } from "./BlogRepo";

export const dbPosts: PostsViewType = [

]

export const PostRepo = {
    async GetPostById (id: string): Promise<PostResponseType> {
        try { // Catch error
            const result = await dbPosts.find(p => p.id === id) // Looking for element by id
            if (result) { // If found element sending this element
                return {
                    status: 200,
                    message: "OK",
                    elements: result
                }
            } // Else sending error 404
            return Response.E404
        } catch (e) { // If process has error sending error
            return Response.E400
        }
    },

    async GetAllPosts (): Promise<PostsResponseType> {
        try { // Catch error 
            if (dbPosts.length < 1) { // If DB has 0 elements sending error 404
                return Response.E404
            } // Else sending all elements
            return {
                status: 200,
                message: "Ok",
                elements: dbPosts
            }
            
        
        } catch (e) { // If process has error sending error
            return Response.E400
        }
    },

    async DellPostById (id: string): Promise<PostResponseType> {
        try { // Catch error
            const result = await dbPosts.findIndex(p => p.id === id) // Looking for element`s index by id 
            if(result !== -1) { //  If element found, delete it
                dbPosts.splice(result, 1)
                return {
                    status: 204,
                    message: "OK",
                    elements: null
                }
            } // Else sending error 404
            return Response.E404
        } catch (e) { // If process has error sending error
            return Response.E400
        } 
    },

    async UpdatePostById (id: string, data: PostInputType ) {
        try { // Catch error
            const result = await dbPosts.findIndex(p => p.id === id)
            if (result !== -1) {
                dbPosts[result] = {...dbPosts[result], ...data}
                return {
                    status: 204,
                    message: "Ok",
                    elements: null
                }
            }
            return Response.E404
        } catch (e) { // If process has error sending error
            return Response.E400
        }
    },

    async CreatePost (data: PostInputType): Promise<PostResponseType> {
        try { // Catch error
            const getBlogById = await BlogRepos.GetBlogById(data.blogId) // Looking for Blog by ID

            if (getBlogById && getBlogById.elements && getBlogById.elements.name) { // If element found then create post
                const CreateElement = {
                    id: CreateId(),
                    blogName: getBlogById.elements.name,
                    ...data
                }

                await dbPosts.push(CreateElement)

                return {
                    status: 201,
                    message: "Ok",
                    elements: CreateElement
                }
            } // Else sending error 404
            return Response.E404
        } catch (e) { // If process has error sending error
            return Response.E400
        }
    }
}