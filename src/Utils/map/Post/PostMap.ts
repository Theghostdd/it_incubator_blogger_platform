import { CreatePaginationType } from "../../../Applications/Types-Models/BasicTypes"
import { PostViewModelType, PostViewMongoModelType, PostsViewModelType } from "../../../Applications/Types-Models/Post/PostTypes"



export const PostMapper = {
    /* 
    * - Mapping posts data for returning array posts to client
    * Note: This function returning all post`s item with pagination`.
    */
    async mapPosts (data: PostViewMongoModelType[], pagination: CreatePaginationType): Promise<PostsViewModelType> {
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
    * - Mapping post`s data for returning to client
    * Note: This function returning one post`.
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
    /* 
    * - Mapping post`s data for returning to client
    * Note: This function returning created post`.
    */
    async MapCreatePost (data: PostViewMongoModelType): Promise<PostViewModelType> {
        return {
            id: data._id.toString(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: data.blogName,
            createdAt: data.createdAt
        }
    }
}