import {Router} from "express";
import {inputValidation, ruleBodyValidations} from "../../internal/middleware/input-validation/input-validation";
import {ROUTERS_SETTINGS} from "../../settings";
import {authUserMiddleware, commentController} from "../../composition-root/composition-root";


export const commentsRouter = Router()

commentsRouter.get('/:id', commentController.getCommentById.bind(commentController))

commentsRouter.put('/:id', authUserMiddleware.authUserByAccessToken.bind(authUserMiddleware), ruleBodyValidations.validationBodyContentComment, inputValidation, commentController.updateCommentById.bind(commentController))

commentsRouter.delete('/:id', authUserMiddleware.authUserByAccessToken.bind(authUserMiddleware), commentController.deleteCommentById.bind(commentController))

commentsRouter.put(`/:id${ROUTERS_SETTINGS.COMMENTS.like_status}`, authUserMiddleware.authUserByAccessToken.bind(authUserMiddleware), ruleBodyValidations.validationBodyLikeStatus, inputValidation, commentController.updateCommentLikeStatusById.bind(commentController))
