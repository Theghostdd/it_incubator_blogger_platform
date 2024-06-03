import { Response } from "../../Applications/Utils/Response"
import { db } from "../../Applications/ConnectionDB/Connection"
import { SETTINGS } from "../../settings"
import { BlogResponseType, BlogInputType, BlogsResponseType } from './BlogTypes'
import { ObjectId } from "mongodb"
import fs from 'fs'

export const BlogRepos = {
    async GetBlogById (id: string): Promise<BlogResponseType> {
        try { // Catch error 
            const result  = await db.collection(SETTINGS.MONGO.COLLECTIONS.blogs).findOne({
                _id: new ObjectId(id)
            }) // Looking for element by id
            if (result) { // If element found then sending element 
                const {_id, ...rest} = result
                return {
                    status: 200,
                    message: "OK",
                    elements: {
                        id: _id.toString(),
                        name: rest.name,
                        description: rest.description,
                        websiteUrl:	rest.websiteUrl,
                        createdAt: rest.createdAt,
                        isMembership: rest.isMembership
                    }
                }
            } // Else sending error 404
            return Response.E404

        } catch (e: any) { // If process has error sending error
            fs.appendFileSync('log.txt', `Get blog by id error: ${new Date().toISOString()} - ${e.toString()}\n`);
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
        } catch (e: any) { // If process has error sending error
            fs.appendFileSync('log.txt', `Get all blogs error: ${new Date().toISOString()} - ${e.toString()}\n`);
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
        } catch (e: any) { // If process has error sending error
            fs.appendFileSync('log.txt', `Delete blog error: ${new Date().toISOString()} - ${e.toString()}\n`);
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
        } catch (e: any) { // If process has error sending error
            fs.appendFileSync('log.txt', `Update blog error: ${new Date().toISOString()} - ${e.toString()}\n`);
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
        } catch (e: any) { // Else sending error 400
            fs.appendFileSync('log.txt', `Create blog error: ${new Date().toISOString()} - ${e.toString()}\n`);
            return Response.E400
        }
    }
}