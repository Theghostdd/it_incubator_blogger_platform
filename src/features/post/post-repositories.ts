import {PostViewMongoModelType} from "./post-types";
import {DeleteResult} from "mongodb";
import {PostModel} from "../../Domain/Post/Post";


export class PostRepositories {
    constructor(
        protected postModel: typeof PostModel
    ) {
    }
    async save (post: InstanceType<typeof PostModel>): Promise<PostViewMongoModelType> {
        try {
            return await post.save()
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async delete (post: InstanceType<typeof PostModel>): Promise<DeleteResult> {
        try {
            return await post.deleteOne()
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async getPostById (id: string): Promise<InstanceType<typeof PostModel> | null> {
        try {
            return await this.postModel.findById(id)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}