import { Router, Request, Response } from "express";
import { RuleValidations, inputValidation } from "../../Applications/Validations/inputValidations/InputValidations";
import { RequestParamsType, ResponseType, GetAllResponse, StatusResponse} from "../../Applications/Types/Types";
import { BlogInputType, BlogPostInputType, BlogQueryRequestType } from '../../Applications/Types/BlogsTypes/BlogTypes'
import { authValidation } from "../../Applications/Validations/auth/auth";
import { BlogService } from "../../Service/BlogService";
import { BlogQueryRepos } from "../../Repositories/BlogRepo/BlogQueryRepo";

export const BlogRouter = Router()


BlogRouter.get('/', 
RuleValidations.validQueryPageSize,
RuleValidations.validQueryPageNumber,
RuleValidations.validQuerySortDirection,
RuleValidations.validSortBy,
inputValidation,
async (req: Request<{}, {}, {}, {}>, res: Response<GetAllResponse | null>) => {
// async (req: Request<{}, {}, {}, BlogQueryRequestType>, res: Response<GetAllResponse | null>) => {
    const result = await BlogQueryRepos.GetAllBlogs(req.query)
    return res.status(result.status).json(result.elements)
})


BlogRouter.get('/:id', async (req: Request<RequestParamsType>, res: Response<ResponseType | null>) => {
    const result = await BlogQueryRepos.GetBlogById(req.params.id)
    return res.status(result.status).json(result.elements)
})

BlogRouter.get('/:id/posts', async (req: Request<{}, {}, {}, BlogQueryRequestType>, res: Response<GetAllResponse | null>) => {
    
    return res.status(200).json(null)
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

BlogRouter.post('/:id/posts', 
    authValidation,
    RuleValidations.validTitle,
    RuleValidations.validShortDescription,
    RuleValidations.validContent,
    inputValidation,
    async (req: Request<{}, {}, BlogPostInputType>, res: Response<ResponseType | null>) => {
        
        return res.status(200).json(null)
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
