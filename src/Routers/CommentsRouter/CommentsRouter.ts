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
* If item not found return 404 status.
* If process has some error then send 500 status.
*/
CommentsRouter.get('/:id', 
async (req: Request<{id: string}>, res: Response<CommentViewModelType>) => {
    try {
        const result: CommentViewModelType | null = await CommentQueryRepositories.GetCommentById(req.params.id)
        return result ? res.status(200).json(result) : res.sendStatus(404)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.COMMENTS.comments}/:id`, 'GET', 'Get comment by ID', e)
        return res.sendStatus(500)
    }
})
/*
* 1. Authenticates the user.
* 2. Validates the content of the comment by middleware.
* 3. Attempts to update the comment with the ID specified and calling service.
* 4. Handles the result returned from service:
*    - If the update is successful, responds with status 204 (No Content).
*    - If no comment is found with the specified ID, responds with status 404 (Not Found).
*    - If the user is not authorized to update the comment, responds with status 403 (Forbidden).
*    - For any other result, responds with status 500 (Internal Server Error).
* 5. Catches any exceptions thrown during the process:
*    - Responds with status 500 indicating an internal server error.
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
        SaveError(`${ROUTERS_SETTINGS.COMMENTS.comments}/:id`, 'PUT', 'Update comment by ID', e)
        return res.sendStatus(500)
    }
})
/*
* 1. Authenticates the user.
* 2. Attempts to delete the comment with the ID specified.
* 3. Handles the result returned from service:
*    - If the deletion is successful responds with status 204 (No Content).
*    - If no comment is found with the specified ID, responds with status 404 (Not Found).
*    - If the user is not authorized to delete the comment, responds with status 403 (Forbidden).
*    - For any other result, responds with status 500 (Internal Server Error).
* 4. Catches any exceptions thrown during the process:
*    - Responds with status 500 indicating an internal server error.
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
        SaveError(`${ROUTERS_SETTINGS.COMMENTS.comments}/:id`, 'DELETE', 'Delete comment by ID', e)
        return res.sendStatus(500)
    }
})

