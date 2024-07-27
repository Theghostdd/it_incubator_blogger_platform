import {CommentModel, LikeModel} from "../../Domain/Comment/Comment";
import {DeleteResult} from "mongodb";


export class CommentRepositories {

    constructor(
        protected commentModel: typeof CommentModel,
        protected likeModel: typeof LikeModel
    ) {}

    async save (comment: InstanceType<typeof CommentModel>): Promise<InstanceType<typeof CommentModel>> {
        try {
            return await comment.save()
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async delete (comment: InstanceType<typeof CommentModel>): Promise<DeleteResult> {
        try {
            return await comment.deleteOne()
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async getCommentById (id: string): Promise<InstanceType<typeof CommentModel> | null> {
        try {
            return await this.commentModel.findById(id)
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async getLikeByCommentIdAndUserId (userId: string, commentId: string): Promise<InstanceType<typeof LikeModel> | null> {
        try {
            return await this.likeModel.findOne({userId: userId, commentId: commentId})
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async saveLike (like: InstanceType<typeof LikeModel>): Promise<InstanceType<typeof LikeModel>> {
        try {
            return await like.save()
        } catch (e: any) {
            throw new Error(e)
        }
    }

}