import { Response } from "../../Applications/Utils/Response"
import { db } from "../../Applications/ConnectionDB/Connection"
import { SETTINGS } from "../../settings"
import { BlogResponseType, BlogViewType, BlogInputType, BlogsResponseType } from './BlogTypes'
import { ObjectId } from "mongodb"







export const BlogRepos = {
    async GetBlogById (id: string): Promise<BlogResponseType> {
        try { // Catch error 
            const result: any  = await db.collection(SETTINGS.MONGO.COLLECTIONS.blogs).findOne({
                _id: new ObjectId(id)
            }) // Looking for element by id
            if (result) { // If element found then sending element 
                const {_id, ...rest} = result
                const blogData: BlogViewType = {
                    id: _id.toString(),
                    ...rest
                }
                return {
                    status: 200,
                    message: "OK",
                    elements: blogData
                }
            } // Else sending error 404
            return Response.E404

        } catch (e) { // If process has error sending error
            return Response.E400
        }
    },

    async GetAllBlogs (): Promise<BlogsResponseType> {
        try {
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.blogs).find().toArray()
            if (result.length > 0) {
                return {
                    status: 200,
                    message: "OK",
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
        } catch (e) { // If process has error sending error
            return Response.E400
        }
    },

    async DellBlogById (id: string): Promise<BlogResponseType> {
        try { // Catch error
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.blogs).deleteOne({
                _id: new ObjectId(id)
            })
            
            if (result.deletedCount > 0) {
                return Response.S204
            }
            
            return Response.E404
        } catch (e) { // If process has error sending error
            console.log(e)
            return Response.E400
        }
    },

    async UpdateBlogById (id: string, data: BlogInputType): Promise<BlogResponseType> {
        try { // Catch error
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.blogs).updateOne({
                _id: new ObjectId(id)
            }, {
                $set: {...data}
            })

            if (result.matchedCount > 0) {
                if (result.modifiedCount > 0) {
                    return Response.S204
                }
                return Response.S202
            }
            
            return Response.E404
        } catch (e) { // If process has error sending error
            console.log(e)
            return Response.E400
        }
    },

    async CreateBlog (data: BlogInputType): Promise<BlogResponseType> {
        const DataBlog = { // Creating object to insert to db
            ...data,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        try { // Catch some error
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.blogs).insertOne({
                ...DataBlog
            })
            return {
                status: 201,
                message: "Ok",
                elements: {
                    id: result.insertedId.toString(),
                    ...DataBlog
                }
            }
        } catch (e) { // Else sending error 400
            return Response.E400
        }
    }
}