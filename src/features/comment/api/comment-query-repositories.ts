import {
    BlogQueryParamsType,
    LikeStatusEnum,
    QueryParamsType,
    ResultDataWithPaginationType
} from "../../../typings/basic-types";
import {defaultQueryValues} from "../../../internal/utils/default-values/default-query-values";
import {ObjectId} from "mongodb";
import {CommentViewModelDto} from "./view-models/dto";
import {CommentDto} from "../domain/dto";
import {HydratedDocument} from "mongoose";
import {ICommentInstanceMethod} from "../domain/interfaces";
import {LikeDto} from "../../likes/domain/dto";
import {ILikesInstanceMethods} from "../../likes/domain/interfaces";
import {inject, injectable} from "inversify";
import {CommentModel} from "../domain/entity";
import {LikeModel} from "../../likes/domain/entity";

@injectable()
export class CommentQueryRepositories {
    constructor(
        @inject(CommentModel) private commentModel: typeof CommentModel,
        @inject(LikeModel) private likeModel: typeof LikeModel
    ) {
    }

    async getAllComments(query: QueryParamsType, postId: string, userId?: string): Promise<ResultDataWithPaginationType<CommentViewModelDto[] | []>> {
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


        const comments: HydratedDocument<CommentDto, ICommentInstanceMethod>[] | [] = await this.commentModel
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageSize!)

        let likes: HydratedDocument<LikeDto, ILikesInstanceMethods>[] | [] = []

        if (userId) {
            const commentsIds: ObjectId[] = comments.map(id => id._id)
            likes = await this.likeModel
                .find({userId: userId, parentId: {$in: commentsIds}})
        }



        return {
            pagesCount: +pagesCount,
            page: +pageNumber!,
            pageSize: +pageSize!,
            totalCount: +totalCount,
            items: comments.map((item: HydratedDocument<CommentDto, ICommentInstanceMethod>) => {
                const foundLike = likes.find(like => like.parentId === item._id.toString());
                const myStatus: LikeStatusEnum = foundLike ? foundLike.status : LikeStatusEnum.None;
                return {
                    id: item._id.toString(),
                    content: item.content,
                    commentatorInfo: {
                        userId: item.commentatorInfo.userId,
                        userLogin: item.commentatorInfo.userLogin
                    },
                    likesInfo: {
                        likesCount: item.likesInfo.likesCount,
                        dislikesCount: item.likesInfo.dislikesCount,
                        myStatus: myStatus
                    },
                    createdAt: item.createdAt
                }
            })

        }

    }

    async getCommentById(id: string, userId?: string): Promise<CommentViewModelDto | null> {
        let like: HydratedDocument<LikeDto, ILikesInstanceMethods> | null = null;
        if (userId) like = await this.likeModel.findOne({userId: userId, parentId: id})

        const result: HydratedDocument<CommentDto, ICommentInstanceMethod> | null = await this.commentModel.findById(id)
        return result ? {
            id: result._id.toString(),
            content: result.content,
            commentatorInfo: {
                userId: result.commentatorInfo.userId,
                userLogin: result.commentatorInfo.userLogin
            },
            likesInfo: {
                likesCount: result.likesInfo.likesCount,
                dislikesCount: result.likesInfo.dislikesCount,
                myStatus: !like ? LikeStatusEnum.None : like.status
            },
            createdAt: result.createdAt,
        } : null
    }
}