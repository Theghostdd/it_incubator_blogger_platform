import { MONGO_SETTINGS } from "../../../src/settings";
import { PostService } from '../../../src/Service/PostService/PostService'
import { DropCollections, InsertOneDataModule } from "../../Modules/Body.Modules";
import { InsertPost, PostDto } from "../../Dto/PostDto";
import { BlogDto, BlogInsert } from "../../Dto/BlogDto";
import { ResultNotificationEnum } from "../../../src/Applications/Types-Models/BasicTypes";
import { InsertAuthDto } from "../../Dto/AuthDto";

const PostCreateService = PostService.CreatePostItemByBlogId;
const PostUpdateService = PostService.UpdatePostById;
const PostDeleteService = PostService.DeletePostById;
const CreateCommentByPostIdService = PostService.CreateCommentByPostId;

const collectionPost = MONGO_SETTINGS.COLLECTIONS.posts;
const collectionBlog = MONGO_SETTINGS.COLLECTIONS.blogs;
const collectionComment = MONGO_SETTINGS.COLLECTIONS.comments;
const collectionUser = MONGO_SETTINGS.COLLECTIONS.users

describe(PostCreateService, () => {
    let CreatePostData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await DropCollections.DropAllCollections()
        const CreateBlog = await InsertOneDataModule({...BlogInsert.BlogInsertData}, collectionBlog)
        CreatePostData = {...PostDto.CreatePostData}
        CreatePostData.blogId = CreateBlog.insertedId.toString()
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
    beforeEach( async () => {
        jest.clearAllMocks()
        await DropCollections.DropAllCollections()
        const CreateBlog = await InsertOneDataModule({...BlogInsert.BlogInsertData}, collectionBlog)
        UpdatePostData = {...BlogDto.UpdateBlogData}
        UpdatePostData.blogId = CreateBlog.insertedId.toString()
    })

    it('should update post by id, status: Success', async () => {
        const InsertData = await InsertOneDataModule(InsertPost.InsertPostData, collectionPost)

        const result = await PostUpdateService(InsertData.insertedId.toString(), UpdatePostData)
        expect(result.status).toBe(ResultNotificationEnum.Success)
    })

    it('should not update post by id, status: NotFound', async () => {
        const result = await PostUpdateService("5697b3bb206b31770075051b", UpdatePostData)
        expect(result.status).toBe(ResultNotificationEnum.NotFound)
    }) 
})

describe(PostDeleteService, () => {
    beforeEach( async () => {
        jest.clearAllMocks()
        await DropCollections.DropAllCollections()
    })

    it('should delete post by id, status: Success', async () => {
        const InsertData = await InsertOneDataModule(InsertPost.InsertPostData, collectionPost)

        const result = await PostDeleteService(InsertData.insertedId.toString())
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
        await DropCollections.DropAllCollections()

        let InsertData = await InsertOneDataModule(InsertPost.InsertPostData, collectionPost)
        PostId = InsertData.insertedId.toString()
        InsertData = await InsertOneDataModule(InsertAuthDto.UserInsertData, collectionUser)
        UserId = InsertData.insertedId.toString()
        CommentData = PostDto.CommentData
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