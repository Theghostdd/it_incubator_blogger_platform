import { Router, Request, Response } from "express";
import { BlogRepos } from "../../Repositories/BlogRepo/BlogRepo";
import { body} from 'express-validator';
import { RuleValidations, inputValidation } from "../../Applications/Validations/inputValidations/InputValidations";
import { BlogInputType, RequestParamsType, GetResponse, GetAllResponse, StatusResponse} from "../../Applications/Types/Types";
import { authValidation } from "../../Applications/Validations/auth/auth";

export const BlogRouter = Router()

export const validationName = body('id').isNumeric().withMessage('ID must be a string');




BlogRouter.get('/', async (req: Request, res: Response<GetAllResponse | null>) => {
    const result = await BlogRepos.GetAllBlogs()
    return res.status(result.status).json(result.elements)
})

BlogRouter.get('/:id', async (req: Request<RequestParamsType>, res: Response<GetResponse | null>) => {
    const result = await BlogRepos.GetBlogById(req.params.id)
    return res.status(result.status).json(result.elements)
})

BlogRouter.post('/', 
    authValidation,
    RuleValidations.validDescription,
    RuleValidations.validName,
    RuleValidations.validWebsiteUrl,
    inputValidation,
    async (req: Request<any, any, BlogInputType>, res: Response<GetResponse | null>) => {
        const result = await BlogRepos.CreateBlog(req.body)
        return res.status(result.status).json(result.elements)
})

BlogRouter.put('/:id',
    authValidation,
    RuleValidations.validDescription,
    RuleValidations.validName,
    RuleValidations.validWebsiteUrl,
    inputValidation,
    async (req: Request<RequestParamsType, any, BlogInputType>, res: Response<StatusResponse>) => {
        const result = await BlogRepos.UpdateBlogById(req.params.id, req.body)
        return res.sendStatus(result.status)
})

BlogRouter.delete('/:id', 
    authValidation,
    async (req: Request<RequestParamsType>, res: Response<StatusResponse>) => {
        const result = await BlogRepos.DellBlogById(req.params.id)
        return res.sendStatus(result.status)
})
