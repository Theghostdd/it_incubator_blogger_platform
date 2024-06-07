import { Router, Request, Response } from "express";
import { RuleValidations, inputValidation } from "../../Applications/Validations/inputValidations/InputValidations";
import { RequestParamsType, ResponseType, AllResponseType, StatusResponse} from "../../Applications/Types/Types";
import { BlogInputType, BlogPostInputType, BlogQueryRequestType } from '../../Applications/Types/BlogsTypes/BlogTypes'
import { authValidation } from "../../Applications/Validations/auth/auth";
import { BlogService } from "../../Service/BlogService";
import { BlogQueryRepos } from "../../Repositories/BlogRepo/BlogQueryRepo";
import { SETTINGS } from "../../settings";
import { PostQueryRepo } from "../../Repositories/PostRepo/PostQueryRepo";
import { PostInputType, PostQueryRequestType } from "../../Applications/Types/PostsTypes/PostTypes";
import { PostService } from "../../Service/PostService";

export const BlogRouter = Router()


BlogRouter.get('/', 
    RuleValidations.validQueryPageSize,
    RuleValidations.validQueryPageNumber,
    RuleValidations.validQuerySortDirection,
    RuleValidations.validSortBy,
    inputValidation,
    async (req: Request<{}, {}, {}, BlogQueryRequestType>, res: Response<AllResponseType | null>) => {
        const result = await BlogQueryRepos.GetAllBlogs(req.query)
        return res.status(result.status).json(result.elements)
})


BlogRouter.get('/:id', async (req: Request<RequestParamsType>, res: Response<ResponseType | null>) => {
    const result = await BlogQueryRepos.GetBlogById(req.params.id)
    return res.status(result.status).json(result.elements)
})

BlogRouter.get(`/:id/${SETTINGS.PATH.additionalBlog.posts}`, 
    RuleValidations.validQueryPageSize,
    RuleValidations.validQueryPageNumber,
    RuleValidations.validQuerySortDirection,
    RuleValidations.validSortBy,
    inputValidation,
    async (req: Request<{id: string}, {}, {}, PostQueryRequestType>, res: Response<AllResponseType | null>) => {
        const result = await PostQueryRepo.GetAllPosts(req.query, req.params.id)
        return res.status(result.status).json(result.elements)
})


BlogRouter.post('/', 
    authValidation,
    RuleValidations.validDescription,
    RuleValidations.validName,
    RuleValidations.validWebsiteUrl,
    inputValidation,
    async (req: Request<{}, {}, BlogInputType>, res: Response<ResponseType | null>) => {
        const result = await BlogService.CreateBlogService(req.body)
        return res.status(result.status).json(result.elements)
})

BlogRouter.post(`/:id/${SETTINGS.PATH.additionalBlog.posts}`, 
    authValidation,
    RuleValidations.validTitle,
    RuleValidations.validShortDescription,
    RuleValidations.validContent,
    inputValidation,
    async (req: Request<{id: string}, {}, PostInputType>, res: Response<ResponseType | null>) => {
        req.body.blogId = req.params.id
        const result = await PostService.CreatePostService(req.body)
        return res.status(result.status).json(result.elements)
})

BlogRouter.put('/:id',
    authValidation,
    RuleValidations.validDescription,
    RuleValidations.validName,
    RuleValidations.validWebsiteUrl,
    inputValidation,
    async (req: Request<RequestParamsType, {}, BlogInputType>, res: Response<StatusResponse>) => {
        const result = await BlogService.UpdateBlogService(req.params.id, req.body)
        return res.sendStatus(result.status)
})

BlogRouter.delete('/:id', 
    authValidation,
    async (req: Request<RequestParamsType>, res: Response<StatusResponse>) => {
        const result = await BlogService.DeleteBlogService(req.params.id)
        return res.sendStatus(result.status)
})
