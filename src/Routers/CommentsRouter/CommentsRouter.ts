import { Router, Request, Response } from "express";
import { AuthUser } from "../../Applications/Middleware/auth/UserAuth/AuthUser";
import { ROUTERS_SETTINGS } from "../../settings";
import { SaveError } from "../../Utils/error-utils/save-error";
import { CommentQueryRepositories } from "../../Repositories/CommentRepositories/CommentQueryRepositories";
import { CommentInputModelType, CommentViewModelType } from "../../Applications/Types-Models/Comment/CommentTypes";
import { ResultNotificationEnum, ResultNotificationType } from "../../Applications/Types-Models/BasicTypes";
import { CommentService } from "../../Service/CommentService/CommentService";
import { RuleValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";

export const CommentsRouter = Router()
/* 
* Get the comment item by ID.
* If item not found return error.
* Responds with status 500 (Internal Server Error) if an error occurs.
*/
CommentsRouter.get('/:id', 
async (req: Request<{id: string}>, res: Response<CommentViewModelType>) => {
    try {
        const result: CommentViewModelType | null = await CommentQueryRepositories.GetCommentById(req.params.id)
        return result ? res.status(200).json(result) : res.sendStatus(404)
    } catch (e) {
        await SaveError(`${ROUTERS_SETTINGS.COMMENTS.comments}/:id`, 'GET', 'Get comment by ID', e)
        return res.sendStatus(500)
    }
})
/*
* Verification of the user who makes the request.
* Validation of data from the client.
* Sending data to the service to update the comment by its ID and belonging to the user.
* Processing the response from the service.
* Responds with status 500 (Internal Server Error) if an error occurs.
*/
CommentsRouter.put('/:id', 
AuthUser.AuthUserByAccessToken,
RuleValidations.validContentComment,
inputValidation,
async (req: Request<{id: string}, {}, CommentInputModelType>, res: Response) => {
    try {
        const result: ResultNotificationType = await CommentService.UpdateCommentById(req.params.id, req.user.userId, req.body)
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
        await SaveError(`${ROUTERS_SETTINGS.COMMENTS.comments}/:id`, 'PUT', 'Update comment by ID', e)
        return res.sendStatus(500)
    }
})
/*
* Verification of the user who makes the request.
* Deleting comments by ID and belonging to a specific user.
* * Processing the response from the service.
* Responds with status 500 (Internal Server Error) if an error occurs.
*/
CommentsRouter.delete('/:id', 
AuthUser.AuthUserByAccessToken,
async (req: Request<{id: string}>, res: Response) => {
    try {
        const result: ResultNotificationType = await CommentService.DeleteCommentById(req.params.id, req.user.userId)
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
        await SaveError(`${ROUTERS_SETTINGS.COMMENTS.comments}/:id`, 'DELETE', 'Delete comment by ID', e)
        return res.sendStatus(500)
    }
})

