import { MONGO_SETTINGS } from "../../../src/settings";
import { PostService } from '../../../src/Service/PostService/PostService'
import { InsertPost, PostDto } from "../../Dto/PostDto";
import { BlogDto, BlogInsert } from "../../Dto/BlogDto";
import { ResultNotificationEnum } from "../../../src/Applications/Types-Models/BasicTypes";
import { InsertAuthDto } from "../../Dto/AuthDto";
import {BlogModule, Drop, PostModule, UserModule} from "../modules/modules";
import mongoose from "mongoose";

beforeAll(async () => {
    await mongoose.connect(MONGO_SETTINGS.URL, {dbName: MONGO_SETTINGS.DB_NAME})
})
afterAll(async () => {
    await mongoose.disconnect();
})

const PostCreateService = PostService.CreatePostItemByBlogId;
const PostUpdateService = PostService.UpdatePostById;
const PostDeleteService = PostService.DeletePostById;
const CreateCommentByPostIdService = PostService.CreateCommentByPostId;

describe(PostCreateService, () => {
    let CreatePostData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()
        const CreateBlog = await BlogModule.CreateBlogModule(structuredClone(BlogInsert.BlogInsertData))
        CreatePostData = structuredClone(PostDto.CreatePostData)
        CreatePostData.blogId = CreateBlog!._id.toString()
    })

    it('should create new Post, and return post item, status: Success', async () => {
        const result = await PostCreateService(CreatePostData)
        expect(result).toEqual({
            status: ResultNotificationEnum.Success,
            data: {
                id: expect.any(String),
                title: CreatePostData.title,
                shortDescription: CreatePostData.shortDescription,
                content: CreatePostData.content,
                blogId: CreatePostData.blogId,
                blogName: CreatePostData.blogName,
                createdAt: expect.any(String)
            }
        })
    })

    it('should not create new Post, status: NotFound', async () => {
        CreatePostData.blogId = '6697b3bb206b31770075052b';
        const result = await PostCreateService(CreatePostData)
        expect(result.status).toBe(ResultNotificationEnum.NotFound)
    })
})

describe(PostUpdateService, () => {
    let UpdatePostData: any;
    let InsertPostData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()
        const CreateBlog = await BlogModule.CreateBlogModule(structuredClone(BlogInsert.BlogInsertData))
        UpdatePostData = structuredClone(BlogDto.UpdateBlogData)
        UpdatePostData.blogId = CreateBlog!._id.toString()
        InsertPostData = structuredClone(InsertPost.InsertPostData)
        InsertPostData.blogId = CreateBlog!._id.toString()
    })

    it('should update post by id, status: Success', async () => {
        const InsertData = await PostModule.CreatePostModule(InsertPostData)

        const result = await PostUpdateService(InsertData!._id.toString(), UpdatePostData)
        expect(result.status).toBe(ResultNotificationEnum.Success)
    })

    it('should not update post by id, status: NotFound', async () => {
        const result = await PostUpdateService("5697b3bb206b31770075051b", UpdatePostData)
        expect(result.status).toBe(ResultNotificationEnum.NotFound)
    }) 
})

describe(PostDeleteService, () => {
    let InsertPostData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()
        const CreateBlog = await BlogModule.CreateBlogModule(structuredClone(BlogInsert.BlogInsertData))
        InsertPostData = structuredClone(InsertPost.InsertPostData)
        InsertPostData.blogId = CreateBlog!._id.toString()
    })

    it('should delete post by id, status: Success', async () => {
        const InsertData = await PostModule.CreatePostModule(InsertPostData)

        const result = await PostDeleteService(InsertData!._id.toString())
        expect(result.status).toBe(ResultNotificationEnum.Success)
    })

    it('should not delete post by id, status: NotFound', async () => {
        const result = await PostDeleteService("5697b3bb206b31770075051b")
        expect(result.status).toBe(ResultNotificationEnum.NotFound)
    }) 
})

describe(CreateCommentByPostIdService, () => {
    let CommentData: any;
    let PostId: string;
    let UserId: string;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()

        const CreateBlog = await BlogModule.CreateBlogModule(structuredClone(BlogInsert.BlogInsertData))
        const InsertPostData = structuredClone(InsertPost.InsertPostData)
        InsertPostData.blogId = CreateBlog!._id.toString()
        const CreatePost = await PostModule.CreatePostModule(InsertPostData)
        PostId = CreatePost!._id.toString()
        const CreateUser = await UserModule.CreateUserModule(structuredClone(InsertAuthDto.UserInsertData))
        UserId = CreateUser!._id.toString()
        CommentData = structuredClone(PostDto.CommentData)
    })

    it('should create comment by Post ID, status: Success', async () => {
        const result = await CreateCommentByPostIdService(CommentData, PostId, UserId)
        expect(result.status).toBe(ResultNotificationEnum.Success)
        expect(result.data).toEqual({
            id: expect.any(String),
            content: CommentData.content,
            commentatorInfo: {
                userId: UserId,
                userLogin: InsertAuthDto.UserInsertData.login
            },
            createdAt: expect.any(String)
        })
    })

    it('should not create comment by Post ID, user not found status: NotFound', async () => {
        const result = await CreateCommentByPostIdService(CommentData, PostId, '5697b5d550748cd875a4645b')
        expect(result.status).toBe(ResultNotificationEnum.NotFound)
    })

    it('should not create comment by Post ID, post not found status: NotFound', async () => {
        const result = await CreateCommentByPostIdService(CommentData, '5697b5d550748cd875a4645b', UserId)
        expect(result.status).toBe(ResultNotificationEnum.NotFound)
    })
})