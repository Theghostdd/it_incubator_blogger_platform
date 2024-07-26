import {ResultDataWithPaginationType} from "../../../typings/basic-types"
import {BlogViewModelType, BlogViewMongoType} from "../../../features/blog/blog-types";


export const blogMapper = {
    mapBlogs (data: BlogViewMongoType[], pagesCount: number, pageNumber: number, pageSize: number, totalCount: number): ResultDataWithPaginationType<BlogViewModelType[] | []> {
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
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

    mapBlog (data: BlogViewMongoType): BlogViewModelType {
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
