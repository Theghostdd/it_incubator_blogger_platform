import {Request, Response} from "express";
import {ROUTERS_SETTINGS} from "../../settings";
import {ResultNotificationEnum, ResultNotificationType} from "../../typings/basic-types";
import {CommentInputModelType, CommentViewModelType, LikeStatusType} from "./comment-types";
import {saveError} from "../../internal/utils/error-utils/save-error";
import {CommentQueryRepositories} from "./comment-query-repositories";
import {CommentService} from "./comment-service";


export class CommentController {
    constructor(
        protected commentService: CommentService,
        protected commentQueryRepositories: CommentQueryRepositories
    ) {}

    async getCommentById(req: Request<{id: string}>, res: Response<CommentViewModelType>) {
        try {
            const result: CommentViewModelType | null = await this.commentQueryRepositories.getCommentById(req.params.id, "66a3e960bb6a7b6cd13a6548")
            return result ? res.status(200).json(result) : res.sendStatus(404)
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.COMMENTS.comments}/:id`, 'GET', 'Get comment by ID', e)
            return res.sendStatus(500)
        }
    }

    async updateCommentById (req: Request<{id: string}, {}, CommentInputModelType>, res: Response) {
        try {
            const result: ResultNotificationType = await this.commentService.updateCommentById(req.params.id, req.user.userId, req.body)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    return res.sendStatus(204);
                case ResultNotificationEnum.NotFound:
                    return res.sendStatus(404);
                case ResultNotificationEnum.Forbidden:
                    return res.sendStatus(403)
                default: return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.COMMENTS.comments}/:id`, 'PUT', 'Update comment by ID', e)
            return res.sendStatus(500)
        }
    }

    async deleteCommentById (req: Request<{id: string}>, res: Response) {
        try {
            const result: ResultNotificationType = await this.commentService.deleteCommentById(req.params.id, req.user.userId)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    return res.sendStatus(204);
                case ResultNotificationEnum.NotFound:
                    return res.sendStatus(404);
                case ResultNotificationEnum.Forbidden:
                    return res.sendStatus(403)
                default: return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.COMMENTS.comments}/:id`, 'DELETE', 'Delete comment by ID', e)
            return res.sendStatus(500)
        }
    }

    async updateCommentLikeStatusById (req: Request<{id: string}, {}, LikeStatusType>, res: Response) {
        try {
            const result: ResultNotificationType = await this.commentService.updateLikeStatusForCommentById(req.body, req.params.id, req.user.userId)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    return res.sendStatus(204);
                case ResultNotificationEnum.NotFound:
                    return res.sendStatus(404)
                default: return res.sendStatus(500)
            }
        } catch (e: any) {
            await saveError(`${ROUTERS_SETTINGS.COMMENTS.comments}/:id${ROUTERS_SETTINGS.COMMENTS.like_status}`, 'Update', 'Update comment`s like status', e)
            return res.sendStatus(500)
        }
    }
}