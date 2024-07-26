import {
    QueryParamsType,
    ResultDataWithPaginationType
} from "../../Applications/Types-Models/BasicTypes";
import {CommentModel} from "../../Domain/Comment/Comment";
import {CommentViewModelType} from "./comment-types";
import {commentMap} from "../../internal/utils/map/commentMap";
import {BlogQueryParamsType} from "../blog/blog-types";
import {defaultQueryValues} from "../../internal/utils/default-values/default-query-values";


export class CommentQueryRepositories {
    constructor(
        protected commentModel: typeof CommentModel
    ) {
    }
    async getAllComments (query: QueryParamsType, postId: string): Promise<ResultDataWithPaginationType<CommentViewModelType[]>> {
        try {

            const {sortBy, sortDirection, pageSize, pageNumber}: QueryParamsType<BlogQueryParamsType> = defaultQueryValues.defaultQueryValue(query)

            const sort = {
                [sortBy!]: sortDirection!
            }
            const filter = {
                postInfo: {postId: postId ? postId : {$ne: ''}}
            }

            const getTotalDocument: number = await this.commentModel.countDocuments(filter).lean()
            const totalCount = +getTotalDocument;
            const pagesCount = Math.ceil(totalCount / pageSize!);
            const skip = (pageNumber! - 1) * pageSize!;

            const result = await CommentModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(pageSize!)

            return await commentMap.mapComments(result, pagesCount, pageNumber!, pageSize!, totalCount)
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async getCommentById (id: string): Promise<CommentViewModelType| null> {
        try {
            const result = await this.commentModel.findById(id).lean()
            return result ? await commentMap.mapComment(result) : null
        } catch (e: any) {
            throw new Error(e)
        }
    }
}