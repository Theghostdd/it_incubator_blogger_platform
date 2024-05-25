import { Response } from "../Applications/Response/Response"
import { BlogsViewType, BlogResponseType, BlogsResponseType, BlogInputType} from "../Applications/Types/Types"
import { CreateId } from "../Applications/Utils/CreateId"





export const dbBlogs: BlogsViewType = [
]


export const BlogRepos = {
    async GetBlogById (id: string): Promise<BlogResponseType> {
        try { // Catch error 
            const result = await dbBlogs.find(b => b.id === id) // Looking for element by id

            if (result) { // If element found then sending element 
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

    async GetAllBlogs (): Promise<BlogsResponseType> {
        try { // Catch error
            if (dbBlogs.length < 1) { // If array has 0 elements sending 404 error
                return Response.E404
            } // Else return all the elements 
            
            return {
                status: 200,
                message: "OK",
                elements: dbBlogs
            }
        } catch (e) { // If process has error sending error
            return Response.E400
        }
    },

    async DellBlogById (id: string): Promise<BlogResponseType> {
        try { // Catch error
            const result = await dbBlogs.findIndex(b => b.id === id) // Looking for element`s index
            if (result !== -1) { // If result found element, delete element
                dbBlogs.splice(result, 1)
                return Response.S204
            } // Else return error 404

            return Response.E404
        } catch (e) { // If process has error sending error
            return Response.E400
        }
    },

    async UpdateBlogById (id: string, data: BlogInputType): Promise<BlogResponseType> {
        try { // Catch error
            const result = await dbBlogs.findIndex(b => b.id === id) // Looking for element`s index
            if (result !== -1) { // If result found element, update element
                // const UpdateElement = {
                //     ...dbBlogs[result],
                //     ...data
                // }
                dbBlogs[result] = {...dbBlogs[result], ...data}
                return Response.S204
            } // Else return error 404

            return Response.E404
        } catch (e) { // If process has error sending error
            return Response.E400
        }
    },

    async CreateBlog (data: BlogInputType) {
        try { // Catch error
            const CreateElement = { // Create New Element
                id: CreateId(),
                ...data
            }
            dbBlogs.push(CreateElement)
            return {
                status: 201,
                message: "Ok",
                elements: CreateElement
            }
        } catch(e) { // If process has error sending error
            return Response.E400
        }
    }
}