import { PostResponseType, PostsResponseType, PostInputType, PostMongoType, PostsMongoType} from "./PostTypes";
import { Response } from '../../Applications/Utils/Response'
import { CreateId } from "../../Applications/Utils/CreateId";
import { BlogRepos } from "../BlogRepo/BlogRepo";
import { db } from "../../Applications/ConnectionDB/Connection";
import { SETTINGS } from "../../settings";
import { ObjectId } from "mongodb";


export const PostRepo = {
    async GetPostById (id: string): Promise<PostResponseType> {
        try { // Catch error
            const result: any = await db.collection(SETTINGS.MONGO.COLLECTIONS.posts).findOne({
                _id: new ObjectId(id)
            })
            if (result) { // If found element sending this element
                const {_id, ...rest} = result
                return {
                    status: 200,
                    message: "OK",
                    elements: {
                        id: _id.toString(),
                        ...rest
                    }
                }
            } // Else sending error 404
            return Response.E404
        } catch (e) { // If process has error sending error
            console.error(e)
            return Response.E400
        }
    },

    async GetAllPosts (): Promise<PostsResponseType> {
        try { // Catch error 
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.posts).find({}).toArray()
            if (result.length > 0) {
                return {
                    status: 200,
                    message: "Ok",
                    elements: result.map((el) => {
                        return {
                            id: el._id.toString(),
                            title: el.title,
                            shortDescription: el.shortDescription,
                            content: el.content,
                            blogId: el.blogId,
                            blogName: el.blogName,
                            createdAt: el.createdAt
                        }
                    })
                }
            }
            return Response.E404
        } catch (e) { // If process has error sending error
            return Response.E400
        }
    },

    async DellPostById (id: string): Promise<PostResponseType> {
        try { // Catch error
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.posts).deleteOne({
                _id: new ObjectId(id)
            })

            if (result.deletedCount > 0) {
                return Response.S204
            }
            return Response.E404
        } catch (e) { // If process has error sending error
            return Response.E400
        } 
    },

    async UpdatePostById (id: string, data: PostInputType ) {
        try { // Catch error
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.posts).updateOne({
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
            return Response.E400
        }
    },

    async CreatePost (data: PostInputType): Promise<PostResponseType> {
        try { // Catch error
            const getBlogById = await BlogRepos.GetBlogById(data.blogId) // Looking for Blog by ID

            if (getBlogById && getBlogById.elements && getBlogById.elements.name) { // If element found then create post
                const CreateElement = {
                    blogName: getBlogById.elements.name,
                    createdAt: new Date().toISOString(),
                    ...data
                }

                const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.posts).insertOne({
                    ...CreateElement
                })

                return {
                    status: 201,
                    message: "Ok",
                    elements: {
                        id: result.insertedId.toString(),
                        ...CreateElement
                    }
                }
            } // Else sending error 404
            return Response.E404
        } catch (e) { // If process has error sending error
            return Response.E400
        }
    }
}