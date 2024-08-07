import {Request, Response} from "express";
import {
    BlogQueryParamsType,
    QueryParamsType,
    ResultDataWithPaginationType, ResultNotificationEnum,
    ResultNotificationType
} from "../../../typings/basic-types";

import {ROUTERS_SETTINGS} from "../../../settings";
import {saveError} from "../../../internal/utils/error-utils/save-error";
import {BlogQueryRepositories} from "./blog-query-repositories";
import {BlogService} from "../application/blog-service";
import {PostService} from "../../post/application/post-service";
import {PostQueryRepository} from "../../post/api/post-query-repositories";
import {inject, injectable} from "inversify";
import {BlogViewModelDto} from "./view-models/dto";
import {CreateInputBlogDto, UpdateInputBlogDto} from "./input-models/dto";
import {PostInputModel} from "../../post/api/input-models/dto";
import {PostViewModel} from "../../post/api/view-models/dto";

@injectable()
export class BlogController {
    constructor(
        @inject(BlogQueryRepositories) private blogQueryRepositories: BlogQueryRepositories,
        @inject(BlogService) private blogService: BlogService,
        @inject(PostService) private postService: PostService,
        @inject(PostQueryRepository) private postQueryRepositories: PostQueryRepository,
    ) {}

    async getAllBlogs (req: Request<{}, {}, {}, QueryParamsType<BlogQueryParamsType>>, res: Response<ResultDataWithPaginationType<BlogViewModelDto[]>>) {
        try {
            const result: ResultDataWithPaginationType<BlogViewModelDto[]> = await this.blogQueryRepositories.getAllBlogs(req.query)
            return res.status(200).json(result)
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.BLOG.blogs}/`, 'GET', 'Get the all blog items', e)
            return res.sendStatus(500)
        }
    }

    async getBlogById(req: Request<{id: string}>, res: Response<BlogViewModelDto>) {
        try {

            const result: BlogViewModelDto | null = await this.blogQueryRepositories.getBlogById(req.params.id)
            return result ? res.status(200).json(result) : res.sendStatus(404)
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id`, 'GET', 'Get the blog item by ID', e)
            return res.sendStatus(500)
        }
    }

    async createBlog(req: Request<{}, {}, CreateInputBlogDto>, res: Response<BlogViewModelDto>) {
        try {
            const createResult: ResultNotificationType<string> = await this.blogService.createBlogItem(req.body)
            const result: BlogViewModelDto | null = await this.blogQueryRepositories.getBlogById(createResult.data)

            if (result) {
                return res.status(201).json(result)
            }

            return res.sendStatus(500)
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.BLOG.blogs}/`, 'POST', 'Create a blog item', e)
            return res.sendStatus(500)
        }
    }

    async updateBlogById(req: Request<{id: string}, {}, UpdateInputBlogDto>, res: Response) {
        try {
            const result: ResultNotificationType = await this.blogService.updateBlogById(req.params.id, req.body)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    return res.sendStatus(204);
                case ResultNotificationEnum.NotFound:
                    return res.sendStatus(404);
                default: return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id`, 'PUT', 'Update the blog item by ID', e)
            return res.sendStatus(500)
        }
    }

    async deleteBlogById(req: Request<{ id: string }>, res: Response) {
        try {
            const result: ResultNotificationType = await this.blogService.deleteBlogById(req.params.id)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    return res.sendStatus(204);
                case ResultNotificationEnum.NotFound:
                    return res.sendStatus(404);
                default:
                    return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id`, 'DELETE', 'Delete the blog item by ID', e)
            return res.sendStatus(500)
        }
    }

    async createPostByBlogId(req: Request<{id: string}, {}, PostInputModel>, res: Response<PostViewModel>) {
        try {
            req.body.blogId = req.params.id
            const result: ResultNotificationType<string | null> = await this.postService.createPostItemByBlogId(req.body)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    const post: PostViewModel | null = await this.postQueryRepositories.getPostById(result.data!)
                    return post ? res.status(201).json(post) : res.sendStatus(404)
                case ResultNotificationEnum.NotFound:
                    return res.sendStatus(404);
                default: return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 'POST', 'Create a post element by blog ID', e)
            return res.sendStatus(500)
        }
    }

    async getPostByBlogId(req: Request<{id: string}, {}, {}, QueryParamsType>, res: Response<ResultDataWithPaginationType<PostViewModel[] | []>>) {
        try {
            const result: ResultDataWithPaginationType<PostViewModel[] | []> = await this.postQueryRepositories.getAllPost(req.query, req.params.id, req.user.userId)
            return res.status(200).json(result)
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 'GET', 'Get all the post items by blog ID', e)
            return res.sendStatus(500)
        }
    }
}