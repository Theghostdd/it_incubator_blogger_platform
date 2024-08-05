import {DeleteResult} from "mongodb";
import {HydratedDocument} from "mongoose";
import {PostDto} from "../domain/dto";
import {PostModel} from "../domain/entity";
import {inject, injectable} from "inversify";
import {IPostInstanceMethod} from "../domain/interfaces";

@injectable()
export class PostRepositories {
    constructor(
        @inject(PostModel) private postModel: typeof PostModel
    ) {
    }
    async save (post: HydratedDocument<PostDto, IPostInstanceMethod>): Promise<void> {
            await post.save()
    }

    async delete (post: HydratedDocument<PostDto, IPostInstanceMethod>): Promise<boolean> {
        const result: DeleteResult = await post.deleteOne()
        if (result.deletedCount < 1) {
            throw new Error("Something went wrong")
        }
        return true
    }

    async getPostById (id: string): Promise<HydratedDocument<PostDto, IPostInstanceMethod> | null> {
        return this.postModel.findById(id)
    }
}