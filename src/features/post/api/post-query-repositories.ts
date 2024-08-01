import {
    QueryParamsType,
    ResultDataWithPaginationType
} from "../../../typings/basic-types";
import {defaultQueryValues} from "../../../internal/utils/default-values/default-query-values";
import {inject, injectable} from "inversify";
import {PostViewModel} from "./view-models/dto";
import {IPostInstanceMethod, PostModel} from "../domain/entity";
import {HydratedDocument} from "mongoose";
import {PostDto} from "../domain/dto";

@injectable()
export class PostQueryRepository {

    constructor(
        @inject(PostModel) private postModel: typeof PostModel
    ) {
    }

    async getAllPost(query: QueryParamsType, blogId?: string): Promise<ResultDataWithPaginationType<PostViewModel[] | []>> {

        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        }: QueryParamsType = defaultQueryValues.defaultQueryValue(query)

        const sort = {
            [sortBy!]: sortDirection!
        }
        const filter = {
            blogId: blogId ? blogId : {$ne: ''}
        }

        const getTotalDocument: number = await this.postModel.countDocuments(filter)
        const totalCount: number = +getTotalDocument
        const pagesCount: number = Math.ceil(totalCount / pageSize!)
        const skip: number = (pageNumber! - 1) * pageSize!


        const result: HydratedDocument<PostDto, IPostInstanceMethod>[] | [] = await this.postModel
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageSize!)

        return {
            pagesCount: +pagesCount,
                page: +pageNumber!,
                pageSize: +pageSize!,
                totalCount: +totalCount,
                items: result.map((item: HydratedDocument<PostDto, IPostInstanceMethod>) => {
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

    }

    async getPostById(id: string): Promise<PostViewModel | null> {
        const result: HydratedDocument<PostDto, IPostInstanceMethod> | null = await this.postModel.findById(id)
        return result ? {
            id: result._id.toString(),
            title: result.title,
            shortDescription: result.shortDescription,
            content: result.content,
            blogId: result.blogId,
            blogName: result.blogName,
            createdAt: result.createdAt
        } : null
    }

}