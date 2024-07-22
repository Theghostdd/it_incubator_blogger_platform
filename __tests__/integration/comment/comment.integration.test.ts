import { CommentService } from '../../../src/Service/CommentService/CommentService'
import { MONGO_SETTINGS } from '../../../src/settings';
import { CommentDto, InsertComment } from '../../Dto/CommentDto'
import { InsertAuthDto } from '../../Dto/AuthDto';
import { ResultNotificationEnum } from '../../../src/Applications/Types-Models/BasicTypes';
import { ObjectId } from 'mongodb';
import mongoose from "mongoose";
import {BlogModule, CommentModule, Drop, PostModule, UserModule} from "../modules/modules";
import {UserModel} from "../../../src/Domain/User/User";
import {BlogInsert} from "../../Dto/BlogDto";
import {PostDto} from "../../Dto/PostDto";

beforeAll(async () => {
    await mongoose.connect(MONGO_SETTINGS.URL, {dbName: MONGO_SETTINGS.DB_NAME})
})
afterAll(async () => {
    await mongoose.disconnect();
})

const CommentUpdateService = CommentService.UpdateCommentById;
const CommentDeleteService = CommentService.DeleteCommentById;


describe(CommentUpdateService, () => {
    let UpdateCommentData: any;
    let UserId: string;
    let CommentId: string;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()

        const InsertUser = await UserModule.CreateUserModule(structuredClone(InsertAuthDto.UserInsertData))
        UserId = InsertUser!._id.toString()
        const CreateBlog = await BlogModule.CreateBlogModule(structuredClone(BlogInsert.BlogInsertData))
        const InsertPostData = structuredClone(PostDto.CreatePostData)
        InsertPostData.blogId = CreateBlog!._id.toString()
        const CreatePost = await PostModule.CreatePostModule(InsertPostData)
        const InsertCommentData = structuredClone(InsertComment.InsertCommentData)
        InsertCommentData.postInfo.postId = CreatePost!._id.toString()
        InsertCommentData.commentatorInfo.userId = UserId
        InsertCommentData.blogInfo.blogId = CreateBlog!._id.toString()
        const InsertCommentResult = await CommentModule.CreateCommentModule(InsertCommentData)
        UpdateCommentData = structuredClone(CommentDto.UpdateComment)
        CommentId = InsertCommentResult!._id.toString()
    })

    it('should update comment, status: Success', async () => {
        const result = await CommentUpdateService(CommentId, UserId, UpdateCommentData)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const FindComment = await CommentModule.FindAllCommentModule()
        expect(FindComment).not.toBeNull()
        expect(FindComment![0].content).toEqual(UpdateCommentData.content)
    })

    it('should not update comment, comment not found, status: NotFound', async () => {
        const result = await CommentUpdateService('5698203a57c3b467136215d8', UserId, UpdateCommentData)
        expect(result.status).toBe(ResultNotificationEnum.NotFound)
    })

    it('should not update comment, user id not user id in DB, status: Forbidden', async () => {
        const result = await CommentUpdateService(CommentId, '5698203a57c3b467136215d8', UpdateCommentData)
        expect(result.status).toBe(ResultNotificationEnum.Forbidden)
    })
})

describe(CommentDeleteService, () => {
    let UserId: string;
    let CommentId: string;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()

        const InsertUser = await UserModule.CreateUserModule(structuredClone(InsertAuthDto.UserInsertData))
        UserId = InsertUser!._id.toString()
        const CreateBlog = await BlogModule.CreateBlogModule(structuredClone(BlogInsert.BlogInsertData))
        const InsertPostData = structuredClone(PostDto.CreatePostData)
        InsertPostData.blogId = CreateBlog!._id.toString()
        const CreatePost = await PostModule.CreatePostModule(InsertPostData)
        const InsertCommentData = structuredClone(InsertComment.InsertCommentData)
        InsertCommentData.postInfo.postId = CreatePost!._id.toString()
        InsertCommentData.commentatorInfo.userId = UserId
        InsertCommentData.blogInfo.blogId = CreateBlog!._id.toString()
        const InsertCommentResult = await CommentModule.CreateCommentModule(InsertCommentData)
        CommentId = InsertCommentResult!._id.toString()
    })

    it('should delete comment by ID, status: Success', async () => {
        const result = await CommentDeleteService(CommentId, UserId)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const FindComment = await CommentModule.FindAllCommentModule()
        expect(FindComment!.length).toBe(0)
    })

    it('should not delete comment, comment not found, status: NotFound', async () => {
        const result = await CommentDeleteService('5698203a57c3b467136215d8', UserId)
        expect(result.status).toBe(ResultNotificationEnum.NotFound)

        const FindComment = await CommentModule.FindAllCommentModule()
        expect(FindComment).not.toBeNull()
    })

    it('should not update comment, user id not user id in DB, status: Forbidden', async () => {
        const result = await CommentDeleteService(CommentId, '5698203a57c3b467136215d8')
        expect(result.status).toBe(ResultNotificationEnum.Forbidden)

        const FindComment = await CommentModule.FindAllCommentModule()
        expect(FindComment).not.toBeNull()
    })
})