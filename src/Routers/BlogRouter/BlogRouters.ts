import { Router, Request, Response } from "express";
import { RuleValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import { authValidation } from "../../Applications/Middleware/auth/AdminAuth";
import { ROUTERS_SETTINGS } from "../../settings";
import { SaveError } from "../../Utils/error-utils/save-error";
import { BlogInputModelType, BlogQueryParamsType, BlogViewModelType, BlogsViewModelType } from "../../Applications/Types-Models/Blog/BlogTypes";
import { defaultBlogValues, defaultValueBasic } from "../../Utils/default-values/default-values";
import { BlogQueryRepositories } from "../../Repositories/BlogRepositories/BlogQueryRepositories";
import { BlogService } from "../../Service/BlogService/BlogService";
import { PostInputModelType, PostViewModelType, PostsViewModelType } from "../../Applications/Types-Models/Post/PostTypes";
import { PostService } from "../../Service/PostService/PostService";
import { SortAndPaginationQueryType } from "../../Applications/Types-Models/BasicTypes";
import { PostQueryRepositories } from "../../Repositories/PostRepositories/PostQueryRepositories";

export const BlogRouter = Router()

BlogRouter.get('/', async (req: Request<{}, {}, {}, BlogQueryParamsType>, res: Response<BlogsViewModelType>) => {
    try {
        const queryValue: BlogQueryParamsType = await defaultBlogValues.defaultQueryValue(req.query)
        const result = await BlogQueryRepositories.GetAllBlogs(queryValue)
        return res.status(200).json(result)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/`, 'GET', 'Get the all blog items', e)
        return res.sendStatus(500)
    }    
})

BlogRouter.get('/:id', async (req: Request<{id: string}>, res: Response<BlogViewModelType | null>) => {
    try {
        const result = await BlogQueryRepositories.GetBlogById(req.params.id)
        return result ? res.status(200).json(result) : res.status(404).json(null)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id`, 'GET', 'Get the blog item by ID', e)
        return res.sendStatus(500)
    }
})

BlogRouter.get(`/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 
async (req: Request<{id: string}, {}, {}, SortAndPaginationQueryType>, res: Response<PostsViewModelType | null>) => {
    try {
        const getBlog = await BlogQueryRepositories.GetBlogById(req.params.id)
        if (!getBlog) {
            return res.status(404).json(null)
        }
        
        const queryValue: SortAndPaginationQueryType = await defaultValueBasic.defaultPaginationAndSortValues(req.query)
        const result = await PostQueryRepositories.GetAllPost(queryValue)
        return res.status(200).json(result)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 'GET', 'Get all the post items by blog ID', e)
        return res.sendStatus(500)
    }
})


BlogRouter.post('/', 
authValidation,
RuleValidations.validDescription,
RuleValidations.validName,
RuleValidations.validWebsiteUrl,
inputValidation,
async (req: Request<{}, {}, BlogInputModelType>, res: Response<BlogViewModelType>) => {
    try {
        const result = await BlogService.CreateBlogItem(req.body)
        return res.status(201).json(result)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/`, 'POST', 'Create a blog item', e)
        return res.sendStatus(500)
    }
})

BlogRouter.post(`/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 
authValidation,
RuleValidations.validTitle,
RuleValidations.validShortDescription,
RuleValidations.validContent,
inputValidation,
async (req: Request<{id: string}, {}, PostInputModelType>, res: Response<PostViewModelType | null>)  => {
    try {
        req.body.blogId = req.params.id
        const result = await PostService.CreatePostItemByBlogId(req.body)
        return result ? res.status(201).json(result) : res.status(404).json(null)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id${ROUTERS_SETTINGS.BLOG.blogs_posts}`, 'POST', 'Create a post element by blog ID', e)
        return res.sendStatus(500)
    }
})

BlogRouter.put('/:id',
authValidation,
RuleValidations.validDescription,
RuleValidations.validName,
RuleValidations.validWebsiteUrl,
inputValidation,
async (req: Request<{id: string}, {}, BlogInputModelType>, res: Response) => {
    try {
        const result = await BlogService.UpdateBlogById(req.params.id, req.body)
        return res.sendStatus(result)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id`, 'PUT', 'Update the blog item by ID', e)
        return res.sendStatus(500)
    }
})

BlogRouter.delete('/:id', 
authValidation,
async (req: Request<{id: string}>, res: Response) => {
    try {
        const result: number = await BlogService.DeleteBlogById(req.params.id)
        return res.sendStatus(result)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.BLOG.blogs}/:id`, 'DELETE', 'Delete the blog item by ID', e)
        return res.sendStatus(500)
    }
})
















