import { Router, Request, Response } from "express";
import { RuleValidations, inputValidation } from "../../Applications/Middleware/input-validation/InputValidations";
import { authValidation } from "../../Applications/Middleware/auth/AdminAuth";
import { SaveError } from "../../Utils/error-utils/save-error";
import { ROUTERS_SETTINGS } from "../../settings";
import { PostService } from "../../Service/PostService/PostService";
import { PostInputModelType, PostViewModelType, PostsViewModelType } from "../../Applications/Types-Models/Post/PostTypes";
import { SortAndPaginationQueryType } from "../../Applications/Types-Models/BasicTypes";
import { PostQueryRepositories } from "../../Repositories/PostRepositories/PostQueryRepositories";
import { defaultValueBasic } from "../../Utils/default-values/default-values";


export const PostRouter = Router()

PostRouter.get('/', async (req: Request<{},{},{},SortAndPaginationQueryType>, res: Response<PostsViewModelType>) => {
    try {
        const queryValue: SortAndPaginationQueryType = await defaultValueBasic.defaultPaginationAndSortValues(req.query)
        const result = await PostQueryRepositories.GetAllBlogs(queryValue)
        return res.status(200).json(result)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.POST.post}/`, 'GET', 'GET all a post items', e)
        return res.sendStatus(500)
    }   
})

PostRouter.get('/:id', async (req: Request<{id: string}>, res: Response<PostViewModelType | null>) => {
    try {
        const result = await PostQueryRepositories.GetBlogById(req.params.id)
        return result ? res.status(200).json(result) : res.status(404).json(null)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.POST.post}/:id`, 'GET', 'GET the post item by ID', e)
        return res.sendStatus(500)
    }   
})

PostRouter.post('/', 
authValidation,
RuleValidations.validTitle,
RuleValidations.validShortDescription,
RuleValidations.validContent,
RuleValidations.validBlogId,
inputValidation,
async (req: Request<{}, {}, PostInputModelType>, res: Response<PostViewModelType | null>) => {
    try {
        const result = await PostService.CreatePostItemByBlogId(req.body)
        return result ? res.status(201).json(result) : res.status(404).json(null)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.POST.post}/`, 'POST', 'Create the post by blog`s ID', e)
        return res.sendStatus(500)
    }
})

PostRouter.put('/:id', 
authValidation,
RuleValidations.validTitle,
RuleValidations.validShortDescription,
RuleValidations.validContent,
RuleValidations.validBlogId,
inputValidation,
    async (req: Request<{id: string}, {}, PostInputModelType>, res: Response) => {
        try {
            const result = await PostService.UpdatePostById(req.params.id, req.body)
            return res.sendStatus(result)
        } catch (e) {
            SaveError(`${ROUTERS_SETTINGS.POST.post}/:id`, 'PUT', 'Update the post by ID', e)
            return res.sendStatus(500)
        }
})

PostRouter.delete('/:id', 
authValidation,
async (req: Request<{id: string}>, res: Response) => {
    try {
        const result = await PostService.DeletePostById(req.params.id)
        return res.sendStatus(result)
    } catch (e) {
        SaveError(`${ROUTERS_SETTINGS.POST.post}/:id`, 'DELETE', 'Delete the post by ID', e)
        return res.sendStatus(500)
    }
})