import {Router} from "express";
import {inputValidation, ruleBodyValidations} from "../../../internal/middleware/input-validation/input-validation";
import {ROUTERS_SETTINGS} from "../../../settings";
import {container} from "../../../composition-root/composition-root";
import {CommentController} from "./comment-controller";
import {AuthUserMiddleware} from "../../../internal/middleware/auth/UserAuth/auth-user";


export const commentsRouter = Router()

const commentController = container.resolve(CommentController)
const authUserMiddleware = container.resolve(AuthUserMiddleware);

commentsRouter.get('/:id', authUserMiddleware.verifyUserByAccessToken.bind(authUserMiddleware), commentController.getCommentById.bind(commentController))

commentsRouter.put('/:id', authUserMiddleware.authUserByAccessToken.bind(authUserMiddleware), ruleBodyValidations.validationBodyContentComment, inputValidation, commentController.updateCommentById.bind(commentController))

commentsRouter.delete('/:id', authUserMiddleware.authUserByAccessToken.bind(authUserMiddleware), commentController.deleteCommentById.bind(commentController))

commentsRouter.put(`/:id${ROUTERS_SETTINGS.COMMENTS.like_status}`, authUserMiddleware.authUserByAccessToken.bind(authUserMiddleware), ruleBodyValidations.validationBodyLikeStatus, inputValidation, commentController.updateCommentLikeStatusById.bind(commentController))
