import {
    BlogQueryParamsType,
    QueryParamsType,
    ResultDataWithPaginationType
} from "../../../typings/basic-types";

import {defaultQueryValues} from "../../../internal/utils/default-values/default-query-values";
import {BlogModel} from "../domain/entity";
import {inject, injectable} from "inversify";
import {BlogViewModelDto} from "./view-models/dto";
import {BlogDto} from "../domain/dto";
import {IBlogInstanceMethod} from "../domain/interfaces";
import {HydratedDocument} from "mongoose";

@injectable()
export class BlogQueryRepositories {
    constructor(
        @inject(BlogModel) protected blogModel: typeof BlogModel
    ) {}

    async getAllBlogs(query: QueryParamsType<BlogQueryParamsType>): Promise<ResultDataWithPaginationType<BlogViewModelDto[] | []>> {
        const {
            sortBy,
            sortDirection,
            searchNameTerm,
            pageSize,
            pageNumber
        }: QueryParamsType<BlogQueryParamsType> = defaultQueryValues.defaultQueryBlogValues(query)

        const sort = {[sortBy!]: sortDirection!}
        const filter = {name: {$regex: searchNameTerm, $options: 'i'}}

        const getTotalDocument: number = await this.blogModel.countDocuments(filter).lean()

        const totalCount: number = +getTotalDocument;
        const pagesCount: number = Math.ceil(totalCount / pageSize!);
        const skip: number = (+pageNumber! - 1) * pageSize!;


        const result: HydratedDocument<BlogDto, IBlogInstanceMethod>[]| [] = await this.blogModel
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageSize!)

        return {
            pagesCount: +pagesCount,
            page: +pageNumber!,
            pageSize: +pageSize!,
            totalCount: +totalCount,
            items: result.map((item: HydratedDocument<BlogDto, IBlogInstanceMethod>) => {
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
    }


    async getBlogById(id: string): Promise<BlogViewModelDto | null> {
        const result: HydratedDocument<BlogDto, IBlogInstanceMethod> | null = await this.blogModel.findById(id)

        return result ? {
            id: result._id.toString(),
            name: result.name,
            description: result.description,
            websiteUrl: result.websiteUrl,
            createdAt: result.createdAt,
            isMembership: result.isMembership
        } : null
    }
}