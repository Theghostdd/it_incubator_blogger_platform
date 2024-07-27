import {
    LikeChangeType,
    LikeStatusEnum,
    ResultNotificationEnum,
    ResultNotificationType
} from "../../typings/basic-types";
import {CommentInputModelType, LikeCreateViewType, LikeStatusType} from "./comment-types";
import {CommentRepositories} from "./comment-repositories";
import {CommentModel, LikeModel} from "../../Domain/Comment/Comment";
import {updateLikeState} from "../../internal/utils/states/like-states";


export class CommentService {

    constructor(
        protected commentRepositories: CommentRepositories,
        protected likeModel: typeof LikeModel,
    ) {}
    async updateCommentById (id: string, userId: string, data: CommentInputModelType): Promise<ResultNotificationType> {
        try {
            const comment: InstanceType<typeof CommentModel> | null = await this.commentRepositories.getCommentById(id)
            if (!comment) return {status: ResultNotificationEnum.NotFound}
            if (comment.commentatorInfo.userId !== userId) return {status: ResultNotificationEnum.Forbidden}

            comment.content = data.content
            await this.commentRepositories.save(comment)

            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async deleteCommentById (id: string, userId: string): Promise<ResultNotificationType> {
        try {
            const comment: InstanceType<typeof CommentModel> | null = await this.commentRepositories.getCommentById(id)
            if (!comment) return {status: ResultNotificationEnum.NotFound}
            if (comment.commentatorInfo.userId !== userId) return {status: ResultNotificationEnum.Forbidden}

            await this.commentRepositories.delete(comment)
            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async updateLikeStatusForCommentById (data: LikeStatusType, commentId: string, userId: string): Promise<ResultNotificationType> {
        try {
            const comment: InstanceType<typeof CommentModel> | null = await this.commentRepositories.getCommentById(commentId)
            if (!comment) return {status: ResultNotificationEnum.NotFound}

            const like: InstanceType<typeof LikeModel> | null = await this.commentRepositories.getLikeByCommentIdAndUserId(userId, commentId)
            if (!like) {
                const createLikeData: LikeCreateViewType = {
                    commentId: commentId,
                    postId: comment.postInfo.postId,
                    userId: userId,
                    status: data.likeStatus as LikeStatusEnum,
                    createdAt: new Date().toISOString(),
                    lastUpdateAt: new Date().toISOString()
                }

                await this.commentRepositories.saveLike(new this.likeModel(createLikeData))

                switch (data.likeStatus) {
                    case LikeStatusEnum.Like:
                        ++comment.likesInfo.likesCount
                        break;
                    case LikeStatusEnum.Dislike:
                        ++comment.likesInfo.dislikesCount
                        break;
                }

                await this.commentRepositories.save(comment)
                return {status: ResultNotificationEnum.Success}
            }

            const changeStatus: LikeChangeType = updateLikeState(data.likeStatus as LikeStatusEnum, like.status)
            comment.likesInfo.likesCount += changeStatus.newLikesCount
            comment.likesInfo.dislikesCount += changeStatus.newDislikesCount
            like.status = changeStatus.newStatus

            await this.commentRepositories.saveLike(like)
            await this.commentRepositories.save(comment)

            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}