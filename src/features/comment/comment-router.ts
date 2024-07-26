import {Router} from "express";
import {commentController} from "../../composition-root/comment-composition-root";
import {inputValidation, ruleBodyValidations} from "../../internal/middleware/input-validation/input-validation";
import {authUserMiddleware} from "../../composition-root/auth-registration-composition-root";


export const commentsRouter = Router()

commentsRouter.get('/:id', commentController.getCommentById.bind(commentController))

commentsRouter.put('/:id', authUserMiddleware.authUserByAccessToken.bind(authUserMiddleware), ruleBodyValidations.validationBodyContentComment, inputValidation, commentController.updateCommentById.bind(commentController))

commentsRouter.delete('/:id', authUserMiddleware.authUserByAccessToken.bind(authUserMiddleware), commentController.deleteCommentById.bind(commentController))
