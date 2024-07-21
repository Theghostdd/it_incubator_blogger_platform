import {CreatePaginationType, ResultDataWithPaginationType} from "../../../Applications/Types-Models/BasicTypes"
import {BlogViewModelType, BlogViewMongoType} from "../../../Applications/Types-Models/Blog/BlogTypes"



export const BlogMapper = {
    /* 
    * Document mapping and return of the blogging model with pagination.
    */
    async MapBlogs (data: BlogViewMongoType[], pagination: CreatePaginationType): Promise<ResultDataWithPaginationType<BlogViewModelType[]>> {
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
    * Maps the blog`s model view than return it.
    */
    async MapBlog (data: BlogViewMongoType): Promise<BlogViewModelType> {
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
