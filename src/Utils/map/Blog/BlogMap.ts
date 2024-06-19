import { CreatePaginationType } from "../../../Applications/Types-Models/BasicTypes"
import { BlogViewModelType, BlogViewMongoModelType, BlogsViewModelType } from "../../../Applications/Types-Models/Blog/BlogTypes"



export const BlogMapper = {
    async MapBlogs (data: BlogViewMongoModelType[], pagination: CreatePaginationType): Promise<BlogsViewModelType> {
        return {
            pagesCount: pagination.pagesCount,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalCount: pagination.totalCount,
            items: data.map((item) => {
                return {
                    id: item._id.toString(),
                    name: item.name,
                    description: item.description,
                    websiteUrl: item.websiteUrl,
                    createdAt: item.createdAt,
                    isMembership: item.isMembership
                }
            })
    
        }
    },
    
    async MapBlog (data: BlogViewMongoModelType): Promise<BlogViewModelType> {
        return {
            id: data._id.toString(),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: data.createdAt,
            isMembership: data.isMembership
        }
    },

    async MapCreatedBlog (data: BlogViewMongoModelType): Promise<BlogViewModelType> {
        return {
            id: data._id.toString(),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: data.createdAt,
            isMembership: data.isMembership
        }
    },
}
