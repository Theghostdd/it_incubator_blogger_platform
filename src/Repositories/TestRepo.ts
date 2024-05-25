import { Response } from "../Applications/Response/Response"
import { BlogResponseType } from "../Applications/Types/Types"
import { dbBlogs } from "./BlogRepo"
import { dbPosts } from "./PostRepo"


export const TestRepo = {
    async DellAllElements (): Promise<BlogResponseType> {
        try {
            dbBlogs.splice(0, dbBlogs.length)
            dbPosts.splice(0, dbPosts.length)
            return Response.S204
        } catch (e) {
            return Response.E400
        }
    }
}