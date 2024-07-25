import {Request, Response} from "express";
import {
    QueryParamsType,
    ResultDataWithPaginationType, ResultNotificationEnum,
    ResultNotificationType
} from "../../Applications/Types-Models/BasicTypes";

import {ROUTERS_SETTINGS} from "../../settings";

import {saveError} from "../../internal/utils/error-utils/save-error";
import {BlogQueryRepositories} from "./blog-query-repositories";
import {BlogService} from "./blog-service";
import {BlogInputModelType, BlogQueryParamsType, BlogViewModelType} from "./blog-types";
import {PostInputModelType, PostViewModelType} from "../post/post-types";
import {PostService} from "../post/post-service";
import {PostQueryRepository} from "../post/post-query-repositories";


export class BlogController {
    constructor(
        protected blogQueryRepositories: BlogQueryRepositories,
        protected blogService: BlogService,
        protected postService: PostService,
        protected postQueryRepositories: PostQueryRepository
    ) {}

    async getAllBlogs (req: Request<{}, {}, {}, QueryParamsType<BlogQueryParamsType>>, res: Response<ResultDataWithPaginationType<BlogViewModelType[]>>) {
        try {
            const result: ResultDataWithPaginationType<BlogViewModelType[]> = await this.blogQueryRepositories.getAllBlogs(req.query)
            return res.status(200).json(result)
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.BLOG.blogs}/`, 'GET', 'Get the all blog items', e)
            return res.sendStatus(500)
        }
    }

    async getBlogById(req: Request<{id: string}>, res: Response<BlogViewModelType>) {
        try {
            const result: BlogViewModelType | null = await this.blogQueryRepositories.getBlogById(req.params.id)
            return result ? res.status(200).json(result) : res.sendStatus(404)
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id`, 'GET', 'Get the blog item by ID', e)
            return res.sendStatus(500)
        }
    }

    async createBlog(req: Request<{}, {}, BlogInputModelType>, res: Response<BlogViewModelType>) {
        try {
            const result: ResultNotificationType<BlogViewModelType> = await this.blogService.createBlogItem(req.body)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    return res.status(201).json(result.data);
                default:
                    return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.BLOG.blogs}/`, 'POST', 'Create a blog item', e)
            return res.sendStatus(500)
        }
    }

    async updateBlogById(req: Request<{id: string}, {}, BlogInputModelType>, res: Response) {
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

    async createPostByBlogId(req: Request<{id: string}, {}, PostInputModelType>, res: Response<PostViewModelType>) {
        try {
            req.body.blogId = req.params.id
            const result: ResultNotificationType<PostViewModelType> = await this.postService.createPostItemByBlogId(req.body)
            switch (result.status) {
                case ResultNotificationEnum.Success:
                    return res.status(201).json(result.data);
                case ResultNotificationEnum.NotFound:
                    return res.sendStatus(404);
                default: return res.sendStatus(500)
            }
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 'POST', 'Create a post element by blog ID', e)
            return res.sendStatus(500)
        }
    }


    async getPostByBlogId(req: Request<{id: string}, {}, {}, QueryParamsType>, res: Response<ResultDataWithPaginationType<PostViewModelType[]>>) {
        try {
            const result: ResultDataWithPaginationType<PostViewModelType[]> = await this.postQueryRepositories.getAllPost(req.query, req.params.id)
            return res.status(200).json(result)
        } catch (e) {
            await saveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 'GET', 'Get all the post items by blog ID', e)
            return res.sendStatus(500)
        }
    }
}