import { Router, Request, Response } from "express";
import { RuleValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import { authValidation } from "../../Applications/Middleware/auth/AdminAuth";
import { ROUTERS_SETTINGS } from "../../settings";
import { SaveError } from "../../Utils/error-utils/save-error";
import { BlogInputModelType, BlogQueryParamsType, BlogViewModelType, BlogsViewModelType } from "../../Applications/Types-Models/Blog/BlogTypes";
import { BlogQueryRepositories } from "../../Repositories/BlogRepositories/BlogQueryRepositories";
import { BlogService } from "../../Service/BlogService/BlogService";
import { PostInputModelType, PostQueryValues, PostViewModelType, PostsViewModelType } from "../../Applications/Types-Models/Post/PostTypes";
import { PostService } from "../../Service/PostService/PostService";
import { ResultNotificationEnum, ResultNotificationType } from "../../Applications/Types-Models/BasicTypes";
import { PostQueryRepositories } from "../../Repositories/PostRepositories/PostQueryRepositories";
import { defaultBlogValues } from "../../Utils/default-values/Blog/default-blog-value";
import { defaultPostValues } from "../../Utils/default-values/Post/default-post-value";

export const BlogRouter = Router()
/*
* 1. To validate and set default values for query parameters.
* 2. Calls query repositories with validated query parameters to fetch all blogs.
* 3. Returns a JSON response with status 200 containing the fetched blogs.
* 4. Responds with status 500 (Internal Server Error) if an error occurs.
*/
BlogRouter.get('/', async (req: Request<{}, {}, {}, BlogQueryParamsType>, res: Response<BlogsViewModelType>) => {
    try {
        const queryValue: BlogQueryParamsType = await defaultBlogValues.defaultQueryValue(req.query)
        const result: BlogsViewModelType = await BlogQueryRepositories.GetAllBlogs(queryValue)
        return result.items!.length > 0 ? res.status(200).json(result) : res.sendStatus(404)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/`, 'GET', 'Get the all blog items', e)
        return res.sendStatus(500)
    }    
})
/*
* 1. Calls query repositories with the blog ID (`req.params.id`) to fetch the blog item.
* 2. If a blog item is found (`result` is not null), responds with status 200 and JSON containing the blog item.
* 3. If no blog item is found (`result` is null), responds with status 404 and JSON `null`.
* 4. Responds with status 500 (Internal Server Error) if an error occurs.
*/
BlogRouter.get('/:id', async (req: Request<{id: string}>, res: Response<BlogViewModelType | null>) => {
    try {
        const result: BlogViewModelType | null = await BlogQueryRepositories.GetBlogById(req.params.id)
        return result ? res.status(200).json(result) : res.status(404).json(null)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id`, 'GET', 'Get the blog item by ID', e)
        return res.sendStatus(500)
    }
})
/*
* 1. Parses and validates the query parameters for sorting and pagination.
* 2. Calls query repositories to fetch the posts related to the specified blog ID.
* 3. Returns the posts in a 200 (OK) response if any posts are found.
* 4. If no posts are found for the given blog ID, sends a 404 (Not Found) response.
* 5. Sends a 500 (Internal Server Error) response if an unexpected error occurs.
*/ 
BlogRouter.get(`/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 
async (req: Request<{id: string}, {}, {}, PostQueryValues>, res: Response<PostsViewModelType | null>) => {
    try {
        const queryValue: PostQueryValues = await defaultPostValues.defaultQueryValues(req.query)
        const result: PostsViewModelType = await PostQueryRepositories.GetAllPost(queryValue, req.params.id)
        return result.items!.length > 0 ? res.status(200).json(result) : res.sendStatus(404)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 'GET', 'Get all the post items by blog ID', e)
        return res.sendStatus(500)
    }
})
/*
* 1. Validates data whit middleware`.
* 2. Calls service to attempt creation of a blog item.
* 3. Handles different outcomes based on the `ResultNotificationType`:
*    - If creation is successful, responds with status 201 and the created blog data.
*    - If the requested resource is not found, responds with status 404.
*    - For any other errors, responds with status 500 and logs the error.
*/
BlogRouter.post('/', 
authValidation,
RuleValidations.validDescription,
RuleValidations.validName,
RuleValidations.validWebsiteUrl,
inputValidation,
async (req: Request<{}, {}, BlogInputModelType>, res: Response<BlogViewModelType>) => {
    try {
        const result: ResultNotificationType<BlogViewModelType> = await BlogService.CreateBlogItem(req.body)
        switch (result.status) {
            case ResultNotificationEnum.Success:
                return res.status(201).json(result.data);
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/`, 'POST', 'Create a blog item', e)
        return res.sendStatus(500)
    }
})
/* 
* 1. Authenticates the request to ensure the user is authorized to create a post.
* 2. Validates the incoming request body for required fields.
* 3. Sets the `blogId` in the request body to the blog ID provided in the URL path parameter.
* 4. Calls post service to create the post.
* 5. Returns a 201 (Created) response with the created post data if the operation is successful.
* 6. If the blog ID does not exist, returns a 404 (Not Found) response.
* 7. Handles unexpected errors by logging the error and returning a 500 (Internal Server Error) response.
*/ 
BlogRouter.post(`/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 
authValidation,
RuleValidations.validTitle,
RuleValidations.validShortDescription,
RuleValidations.validContent,
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
        SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 'POST', 'Create a post element by blog ID', e)
        return res.sendStatus(500)
    }
})
/* 
* 1. Validates the request.
* 2. Calls service to update the blog item in the database.
* 3. Checks the status returned from the update operation:
*    - If the update is successful (`ResultNotificationEnum.Success`), sends a 204 (No Content) response.
*    - If the blog item is not found (`ResultNotificationEnum.NotFound`), sends a 404 (Not Found) response.
*    - For any other unexpected error, sends a 500 (Internal Server Error) response and logs the error.
*/ 
BlogRouter.put('/:id',
authValidation,
RuleValidations.validDescription,
RuleValidations.validName,
RuleValidations.validWebsiteUrl,
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
        SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id`, 'PUT', 'Update the blog item by ID', e)
        return res.sendStatus(500)
    }
})
/* 
* 1. Validates the request.
* 2. Calls service to delete the blog item from the database.
* 3. Checks the status returned from the delete operation:
*    - If the deletion is successful (`ResultNotificationEnum.Success`), sends a 204 (No Content) response.
*    - If the blog item is not found (`ResultNotificationEnum.NotFound`), sends a 404 (Not Found) response.
*    - For any other unexpected error, sends a 500 (Internal Server Error) response and logs the error.
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
        SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id`, 'DELETE', 'Delete the blog item by ID', e)
        return res.sendStatus(500)
    }
})
















