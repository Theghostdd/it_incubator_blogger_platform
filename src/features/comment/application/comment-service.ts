import {
    LikeStatusEnum,
    ResultNotificationEnum,
    ResultNotificationType
} from "../../../typings/basic-types";
import {CommentRepositories} from "../infrastucture/comment-repositories";
import {inject, injectable} from "inversify";
import {LikeModel} from "../../likes/domain/entity";
import {HydratedDocument} from "mongoose";
import {CommentDto} from "../domain/dto";
import {ICommentInstanceMethod} from "../domain/interfaces";
import {CommentUpdateInputModelDto} from "../api/input-models/dto";
import {LikeInputModelDto} from "../../likes/api/input-models/dto";
import {LikesRepositories} from "../../likes/infrastructure/likes-repositories";
import {LikeChangeCount, LikeDto} from "../../likes/domain/dto";
import {ILikesInstanceMethods} from "../../likes/domain/interfaces";

@injectable()
export class CommentService {

    constructor(
        @inject(CommentRepositories) private commentRepositories: CommentRepositories,
        @inject(LikesRepositories) private likesRepositories: LikesRepositories,
        @inject(LikeModel) private likeModel: typeof LikeModel,
    ) {}

    async updateCommentById(id: string, userId: string, commentUpdateDto: CommentUpdateInputModelDto): Promise<ResultNotificationType> {
        const comment: HydratedDocument<CommentDto, ICommentInstanceMethod> | null = await this.commentRepositories.getCommentById(id)
        if (!comment) return {status: ResultNotificationEnum.NotFound, data: null}
        if (comment.commentatorInfo.userId !== userId) return {status: ResultNotificationEnum.Forbidden, data: null}

        comment.updateInstance(commentUpdateDto)
        await this.commentRepositories.save(comment)

        return {status: ResultNotificationEnum.Success, data: null}

    }

    async deleteCommentById(id: string, userId: string): Promise<ResultNotificationType> {
        const comment: HydratedDocument<CommentDto, ICommentInstanceMethod> | null = await this.commentRepositories.getCommentById(id)
        if (!comment) return {status: ResultNotificationEnum.NotFound, data: null}
        if (comment.commentatorInfo.userId !== userId) return {status: ResultNotificationEnum.Forbidden, data: null}

        await this.commentRepositories.delete(comment)
        return {status: ResultNotificationEnum.Success, data: null}
    }

    async updateLikeStatusForCommentById(likeInputDto: LikeInputModelDto, commentId: string, userId: string): Promise<ResultNotificationType> {
        const comment: HydratedDocument<CommentDto, ICommentInstanceMethod> | null = await this.commentRepositories.getCommentById(commentId)
        if (!comment) return {status: ResultNotificationEnum.NotFound, data: null}

        const like: HydratedDocument<LikeDto, ILikesInstanceMethods> | null = await this.likesRepositories.getLikeByParentIdAndUserId(userId, commentId)
        if (!like) {
            const like: HydratedDocument<LikeDto, ILikesInstanceMethods> = this.likeModel.createInstance(likeInputDto, comment._id.toString(), userId)

            comment.updateLikesCount(0, 0, likeInputDto.likeStatus as LikeStatusEnum)

            await Promise.all([
                this.likesRepositories.save(like),
                this.commentRepositories.save(comment)
            ])

            return {status: ResultNotificationEnum.Success, data: null}
        }

        const changeCountLike: LikeChangeCount = like.changeCountLike(likeInputDto.likeStatus as LikeStatusEnum, like.status)
        like.updateLikeStatus(changeCountLike.newStatus)
        comment.updateLikesCount(changeCountLike.newLikesCount, changeCountLike.newDislikesCount)

        await Promise.all([
            this.likesRepositories.save(like),
            this.commentRepositories.save(comment)
        ])

        return {status: ResultNotificationEnum.Success, data: null}
    }
}