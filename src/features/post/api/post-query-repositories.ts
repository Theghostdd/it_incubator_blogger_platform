import {
    LikeStatusEnum,
    QueryParamsType,
    ResultDataWithPaginationType
} from "../../../typings/basic-types";
import {defaultQueryValues} from "../../../internal/utils/default-values/default-query-values";
import {inject, injectable} from "inversify";
import {NewestLikesDto, PostViewModel} from "./view-models/dto";
import {PostModel} from "../domain/entity";
import {HydratedDocument} from "mongoose";
import {PostDto} from "../domain/dto";
import {IPostInstanceMethod} from "../domain/interfaces";
import {LikeDto} from "../../likes/domain/dto";
import {ILikesInstanceMethods} from "../../likes/domain/interfaces";
import { LikeModel } from "../../likes/domain/entity";
import {UserModel} from "../../auth-registration/domain/user-entity";
import {ObjectId} from "mongodb";
import {UserDto} from "../../auth-registration/domain/dto";
import {IUserInstanceMethods} from "../../auth-registration/domain/interfaces";

@injectable()
export class PostQueryRepository {

    constructor(
        @inject(PostModel) private postModel: typeof PostModel,
        @inject(LikeModel) private likeModel: typeof LikeModel,
        @inject(UserModel) private userModel: typeof UserModel
    ) {
    }

    async getAllPost(query: QueryParamsType, blogId?: string, userId?: string): Promise<ResultDataWithPaginationType<PostViewModel[] | []>> {
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


        let likes: HydratedDocument<LikeDto, ILikesInstanceMethods>[] | [] = []
        const postIds: ObjectId[] = result.map(id => id._id)
        if (userId) {
            likes = await this.likeModel
                .find({userId: userId, parentId: {$in: postIds}})
        }

        let newestLikes: NewestLikesDto[] | [] = []


        // TODO: Нужно сделать получние последних 3 лайков для каждого поста
        // const lastLike: HydratedDocument<LikeDto, ILikesInstanceMethods>[] | null = await this.likeModel
        //     .find({parentId: id})
        //     .sort({ lastUpdateAt: -1 })
        //     .limit(3)

        if (lastLike.length > 0) {
            const userIds: string[] = lastLike.map((like: HydratedDocument<LikeDto, ILikesInstanceMethods>) => like.userId)
            const users: HydratedDocument<UserDto, IUserInstanceMethods>[] = await this.userModel.find({_id: {$in: userIds}})

            newestLikes = lastLike.map((item: HydratedDocument<LikeDto, ILikesInstanceMethods>) => {
                const user: HydratedDocument<UserDto, IUserInstanceMethods> = users.find(u => u._id.toString() === item.userId)!
                return {
                    addedAt: item.lastUpdateAt,
                    userId: user._id.toString(),
                    login: user.login
                }
            })
        }




        return {
            pagesCount: +pagesCount,
                page: +pageNumber!,
                pageSize: +pageSize!,
                totalCount: +totalCount,
                items: result.map((item: HydratedDocument<PostDto, IPostInstanceMethod>) => {
                    const foundLike = likes.find(like => like.parentId === item._id.toString());
                    const myStatus: LikeStatusEnum = foundLike ? foundLike.status : LikeStatusEnum.None;
                    return {
                        id: item._id.toString(),
                        title: item.title,
                        shortDescription: item.shortDescription,
                        content: item.content,
                        blogId: item.blogId,
                        blogName: item.blogName,
                        createdAt: item.createdAt,
                        extendedLikesInfo: {
                            likesCount: item.extendedLikesInfo.likesCount,
                            dislikesCount: item.extendedLikesInfo.dislikesCount,
                            myStatus: myStatus,
                            newestLikes: newestLikes
                        }
                    }
                })

        }

    }

    async getPostById(id: string, userId?: string): Promise<PostViewModel | null> {
        const result: HydratedDocument<PostDto, IPostInstanceMethod> | null = await this.postModel.findById(id)
        if (!result) return null


        let like: HydratedDocument<LikeDto, ILikesInstanceMethods> | null = null;
        if (userId) like = await this.likeModel.findOne({userId: userId, parentId: id})

        const lastLike: HydratedDocument<LikeDto, ILikesInstanceMethods>[] | null = await this.likeModel
            .find({parentId: id})
            .sort({ lastUpdateAt: -1 })
            .limit(3)


        let newestLikes: NewestLikesDto[] | [] = []
        if (lastLike.length > 0) {
            const userIds: string[] = lastLike.map((like: HydratedDocument<LikeDto, ILikesInstanceMethods>) => like.userId)
            const users: HydratedDocument<UserDto, IUserInstanceMethods>[] = await this.userModel.find({_id: {$in: userIds}})

            newestLikes = lastLike.map((item: HydratedDocument<LikeDto, ILikesInstanceMethods>) => {
                const user: HydratedDocument<UserDto, IUserInstanceMethods> = users.find(u => u._id.toString() === item.userId)!
                return {
                    addedAt: item.lastUpdateAt,
                    userId: user._id.toString(),
                    login: user.login
                }
            })
        }

        return {
            id: result._id.toString(),
            title: result.title,
            shortDescription: result.shortDescription,
            content: result.content,
            blogId: result.blogId,
            blogName: result.blogName,
            createdAt: result.createdAt,
            extendedLikesInfo: {
                likesCount: result.extendedLikesInfo.likesCount,
                dislikesCount: result.extendedLikesInfo.dislikesCount,
                myStatus: !like ? LikeStatusEnum.None : like.status,
                newestLikes: newestLikes
            }
        }
    }

}