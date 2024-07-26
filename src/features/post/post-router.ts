import {postController} from "../../composition-root/post-composition-root";
import {authValidation} from "../../internal/middleware/auth/AdminAuth/AdminAuth";
import {inputValidation, ruleBodyValidations} from "../../internal/middleware/input-validation/input-validation";
import express from "express";
import {ROUTERS_SETTINGS} from "../../settings";
import {authUserMiddleware} from "../../composition-root/auth-registration-composition-root";


export const postRouter = express.Router();

postRouter.get('/', postController.getPosts.bind(postController))

postRouter.get('/:id', postController.getPostById.bind(postController))

postRouter.post('/',
    authValidation,
    ruleBodyValidations.validationBodyTitle,
    ruleBodyValidations.validationBodyShortDescription,
    ruleBodyValidations.validationBodyContent,
    ruleBodyValidations.validationBodyBlogId,
    inputValidation,
    postController.createPost.bind(postController)
)

postRouter.put('/:id',
    authValidation,
    ruleBodyValidations.validationBodyTitle,
    ruleBodyValidations.validationBodyShortDescription,
    ruleBodyValidations.validationBodyContent,
    ruleBodyValidations.validationBodyBlogId,
    inputValidation,
    postController.updatePostById.bind(postController)
)
postRouter.delete('/:id', authValidation, postController.deletePostById.bind(postController))

postRouter.post(`/:id${ROUTERS_SETTINGS.POST.comments}`,
    authUserMiddleware.authUserByAccessToken.bind(authUserMiddleware),
    ruleBodyValidations.validationBodyContentComment,
    inputValidation,
    postController.createCommentByPostId.bind(postController)
)

postRouter.get(`/:id${ROUTERS_SETTINGS.POST.comments}`, postController.getCommentsByPostId.bind(postController))