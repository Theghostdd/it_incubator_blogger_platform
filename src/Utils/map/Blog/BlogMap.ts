import { CreatePaginationType, CreatedMongoSuccessType } from "../../../Applications/Types-Models/BasicTypes"
import { BlogCreateInputModelType, BlogViewModelType, BlogViewMongoModelType, BlogsViewModelType } from "../../../Applications/Types-Models/Blog/BlogTypes"



export const BlogMapper = {
    async mapBlogs (data: BlogViewMongoModelType[], pagination: CreatePaginationType): Promise<BlogsViewModelType> {
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
    
    async mapBlog (data: BlogCreateInputModelType | BlogViewMongoModelType, mongoSuc: CreatedMongoSuccessType | null): Promise<BlogViewModelType> {
        return {
            id: mongoSuc ? mongoSuc.insertedId.toString() : ('_id' in data ? data._id.toString() : (() => { throw new Error('ID Not transmitted') })()),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: data.createdAt,
            isMembership: data.isMembership
        }
    },
}
