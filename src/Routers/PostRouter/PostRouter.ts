import { Router, Request, Response } from "express";
import { ruleBodyValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import { authValidation } from "../../internal/middleware/auth/AdminAuth/AdminAuth";
import { SaveError } from "../../utils/error-utils/save-error";
import { ROUTERS_SETTINGS } from "../../settings";
import { PostService } from "../../Service/PostService/PostService";
import { PostInputModelType, PostViewModelType } from "../../Applications/Types-Models/Post/PostTypes";
import {
    QueryParamsType,
    ResultDataWithPaginationType,
    ResultNotificationEnum,
    ResultNotificationType
} from "../../Applications/Types-Models/BasicTypes";
import { PostQueryRepositories } from "../../Repositories/PostRepositories/PostQueryRepositories";
import { CommentInputModelType, CommentViewModelType } from "../../Applications/Types-Models/Comment/CommentTypes";
import { AuthUser } from "../../internal/middleware/auth/UserAuth/AuthUser";
import { defaultPostValues } from "../../utils/default-values/Post/default-post-value";
import { defaultCommentValues } from "../../utils/default-values/Comment/default-comment-value";
import { CommentQueryRepositories } from "../../Repositories/CommentRepositories/CommentQueryRepositories";


export const PostRouter = Router()

/*
* Creating default query values.
* Request all posts.
* Return of all documents, according to filtering and pagination, if there are no potts, an empty array will be returned.
* Responds with status 500 (Internal Server Error) if an error occurs.
*/
PostRouter.get('/',
    async (req: Request<{},{},{},QueryParamsType>, res: Response<ResultDataWithPaginationType<PostViewModelType[]>>) => {
    try {
        const queryValue: QueryParamsType = await defaultPostValues.defaultQueryValues(req.query)
        const result: ResultDataWithPaginationType<PostViewModelType[]> = await PostQueryRepositories.GetAllPost(queryValue)
        return res.status(200).json(result)
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.POST.post}/`, 'GET', 'GET all a post items', e)
        return res.sendStatus(500)
    }   
})
/* 
* Getting a post by its ID form params.
* If the post is not found, an error will be returned.
* If the post was found, the return of the post model.
* Responds with status 500 (Internal Server Error) if an error occurs.
*/
PostRouter.get('/:id',
    async (req: Request<{id: string}>, res: Response<PostViewModelType>) => {
    try {
        const result: PostViewModelType | null = await PostQueryRepositories.GetPostById(req.params.id)
        return result ? res.status(200).json(result) : res.sendStatus(404)
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.POST.post}/:id`, 'GET', 'GET the post item by ID', e)
        return res.sendStatus(500)
    }   
})
/*
* Verification of the user who made the request.
* Validation of the send data.
* Transfer data to create a post document, by blog ID.
* Processing the response from the service.
* Responds with status 500 (Internal Server Error) if an error occurs.
*/
PostRouter.post('/', 
authValidation,
ruleBodyValidations.validTitle,
ruleBodyValidations.validShortDescription,
ruleBodyValidations.validContent,
ruleBodyValidations.validBlogId,
inputValidation,
async (req: Request<{}, {}, PostInputModelType>, res: Response<PostViewModelType>) => {
    try {
        const result: ResultNotificationType<PostViewModelType> = await PostService.CreatePostItemByBlogId(req.body)
        switch (result.status) {
            case ResultNotificationEnum.Success:
                return res.status(201).json(result.data);
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.POST.post}/`, 'POST', 'Create the post by blog`s ID', e)
        return res.sendStatus(500)
    }
})
/*
* Verification of the user who made the request.
* Validation of the send data.
* Sending data to the service to update the post by its ID.
* Processing the response from the service.
* Responds with status 500 (Internal Server Error) if an error occurs.
*/
PostRouter.put('/:id', 
authValidation,
ruleBodyValidations.validTitle,
ruleBodyValidations.validShortDescription,
ruleBodyValidations.validContent,
ruleBodyValidations.validBlogId,
inputValidation,
async (req: Request<{id: string}, {}, PostInputModelType>, res: Response) => {
    try {
        const result: ResultNotificationType = await PostService.UpdatePostById(req.params.id, req.body)
        switch (result.status) {
            case ResultNotificationEnum.Success:
                return res.sendStatus(204);
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.POST.post}/:id`, 'PUT', 'Update the post by ID', e)
        return res.sendStatus(500)
    }
})
/*
* Verification of the user who made the request.
* Transfer the ID to the service from the parameters.
* Deleting a post by its ID.
* Processing the response from the service.
* Responds with status 500 (Internal Server Error) if an error occurs.
*/
PostRouter.delete('/:id', 
authValidation,
async (req: Request<{id: string}>, res: Response) => {
    try {
        const result: ResultNotificationType = await PostService.DeletePostById(req.params.id)
        switch (result.status) {
            case ResultNotificationEnum.Success:
                return res.sendStatus(204);
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.POST.post}/:id`, 'DELETE', 'Delete the post by ID', e)
        return res.sendStatus(500)
    }
})
/* 
* User verification by Access Token.
* Validation of data sent from the client.
* Transfer data to the service to create a comment based on the post ID linked to the user.
* Processing the response from the service.
* Responds with status 500 (Internal Server Error) if an error occurs.
*/
PostRouter.post(`/:id${ROUTERS_SETTINGS.POST.comments}`,
AuthUser.AuthUserByAccessToken,
ruleBodyValidations.validContentComment,
inputValidation,
async (req: Request<{id: string}, {}, CommentInputModelType>, res: Response<CommentViewModelType>) => {
    try {
        const result: ResultNotificationType<CommentViewModelType> = await PostService.CreateCommentByPostId(req.body, req.params.id, req.user.userId)
        switch (result.status) {
            case ResultNotificationEnum.Success:
                return res.status(201).json(result.data);
            case ResultNotificationEnum.NotFound:
                return res.sendStatus(404);
            default: return res.sendStatus(500)
        }
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.POST.post}/:id${ROUTERS_SETTINGS.POST.comments}`, 'POST', 'Create comment by post ID', e)
        return res.sendStatus(500)
    }
})
/*
* Create default query values to get all comments.
* Getting all comments for a certain post by its ID.
* Processing the response if the post was not found, the error was returned.
* Responds with status 500 (Internal Server Error) if an error occurs.
*/
PostRouter.get(`/:id${ROUTERS_SETTINGS.POST.comments}`, 
async (req: Request<{id: string}, {}, {}, QueryParamsType>, res: Response<ResultDataWithPaginationType<CommentViewModelType[]>>) => {
    try {
        const queryValue: QueryParamsType = await defaultCommentValues.defaultQueryValue(req.query)
        const result:ResultDataWithPaginationType<CommentViewModelType[]> = await CommentQueryRepositories.GetAllComments(queryValue, req.params.id)
        return result.items.length > 0 ? res.status(200).json(result) : res.sendStatus(404)
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.POST.post}/:id${ROUTERS_SETTINGS.POST.comments}`, 'GET', 'Get all comments by post ID', e)
        return res.sendStatus(500)
    }
})