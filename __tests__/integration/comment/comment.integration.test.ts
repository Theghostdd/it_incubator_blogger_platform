import { CommentService } from '../../../src/Service/CommentService/CommentService'
import { MONGO_SETTINGS } from '../../../src/settings';
import { DropCollections, FindOneModule, InsertOneDataModule } from '../../Modules/Body.Modules';
import { CommentDto, InsertComment } from '../../Dto/CommentDto'
import { InsertAuthDto } from '../../Dto/AuthDto';
import { ResultNotificationEnum } from '../../../src/Applications/Types-Models/BasicTypes';
import { ObjectId } from 'mongodb';


const CommentUpdateService = CommentService.UpdateCommentById;
const CommentDeleteService = CommentService.DeleteCommentById;


const collectionComment = MONGO_SETTINGS.COLLECTIONS.comments;
const collectionUser = MONGO_SETTINGS.COLLECTIONS.users;
const collectionPost = MONGO_SETTINGS.COLLECTIONS.posts;

describe(CommentUpdateService, () => {
    let UpdateCommentData: any;
    let UserId: string;
    let CommentId: string;
    beforeEach( async () => {
        jest.clearAllMocks()
        await DropCollections.DropAllCollections()

        const InsertUser = await InsertOneDataModule({...InsertAuthDto.UserInsertData}, collectionUser)
        UserId = InsertUser.insertedId.toString()
        const InsertPost = await InsertOneDataModule({...InsertAuthDto.UserInsertData}, collectionPost)
        const PostId = InsertPost.insertedId.toString()

        InsertComment.InsertCommentData.postInfo.postId = PostId
        InsertComment.InsertCommentData.commentatorInfo.userId = UserId
        const InsertCommentResult = await InsertOneDataModule(InsertComment.InsertCommentData, collectionComment)
        UpdateCommentData = CommentDto.UpdateComment
        CommentId = InsertCommentResult.insertedId.toString()
    })

    it('should update comment, status: Success', async () => {
        const result = await CommentUpdateService(CommentId, UserId, UpdateCommentData)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const FindComment = await FindOneModule({content: UpdateCommentData.content}, collectionComment)
        expect(FindComment).not.toBeNull()
    })

    it('should not update comment, comment not found, status: NotFound', async () => {
        const result = await CommentUpdateService('5698203a57c3b467136215d8', UserId, UpdateCommentData)
        expect(result.status).toBe(ResultNotificationEnum.NotFound)

        const FindComment = await FindOneModule({content: UpdateCommentData.content}, collectionComment)
        expect(FindComment).toBeNull()
    })

    it('should not update comment, user id not user id in DB, status: Forbidden', async () => {
        const result = await CommentUpdateService(CommentId, '5698203a57c3b467136215d8', UpdateCommentData)
        expect(result.status).toBe(ResultNotificationEnum.Forbidden)

        const FindComment = await FindOneModule({content: UpdateCommentData.content}, collectionComment)
        expect(FindComment).toBeNull()
    })
})

describe(CommentDeleteService, () => {
    let UserId: string;
    let CommentId: string;
    beforeEach( async () => {
        jest.clearAllMocks()
        await DropCollections.DropAllCollections()

        const InsertUser = await InsertOneDataModule({...InsertAuthDto.UserInsertData}, collectionUser)
        UserId = InsertUser.insertedId.toString()
        const InsertPost = await InsertOneDataModule({...InsertAuthDto.UserInsertData}, collectionPost)
        const PostId = InsertPost.insertedId.toString()

        InsertComment.InsertCommentData.postInfo.postId = PostId
        InsertComment.InsertCommentData.commentatorInfo.userId = UserId
        const InsertCommentResult = await InsertOneDataModule(InsertComment.InsertCommentData, collectionComment)
        CommentId = InsertCommentResult.insertedId.toString()
    })

    it('should delete comment by ID, status: Success', async () => {
        const result = await CommentDeleteService(CommentId, UserId)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const FindComment = await FindOneModule({_id: new ObjectId(CommentId)}, collectionComment)
        expect(FindComment).toBeNull()
    })

    it('should not delete comment, comment not found, status: NotFound', async () => {
        const result = await CommentDeleteService('5698203a57c3b467136215d8', UserId)
        expect(result.status).toBe(ResultNotificationEnum.NotFound)

        const FindComment = await FindOneModule({_id: new ObjectId(CommentId)}, collectionComment)
        expect(FindComment).not.toBeNull()
    })

    it('should not update comment, user id not user id in DB, status: Forbidden', async () => {
        const result = await CommentDeleteService(CommentId, '5698203a57c3b467136215d8')
        expect(result.status).toBe(ResultNotificationEnum.Forbidden)

        const FindComment = await FindOneModule({_id: new ObjectId(CommentId)}, collectionComment)
        expect(FindComment).not.toBeNull()
    })
})