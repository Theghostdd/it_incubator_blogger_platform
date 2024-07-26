import {ResultNotificationEnum, ResultNotificationType} from "../../typings/basic-types";
import {CommentInputModelType} from "./comment-types";
import {CommentRepositories} from "./comment-repositories";
import {CommentModel} from "../../Domain/Comment/Comment";


export class CommentService {

    constructor(
        protected commentRepositories: CommentRepositories
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
}