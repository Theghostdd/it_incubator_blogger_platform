import { Response } from '../../Applications/Utils/Response'
import { db } from "../../Applications/ConnectionDB/Connection";
import { SETTINGS } from "../../settings";
import { ObjectId } from "mongodb";
import { PostResponseType, PostsResponseType } from '../../Applications/Types/PostsTypes/PostTypes';
import { SaveError } from '../../Service/ErrorService/ErrorService';



export const PostQueryRepo = {
    async GetPostById (id: string): Promise<PostResponseType> {
        try { 
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.posts).findOne({
                _id: new ObjectId(id)
            })
            if (result) {
                const {_id, ...rest} = result
                return {
                    status: 200,
                    elements: {
                        id: _id.toString(),
                        title: rest.title,
                        shortDescription: rest.shortDescription,
                        content: rest.content,
                        blogId: rest.blogId,
                        blogName: rest.blogName,
                        createdAt: rest.createdAt
                    }
                }
            } 
            return Response.E404
        } catch (e: any) { 
            SaveError(SETTINGS.PATH.BLOG, 'GET', 'Get a post by ID', e)
            return Response.E500
        }
    },

    async GetAllPosts (): Promise<PostsResponseType> {
        try {
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.posts).find({}).toArray()
            if (result.length > 0) {
                return {
                    status: 200,
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
        } catch (e: any) {
            SaveError(SETTINGS.PATH.BLOG, 'GET', 'Getting all the blog items', e)
            return Response.E500
        }
    },
}