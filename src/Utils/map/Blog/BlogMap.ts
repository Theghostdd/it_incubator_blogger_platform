import { CreatePaginationType } from "../../../Applications/Types-Models/BasicTypes"
import { BlogViewModelType, BlogViewMongoModelType, BlogsViewModelType } from "../../../Applications/Types-Models/Blog/BlogTypes"



export const BlogMapper = {
    /* 
    * 1. Takes blogs and pagination data.
    * 2. Maps the blog`s models view for query repositories to return all blogs data with pagination.
    * 3. If blogs data have empty array then 'items' must be empty array.
    * 4. Returns a structured object.
    */
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
    /* 
    * 1. Takes blog data.
    * 2. Maps the blog`s model view for query repositories when getting blog by ID.
    * 3. Returns a structured object.
    */
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
    /* 
    * 1. Takes blog data.
    * 2. Maps the blog`s model view for service when creating new blog item.
    * 3. Returns a structured object.
    */
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
