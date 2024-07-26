import {CommentModel} from "../../Domain/Comment/Comment";
import {CommentMongoViewType} from "./comment-types";
import {DeleteResult} from "mongodb";


export class CommentRepositories {

    constructor(
        protected commentModel: typeof CommentModel
    ) {}

    async save (comment: InstanceType<typeof CommentModel>): Promise<CommentMongoViewType> {
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

}