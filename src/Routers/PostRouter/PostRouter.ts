import { Router, Request, Response } from "express";
import { PostRepo } from "../../Repositories/PostRepo/PostRepo";
import { GetAllResponse, GetResponse, RequestParamsType, StatusResponse, PostInputType, PostViewType } from "../../Applications/Types/Types";
import { RuleValidations, inputValidation } from "../../Applications/Validations/inputValidations/InputValidations";
import { authValidation } from "../../Applications/Validations/auth/auth";


export const PostRouter = Router()

PostRouter.get('/', async (req: Request, res: Response<GetAllResponse | null>) => {
    const result = await PostRepo.GetAllPosts()
    return res.status(result.status).json(result.elements)
})

PostRouter.get('/:id', async (req: Request<RequestParamsType>, res: Response<GetResponse | null>) => {
    const result = await PostRepo.GetPostById(req.params.id)
    return res.status(result.status).json(result.elements)
})

PostRouter.post('/', 
    authValidation,
    RuleValidations.validTitle,
    RuleValidations.validShortDescription,
    RuleValidations.validContent,
    RuleValidations.validBlogId,
    inputValidation,
    async (req: Request<any, any, PostInputType>, res: Response<PostViewType | null>) => {
        const result = await PostRepo.CreatePost(req.body)
        return res.status(result.status).json(result.elements)
})

PostRouter.put('/:id', 
    authValidation,
    RuleValidations.validTitle,
    RuleValidations.validShortDescription,
    RuleValidations.validContent,
    RuleValidations.validBlogId,
    inputValidation,
    async (req: Request<RequestParamsType, any, PostInputType>, res: Response<StatusResponse | null>) => {
        const result = await PostRepo.UpdatePostById(req.params.id, req.body)
        return res.sendStatus(result.status)
})

PostRouter.delete('/:id', 
    authValidation,
    async (req: Request<RequestParamsType>, res: Response<StatusResponse | null>) => {
        const result = await PostRepo.DellPostById(req.params.id)
        return res.sendStatus(result.status)
})