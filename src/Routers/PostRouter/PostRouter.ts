import { Router, Request, Response } from "express";
import { RuleValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import { authValidation } from "../../Applications/Middleware/auth/AdminAuth";
import { SaveError } from "../../Utils/error-utils/save-error";
import { ROUTERS_SETTINGS } from "../../settings";
import { PostService } from "../../Service/PostService/PostService";
import { PostInputModelType, PostViewModelType, PostsViewModelType } from "../../Applications/Types-Models/Post/PostTypes";
import { ResultNotificationEnum, ResultNotificationType, SortAndPaginationQueryType } from "../../Applications/Types-Models/BasicTypes";
import { PostQueryRepositories } from "../../Repositories/PostRepositories/PostQueryRepositories";
import { defaultPaginationAndSortValue } from "../../Utils/default-values/Pagination/default-pagination-and-sort-value";
import { CommentInputModelType, CommentViewModelType } from "../../Applications/Types-Models/Comment/CommentTypes";
import { AuthUser } from "../../Applications/Middleware/auth/UserAuth/AuthUser";


export const PostRouter = Router()

/* 
* Get all the post items with pagination 
*/
PostRouter.get('/', async (req: Request<{},{},{},SortAndPaginationQueryType>, res: Response<PostsViewModelType>) => {
    try {
        const queryValue: SortAndPaginationQueryType = await defaultPaginationAndSortValue.defaultPaginationAndSortValues(req.query)
        const result: PostsViewModelType = await PostQueryRepositories.GetAllPost(queryValue)
        return res.status(200).json(result)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.POST.post}/`, 'GET', 'GET all a post items', e)
        return res.sendStatus(500)
    }   
})
/* 
* Get the post item by ID
* If item not found return 404 status and null
*/
PostRouter.get('/:id', async (req: Request<{id: string}>, res: Response<PostViewModelType | null>) => {
    try {
        const result: PostViewModelType | null = await PostQueryRepositories.GetPostById(req.params.id)
        return result ? res.status(200).json(result) : res.status(404).json(null)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.POST.post}/:id`, 'GET', 'GET the post item by ID', e)
        return res.sendStatus(500)
    }   
})
/*
* 1. Validates the request body using applied middleware and validations.
* 2. Calls service to create a new post item based on the validated input.
* 3. Handles the result returned from PostService:
*    - If creation is successful (ResultNotificationEnum.Success), returns status 200 with the created post data.
*    - If blog ID is not found (ResultNotificationEnum.NotFound), returns status 404.
*    - If an unexpected error occurs, logs the error using SaveError and returns status 500.
*/
PostRouter.post('/', 
authValidation,
RuleValidations.validTitle,
RuleValidations.validShortDescription,
RuleValidations.validContent,
RuleValidations.validBlogId,
inputValidation,
async (req: Request<{}, {}, PostInputModelType>, res: Response<PostViewModelType>) => {
    try {
        const result: ResultNotificationType<PostViewModelType> = await PostService.CreatePostItemByBlogId(req.body)
        switch (result.status) {
            case ResultNotificationEnum.Success:
                return res.status(200).json(result.data);
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.POST.post}/`, 'POST', 'Create the post by blog`s ID', e)
        return res.sendStatus(500)
    }
})
/* 
* 1. Validates the request body and URL parameters using applied middleware and validations.
* 2. Calls service to update the post identified by the ID in the URL with the validated input data.
* 3. Handles the result returned from PostService:
*    - If the update is successful (ResultNotificationEnum.Success), returns status 204 (No Content).
*    - If no post is found with the specified ID (ResultNotificationEnum.NotFound), returns status 404.
*    - If an unexpected error occurs, logs the error using SaveError and returns status 500.
*/
PostRouter.put('/:id', 
authValidation,
RuleValidations.validTitle,
RuleValidations.validShortDescription,
RuleValidations.validContent,
RuleValidations.validBlogId,
inputValidation,
async (req: Request<{id: string}, {}, PostInputModelType>, res: Response) => {
    try {
        const result: ResultNotificationType = await PostService.UpdatePostById(req.params.id, req.body)
        switch (result.status) {
            case ResultNotificationEnum.Success:
                return res.status(204);
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.POST.post}/:id`, 'PUT', 'Update the post by ID', e)
        return res.sendStatus(500)
    }
})
/* The function performs the following steps:
 * 1. Validates the request URL parameter (`id`) using `authValidation`.
 * 2. Calls service to delete the post identified by the ID in the URL.
 * 3. Handles the result returned from `PostService`:
 *    - If the deletion is successful (`ResultNotificationEnum.Success`), returns status 204 (No Content).
 *    - If no post is found with the specified ID (`ResultNotificationEnum.NotFound`), returns status 404.
 *    - If an unexpected error occurs, logs the error using `SaveError` and returns status 500.
 */ 
PostRouter.delete('/:id', 
authValidation,
async (req: Request<{id: string}>, res: Response) => {
    try {
        const result: ResultNotificationType = await PostService.DeletePostById(req.params.id)
        switch (result.status) {
            case ResultNotificationEnum.Success:
                return res.status(204);
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.POST.post}/:id`, 'DELETE', 'Delete the post by ID', e)
        return res.sendStatus(500)
    }
})
/* The function performs the following steps:
* 1. Validates the request body and URL parameters using applied middleware
* 2. Calls service to create a new comment on the post identified by the ID in the URL (`req.params.id`).
*    The comment is associated with the authenticated user identified by `req.user.userId`.
* 3. Handles the result returned from `PostService`:
*    - If the comment creation is successful (`ResultNotificationEnum.Success`), returns status 200 with the created comment data (`result.data`).
*    - If no post is found with the specified ID (`ResultNotificationEnum.NotFound`), returns status 404.
*    - If an unexpected error occurs, logs the error using `SaveError` and returns status 500.
*/
PostRouter.post(`/:id${ROUTERS_SETTINGS.POST.comments}`,
RuleValidations.validContentComment,
AuthUser.AuthUserByAccessToken,
async (req: Request<{id: string}, {}, CommentInputModelType>, res: Response<CommentViewModelType>) => {
    try {
        const result: ResultNotificationType<CommentViewModelType> = await PostService.CreateCommentByPostId(req.body, req.params.id, req.user.userId)
        switch (result.status) {
            case ResultNotificationEnum.Success:
                return res.status(200).json(result.data);
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.POST.post}/:id${ROUTERS_SETTINGS.POST.comments}`, 'POST', 'Create comment by post ID', e)
        return res.sendStatus(500)
    }
})
