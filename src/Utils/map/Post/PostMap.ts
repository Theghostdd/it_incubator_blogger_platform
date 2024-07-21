import {CreatePaginationType, ResultDataWithPaginationType} from "../../../Applications/Types-Models/BasicTypes"
import { PostViewModelType, PostViewMongoModelType } from "../../../Applications/Types-Models/Post/PostTypes"



export const PostMapper = {
    /* 
    * Mapping posts data for returning post model.
    */
    async mapPosts (data: PostViewMongoModelType[], pagination: CreatePaginationType): Promise<ResultDataWithPaginationType<PostViewModelType[]>> {
        return {
            pagesCount: pagination.pagesCount,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalCount: pagination.totalCount,
            items: data.map((item) => {
                return {
                    id: item._id.toString(),
                    title: item.title,
                    shortDescription: item.shortDescription,
                    content: item.content,
                    blogId: item.blogId,
                    blogName: item.blogName,
                    createdAt: item.createdAt
                }
            })

        }
    },
    /* 
    * Mapping post data for returning post model.
    */
    async MapPost (data: PostViewMongoModelType): Promise<PostViewModelType> {
        return {
            id: data._id.toString(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: data.blogName,
            createdAt: data.createdAt
        }
    },
}