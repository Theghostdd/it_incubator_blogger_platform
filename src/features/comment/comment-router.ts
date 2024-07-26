import {Router} from "express";
import {AuthUser} from "../../internal/middleware/auth/UserAuth/auth-user";
import {commentController} from "../../composition-root/comment-composition-root";
import {inputValidation, ruleBodyValidations} from "../../internal/middleware/input-validation/input-validation";


export const commentsRouter = Router()

commentsRouter.get('/:id', commentController.getCommentById.bind(commentController))

commentsRouter.put('/:id', AuthUser.AuthUserByAccessToken, ruleBodyValidations.validationBodyContentComment, inputValidation, commentController.updateCommentById.bind(commentController))

commentsRouter.delete('/:id', AuthUser.AuthUserByAccessToken, commentController.deleteCommentById.bind(commentController))
