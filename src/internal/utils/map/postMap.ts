import {ResultDataWithPaginationType} from "../../../Applications/Types-Models/BasicTypes"
import {PostViewModelType, PostViewMongoModelType} from "../../../features/post/post-types";

export const postMapper = {
    mapPosts (data: PostViewMongoModelType[], pagesCount: number, page: number, pageSize: number, totalCount: number): ResultDataWithPaginationType<PostViewModelType[]> {
        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: pageSize,
            totalCount: totalCount,
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

    mapPost (data: PostViewMongoModelType): PostViewModelType {
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