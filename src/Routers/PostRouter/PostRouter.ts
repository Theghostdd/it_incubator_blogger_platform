import { Router, Request, Response } from "express";
import { GetAllResponse, ResponseType, RequestParamsType, StatusResponse } from "../../Applications/Types/Types";
import { PostInputType, PostViewType } from '../../Applications/Types/PostsTypes/PostTypes'
import { RuleValidations, inputValidation } from "../../Applications/Validations/inputValidations/InputValidations";
import { authValidation } from "../../Applications/Validations/auth/auth";
import { PostService } from "../../Service/PostService";
import { PostQueryRepo } from "../../Repositories/PostRepo/PostQueryRepo";


export const PostRouter = Router()

PostRouter.get('/', async (req: Request, res: Response<GetAllResponse | null>) => {
    const creatingPagination = await PostService.Pagination(req.query)
    const result = await PostQueryRepo.GetAllPosts(creatingPagination)
    return res.status(result.status).json(result.elements)
})

PostRouter.get('/:id', async (req: Request<RequestParamsType>, res: Response<ResponseType | null>) => {
    const result = await PostQueryRepo.GetPostById(req.params.id)
    return res.status(result.status).json(result.elements)
})

PostRouter.post('/', 
    authValidation,
    RuleValidations.validTitle,
    RuleValidations.validShortDescription,
    RuleValidations.validContent,
    RuleValidations.validBlogId,
    inputValidation,
    async (req: Request<{}, {}, PostInputType>, res: Response<PostViewType | null>) => {
        const result = await PostService.CreatePostService(req.body)
        return res.status(result.status).json(result.elements)
})

PostRouter.put('/:id', 
    authValidation,
    RuleValidations.validTitle,
    RuleValidations.validShortDescription,
    RuleValidations.validContent,
    RuleValidations.validBlogId,
    inputValidation,
    async (req: Request<RequestParamsType, {}, PostInputType>, res: Response<StatusResponse | null>) => {
        const result = await PostService.UpdatePostService(req.params.id, req.body)
        return res.sendStatus(result.status)
})

PostRouter.delete('/:id', 
    authValidation,
    async (req: Request<RequestParamsType>, res: Response<StatusResponse | null>) => {
        const result = await PostService.DeletePostService(req.params.id)
        return res.sendStatus(result.status)
})