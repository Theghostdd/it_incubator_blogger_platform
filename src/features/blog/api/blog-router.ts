import {Router} from "express";
import {ROUTERS_SETTINGS} from "../../../settings";
import {authValidation} from "../../../internal/middleware/auth/AdminAuth/AdminAuth";
import {inputValidation, ruleBodyValidations} from "../../../internal/middleware/input-validation/input-validation";
import {container} from "../../../composition-root/composition-root";
import {BlogController} from "./blog-controller";


export const blogRouter = Router()
const blogController = container.resolve(BlogController);

blogRouter.get('/', blogController.getAllBlogs.bind(blogController))
blogRouter.get('/:id', blogController.getBlogById.bind(blogController))
blogRouter.post('/', authValidation, ruleBodyValidations.validationBodyDescription, ruleBodyValidations.validationBodyName, ruleBodyValidations.validationBodyWebsiteUrl, inputValidation, blogController.createBlog.bind(blogController))
blogRouter.put('/:id', authValidation, ruleBodyValidations.validationBodyDescription, ruleBodyValidations.validationBodyName, ruleBodyValidations.validationBodyWebsiteUrl, inputValidation, blogController.updateBlogById.bind(blogController))
blogRouter.delete('/:id', authValidation, blogController.deleteBlogById.bind(blogController))
blogRouter.post(`/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, authValidation, ruleBodyValidations.validationBodyTitle, ruleBodyValidations.validationBodyShortDescription, ruleBodyValidations.validationBodyContent, inputValidation, blogController.createPostByBlogId.bind(blogController))
blogRouter.get(`/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, blogController.getPostByBlogId.bind(blogController))