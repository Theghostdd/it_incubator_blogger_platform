import { ObjectId, Sort } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { BlogQueryRequestType, BlogResponseType, BlogsResponseType } from "../../Applications/Types/BlogsTypes/BlogTypes"
import { Response } from "../../Applications/Utils/Response"
import { SETTINGS } from "../../settings"
import { SaveError } from "../../Service/ErrorService/ErrorService"
import { BlogService } from "../../Service/BlogService"
import { PaginationType } from "../../Applications/Types/Types"


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

    async GetAllBlogs (query: BlogQueryRequestType): Promise<BlogsResponseType> {
        try {

            const sortBy = query.sortBy
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1
            const sort: Sort = sortBy ? { [sortBy]: sortDirection } : {};
            
            const searchNameTerm = query.searchNameTerm ? query.searchNameTerm : ''
            const filter = {
                name: {$regex: searchNameTerm}
            }

            const createPagination: PaginationType = await BlogService.CreatePagination(+query.pageNumber!, +query.pageSize!, filter)
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.blogs)
                .find(filter)
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
                        items: result.map((el) => {
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
            }
            return Response.E404
        } catch (e: any) { 
            SaveError(SETTINGS.PATH.BLOG, 'GET', 'Getting all the blog items', e)
            return Response.E400
        }
    },

    async GetAllCountElements (filter: Object): Promise<number> {
        try {
            const result = await db.collection(SETTINGS.MONGO.COLLECTIONS.blogs).countDocuments(filter)
            return result
        } catch (e: any) {
            throw new Error(e)
        }
    }
}