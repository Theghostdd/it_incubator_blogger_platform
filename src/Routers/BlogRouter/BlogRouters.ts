import { Router, Request, Response } from "express";
import { ruleBodyValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import { authValidation } from "../../internal/middleware/auth/AdminAuth/AdminAuth";
import { ROUTERS_SETTINGS } from "../../settings";
import { SaveError } from "../../utils/error-utils/save-error";
import { BlogInputModelType, BlogQueryParamsType, BlogViewModelType } from "../../Applications/Types-Models/Blog/BlogTypes";
import { BlogQueryRepositories } from "../../Repositories/BlogRepositories/BlogQueryRepositories";
import { BlogService } from "../../Service/BlogService/BlogService";
import { PostInputModelType, PostViewModelType } from "../../Applications/Types-Models/Post/PostTypes";
import { PostService } from "../../Service/PostService/PostService";
import {
    QueryParamsType,
    ResultDataWithPaginationType,
    ResultNotificationEnum,
    ResultNotificationType
} from "../../Applications/Types-Models/BasicTypes";
import { PostQueryRepositories } from "../../Repositories/PostRepositories/PostQueryRepositories";
import { defaultBlogValues } from "../../utils/default-values/Blog/default-blog-value";
import { defaultPostValues } from "../../utils/default-values/Post/default-post-value";

export const BlogRouter = Router()
/*
* Setting default query parameters.
* Getting all blogs according to query parameters, returning all found blogs
* Responds with status 500 (Internal Server Error) if an error occurs.
*/
BlogRouter.get('/',)


/*
* Getting a blog by its ID.
* Processing the response from the repository in messages with a found or not found document.
* Responds with status 500 (Internal Server Error) if an error occurs.
*/
BlogRouter.get('/:id', async (req: Request<{id: string}>, res: Response<BlogViewModelType>) => {
    try {
        const result: BlogViewModelType | null = await BlogQueryRepositories.GetBlogById(req.params.id)
        return result ? res.status(200).json(result) : res.sendStatus(404)
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id`, 'GET', 'Get the blog item by ID', e)
        return res.sendStatus(500)
    }
})
/*
* Creating default query entries for posts.
* Getting all the posts of a particular blog.
* Return of found posts, if no posts are found, an empty array will be returned.
* Sends a 500 (Internal Server Error) response if an unexpected error occurs.
*/ 
BlogRouter.get(`/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 
async (req: Request<{id: string}, {}, {}, QueryParamsType>, res: Response<ResultDataWithPaginationType<PostViewModelType[]>>) => {
    try {
        const queryValue: QueryParamsType = await defaultPostValues.defaultQueryValues(req.query)
        const result: ResultDataWithPaginationType<PostViewModelType[]> = await PostQueryRepositories.GetAllPost(queryValue, req.params.id)
        return res.status(200).json(result)
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 'GET', 'Get all the post items by blog ID', e)
        return res.sendStatus(500)
    }
})
/*
* Verification of the user who makes the request.
* Validation of the data that was sent from the client.
* Transfer data to the service to create a new blog.
* Processing the response from the service.
* Responds with status 500 (Internal Server Error) if an error occurs.
*/
BlogRouter.post('/', 
authValidation,
ruleBodyValidations.validDescription,
ruleBodyValidations.validName,
ruleBodyValidations.validWebsiteUrl,
inputValidation,
async (req: Request<{}, {}, BlogInputModelType>, res: Response<BlogViewModelType>) => {
    try {
        const result: ResultNotificationType<BlogViewModelType> = await BlogService.CreateBlogItem(req.body)
        switch (result.status) {
            case ResultNotificationEnum.Success:
                return res.status(201).json(result.data);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/`, 'POST', 'Create a blog item', e)
        return res.sendStatus(500)
    }
})
/* 
* Verification of the user who makes the request.
* Validation of the data that was sent from the client.
* Transfer data to the service to create the post by blog id from params.
* Processing the response from the service.
* Handles unexpected errors by logging the error and returning a 500 (Internal Server Error) response.
*/ 
BlogRouter.post(`/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 
authValidation,
ruleBodyValidations.validTitle,
ruleBodyValidations.validShortDescription,
ruleBodyValidations.validContent,
inputValidation,
async (req: Request<{id: string}, {}, PostInputModelType>, res: Response<PostViewModelType>)  => {
    try {
        req.body.blogId = req.params.id
        const result: ResultNotificationType<PostViewModelType> = await PostService.CreatePostItemByBlogId(req.body)
        switch (result.status) {
            case ResultNotificationEnum.Success:
                return res.status(201).json(result.data);
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 'POST', 'Create a post element by blog ID', e)
        return res.sendStatus(500)
    }
})
/*
* Verification of the user who makes the request.
* Validation of the data that was sent from the client.
* Transfer data to the service to update the blog by id from params.
* Processing the response from the service.
* Responds with status 500 (Internal Server Error) if an error occurs.
*/
BlogRouter.put('/:id',
authValidation,
ruleBodyValidations.validDescription,
ruleBodyValidations.validName,
ruleBodyValidations.validWebsiteUrl,
inputValidation,
async (req: Request<{id: string}, {}, BlogInputModelType>, res: Response) => {
    try {
        const result: ResultNotificationType = await BlogService.UpdateBlogById(req.params.id, req.body)
        switch (result.status) {
            case ResultNotificationEnum.Success:
                return res.sendStatus(204);
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id`, 'PUT', 'Update the blog item by ID', e)
        return res.sendStatus(500)
    }
})
/*
* Verification of the user who makes the request.
* Transfer id from params to service.
* Processing the response from the service.
* Responds with status 500 (Internal Server Error) if an error occurs.
*/
BlogRouter.delete('/:id', 
authValidation,
async (req: Request<{id: string}>, res: Response) => {
    try {
        const result: ResultNotificationType = await BlogService.DeleteBlogById(req.params.id)
        switch (result.status) {
            case ResultNotificationEnum.Success:
                return res.sendStatus(204);
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id`, 'DELETE', 'Delete the blog item by ID', e)
        return res.sendStatus(500)
    }
})
















