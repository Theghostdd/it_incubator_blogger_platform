import {
    QueryParamsType,
    ResultDataWithPaginationType
} from "../../typings/basic-types";
import {PostModel} from "../../Domain/Post/Post";
import {PostViewModelType, PostViewMongoModelType} from "./post-types";
import {defaultQueryValues} from "../../internal/utils/default-values/default-query-values";
import {postMapper} from "../../internal/utils/map/postMap";


export class PostQueryRepository {

    constructor(
        protected postModel: typeof PostModel
    ) {
    }
    async getAllPost(query: QueryParamsType, blogId?: string): Promise<ResultDataWithPaginationType<PostViewModelType[] | []>> {
        try {
            const {pageNumber, pageSize, sortBy, sortDirection}: QueryParamsType = defaultQueryValues.defaultQueryValue(query)

            const sort = {
                [sortBy!]: sortDirection!
            }
            const filter = {
                blogId: blogId ? blogId : {$ne: ''}
            }

            const getTotalDocument: number = await this.postModel.countDocuments(filter)
            const totalCount = +getTotalDocument
            const pagesCount = Math.ceil(totalCount / pageSize!)
            const skip = (pageNumber! - 1) * pageSize!


            const result: PostViewMongoModelType[] | [] = await this.postModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(pageSize!)
                .lean()

            return postMapper.mapPosts(result, pagesCount, pageNumber!, pageSize!, totalCount)
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async getPostById(id: string): Promise<PostViewModelType | null> {
        try {
            const result: PostViewMongoModelType | null = await this.postModel.findById(id).lean()
            return result ? postMapper.mapPost(result) : null
        } catch (e: any) {
            throw new Error(e)
        }
    }

}