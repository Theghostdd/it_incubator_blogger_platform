import { Response } from '../../Applications/Utils/Response'
import { db } from "../../Applications/ConnectionDB/Connection";
import { SETTINGS } from "../../settings";
import { ObjectId, Sort } from "mongodb";
import { PostFilterType, PostResponseType, PostsResponseType } from '../../Applications/Types/PostsTypes/PostTypes';
import { SaveError } from '../../Service/ErrorService/ErrorService';
import { PostService } from '../../Service/PostService';



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
            SaveError(SETTINGS.PATH.POST, 'GET', 'Get a post by ID', e)
            return Response.E500
        }
    },

    async GetAllPosts (query: any): Promise<PostsResponseType> {
        try {
            const sortBy = query.sortBy
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1
            const sort: Sort = sortBy ? { [sortBy]: sortDirection } : {};

            const createPagination = await PostService.CreatePagination(+query.pageNumber, +query.pageSize)
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.posts)
                .find()
                .sort(sort)
                .skip(createPagination.skip)
                .limit(createPagination.pageSize)
                .toArray()
            if (result.length > 0) {
                return {
                    status: 200,
                    elements: {
                        pagesCount: createPagination.pagesCount,
                        page: createPagination.page,
                        pageSize: createPagination.pageSize,
                        totalCount: createPagination.totalCount,
                        item: result.map((el) => {
                                return {
                                    id: el._id.toString(),
                                    title: el.title,
                                    shortDescription: el.shortDescription,
                                    content: el.content,
                                    blogId: el.blogId,
                                    blogName: el.blogName,
                                    createdAt: el.createdAt
                                }
                        }
                    )}
                }
            }
            return Response.E404
        } catch (e: any) {
            SaveError(SETTINGS.PATH.POST, 'GET', 'Getting all the blog items', e)
            return Response.E500
        }
    },

    async GetAllCountElements (): Promise<number> {
        try {
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.posts).countDocuments()
            return result
        } catch (e: any) {
            throw new Error(e)
        }
    }
}