import {
    QueryParamsType,
    ResultDataWithPaginationType
} from "../../typings/basic-types";

import {BlogModel} from "../../Domain/Blog/Blog";
import {defaultQueryValues} from "../../internal/utils/default-values/default-query-values";
import {blogMapper} from "../../internal/utils/map/blogMap";
import {BlogQueryParamsType, BlogViewModelType, BlogViewMongoType} from "./blog-types";


export class BlogQueryRepositories {
    constructor(
        protected blogModel: typeof BlogModel
    ) {}

    async getAllBlogs (query: QueryParamsType<BlogQueryParamsType>): Promise<ResultDataWithPaginationType<BlogViewModelType[] | []>> {
        try {
            const {sortBy, sortDirection, searchNameTerm, pageSize, pageNumber}: QueryParamsType<BlogQueryParamsType> = defaultQueryValues.defaultQueryBlogValues(query)

            const sort = {[sortBy!]: sortDirection!}
            const filter = {name: {$regex: searchNameTerm, $options: 'i'}}

            const getTotalDocument: number = await this.blogModel.countDocuments(filter).lean()

            const totalCount = +getTotalDocument;
            const pagesCount = Math.ceil(totalCount / pageSize!);
            const skip = (pageNumber! - 1) * pageSize!;



            const result: BlogViewMongoType[] | [] = await BlogModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(pageSize!)
                .lean()

            return blogMapper.mapBlogs(result, pagesCount, pageNumber!, pageSize!, totalCount)
        } catch (e: any) {
            throw new Error(e)
        }
    }


    async getBlogById (id: string): Promise<BlogViewModelType | null> {
        try {
            const result: BlogViewMongoType | null= await this.blogModel.findById(id).lean()
            return result ? blogMapper.mapBlog(result) : null
        } catch (e: any) {
            throw new Error(e)
        }
    }
}