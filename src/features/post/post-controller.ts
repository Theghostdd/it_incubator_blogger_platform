import {PostInputModelType, PostViewModelType} from "./post-types";
import {
    QueryParamsType, ResultDataWithPaginationType,
    ResultNotificationEnum,
    ResultNotificationType
} from "../../typings/basic-types";
import {ROUTERS_SETTINGS} from "../../settings";
import {saveError} from "../../internal/utils/error-utils/save-error";
import {Response, Request} from "express";
import {CommentInputModelType, CommentViewModelType} from "../comment/comment-types";
import {PostService} from "./post-service";
import {PostQueryRepository} from "./post-query-repositories";
import {CommentQueryRepositories} from "../comment/comment-query-repositories";


export class PostController {
    constructor(
        protected postService: PostService,
        protected postQueryRepositories: PostQueryRepository,
        protected commentQueryRepositories: CommentQueryRepositories
    ) {}

    async getPosts (req: Request<{},{},{},QueryParamsType>, res: Response<ResultDataWithPaginationType<PostViewModelType[]>>) {
        try {
            const result: ResultDataWithPaginationType<PostViewModelType[]> = await this.postQueryRepositories.getAllPost(req.query)
            return res.status(200).json(result)
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.POST.post}/`, 'GET', 'GET all a post items', e)
            return res.sendStatus(500)
        }
    }

    async getPostById (req: Request<{id: string}>, res: Response<PostViewModelType>) {
        try {
            const result: PostViewModelType | null = await this.postQueryRepositories.getPostById(req.params.id)
            return result ? res.status(200).json(result) : res.sendStatus(404)
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.POST.post}/:id`, 'GET', 'GET the post item by ID', e)
            return res.sendStatus(500)
        }
    }

    async createPost(req: Request<{}, {}, PostInputModelType>, res: Response<PostViewModelType>) {
        try {
            const result: ResultNotificationType<PostViewModelType> = await this.postService.createPostItemByBlogId(req.body)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    return res.status(201).json(result.data);
                case ResultNotificationEnum.NotFound:
                    return res.sendStatus(404);
                default: return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.POST.post}/`, 'POST', 'Create the post by blog`s ID', e)
            return res.sendStatus(500)
        }
    }

    async updatePostById(req: Request<{id: string}, {}, PostInputModelType>, res: Response) {
        try {
            const result: ResultNotificationType = await this.postService.updatePostById(req.params.id, req.body)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    return res.sendStatus(204);
                case ResultNotificationEnum.NotFound:
                    return res.sendStatus(404);
                default: return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.POST.post}/:id`, 'PUT', 'Update the post by ID', e)
            return res.sendStatus(500)
        }
    }

    async deletePostById(req: Request<{id: string}>, res: Response) {
        try {
            const result: ResultNotificationType = await this.postService.deletePostById(req.params.id)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    return res.sendStatus(204);
                case ResultNotificationEnum.NotFound:
                    return res.sendStatus(404);
                default: return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.POST.post}/:id`, 'DELETE', 'Delete the post by ID', e)
            return res.sendStatus(500)
        }
    }

    async createCommentByPostId (req: Request<{id: string}, {}, CommentInputModelType>, res: Response<CommentViewModelType>) {
        try {
            const result: ResultNotificationType<CommentViewModelType> = await this.postService.createCommentByPostId(req.body, req.params.id, req.user.userId)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    return res.status(201).json(result.data);
                case ResultNotificationEnum.NotFound:
                    return res.sendStatus(404);
                default: return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.POST.post}/:id${ROUTERS_SETTINGS.POST.comments}`, 'POST', 'Create comment by post ID', e)
            return res.sendStatus(500)
        }
    }

    async getCommentsByPostId(req: Request<{id: string}, {}, {}, QueryParamsType>, res: Response<ResultDataWithPaginationType<CommentViewModelType[]>>) {
        try {
            const result:ResultDataWithPaginationType<CommentViewModelType[]> = await this.commentQueryRepositories.getAllComments(req.query, req.params.id, req.user.userId)
            return result.items.length > 0 ? res.status(200).json(result) : res.sendStatus(404)
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.POST.post}/:id${ROUTERS_SETTINGS.POST.comments}`, 'GET', 'Get all comments by post ID', e)
            return res.sendStatus(500)
        }
    }
}