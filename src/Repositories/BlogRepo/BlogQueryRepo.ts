import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { BlogResponseType, BlogsResponseType } from "../../Applications/Types/BlogsTypes/BlogTypes"
import { Response } from "../../Applications/Utils/Response"
import { SETTINGS } from "../../settings"
import { SaveError } from "../../Service/ErrorService/ErrorService"


export const BlogQueryRepos = {

    async GetBlogById (id: string): Promise<BlogResponseType> {
        try { 
            const result  = await db.collection(SETTINGS.MONGO.COLLECTIONS.blogs).findOne({ _id: new ObjectId(id)}) 
            if (result) {
                const {_id, ...rest} = result
                return {
                    status: 200,
                    elements: {
                        id: _id.toString(),
                        name: rest.name,
                        description: rest.description,
                        websiteUrl:	rest.websiteUrl,
                        createdAt: rest.createdAt,
                        isMembership: rest.isMembership
                    }
                }
            }
            return Response.E404

        } catch (e: any) {
            SaveError(SETTINGS.PATH.BLOG, 'GET', 'Get a blog by ID', e)
            return Response.E500
        }
    },

    async GetAllBlogs (): Promise<BlogsResponseType> {
        try {
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.blogs).find().toArray()
            if (result.length > 0) {
                return {
                    status: 200,
                    elements: result.map((el) => {
                        return {
                            id: el._id.toString(),
                            name: el.name,
                            description: el.description,
                            websiteUrl:	el.websiteUrl,
                            createdAt: el.createdAt,
                            isMembership: el.isMembership
                        }
                    })
                }
            }
            return Response.E404
        } catch (e: any) { 
            SaveError(SETTINGS.PATH.BLOG, 'GET', 'Getting all the blog items', e)
            return Response.E400
        }
    },
}