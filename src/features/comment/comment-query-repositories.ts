import {
    LikeStatusEnum,
    QueryParamsType,
    ResultDataWithPaginationType
} from "../../typings/basic-types";
import {CommentModel, LikeModel} from "../../Domain/Comment/Comment";
import {CommentDtoViewType, CommentMongoViewType, CommentViewModelType, LikeMongoViewType} from "./comment-types";
import {commentMap} from "../../internal/utils/map/commentMap";
import {BlogQueryParamsType} from "../blog/blog-types";
import {defaultQueryValues} from "../../internal/utils/default-values/default-query-values";
import {ObjectId} from "mongodb";


export class CommentQueryRepositories {
    constructor(
        protected commentModel: typeof CommentModel,
        protected likeModel: typeof LikeModel
    ) {
    }

    async getAllComments(query: QueryParamsType, postId: string, userId?: string): Promise<ResultDataWithPaginationType<CommentViewModelType[] | []>> {
        const {
            sortBy,
            sortDirection,
            pageSize,
            pageNumber
        }: QueryParamsType<BlogQueryParamsType> = defaultQueryValues.defaultQueryValue(query)

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


        const comments: CommentMongoViewType[] = await this.commentModel
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageSize!)
            .lean()

        let likes: LikeMongoViewType[] | null = []
        if (userId) {
            const commentsIds: ObjectId[] = comments.map(id => id._id)
            likes = await this.likeModel
                .find({userId: userId, commentId: {$in: commentsIds}})
                .lean()
        }


        // comments.map((comment): CommentViewModelType => {
        //     const currentLikes = likes.filter((like) => like.commentId === comment._id.toString())
        //     return {
        //         ...comment,
        //         likesInfo: {
        //             myStatus: currentLikes.find((cl) => cl.userId === userId ? cl.status : 'None'
        //         }
        //     }
        // })
        //
        // const likesStorage = new Map()
        // likes.forEach((item: LikeMongoViewType) => likesStorage.set(item.commentId, item.status))
        // const commentsDto: CommentDtoViewType[] = comments.map((item: CommentMongoViewType) => {
        //     return {
        //         ...item,
        //         statusUserLike: likesStorage.get(item._id.toString()) || LikeStatusEnum.None
        //     }
        // })


        return commentMap.mapComments(comments, likes || [], pagesCount, pageNumber!, pageSize!, totalCount)
    }

    async getCommentById(id: string, userId: string): Promise<CommentViewModelType | null> {
        try {
            let like: LikeMongoViewType | null = null;
            if (userId) like = await this.likeModel.findOne({userId: userId, commentId: id}).lean()

            const result: CommentMongoViewType | null = await this.commentModel.findById(id).lean()
            return result ? commentMap.mapComment(result, !like ? LikeStatusEnum.None : like.status) : null
        } catch (e: any) {
            throw new Error(e)
        }
    }
}