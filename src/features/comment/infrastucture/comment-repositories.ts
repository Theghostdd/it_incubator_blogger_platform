import {DeleteResult} from "mongodb";
import {inject, injectable} from "inversify";
import {HydratedDocument} from "mongoose";
import {CommentDto} from "../domain/dto";
import {ICommentInstanceMethod} from "../domain/interfaces";
import {CommentModel} from "../domain/entity";

@injectable()
export class CommentRepositories {
    constructor(
        @inject(CommentModel) private commentModel: typeof CommentModel,
    ) {}

    async save (comment: HydratedDocument<CommentDto, ICommentInstanceMethod>): Promise<void> {
        await comment.save()
    }

    async delete(comment: HydratedDocument<CommentDto, ICommentInstanceMethod>): Promise<boolean> {
        const result: DeleteResult = await comment.deleteOne()
        if (result.deletedCount < 1) {
            throw new Error('Something went wrong')
        }
        return true
    }

    async getCommentById(id: string): Promise<HydratedDocument<CommentDto, ICommentInstanceMethod> | null> {
        return this.commentModel.findById(id)
    }
}