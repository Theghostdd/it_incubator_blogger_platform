import {UserModel} from "../../Domain/User/User";
import {AuthSessionModel, RequestLimiterModel} from "../../Domain/Auth/Auth";
import {RecoveryPasswordSessionModel} from "../../Domain/RecoveryPasswordSession/RecoveryPasswordSession";
import {iTestRepositories} from "./test-interface";
import {BlogModel} from "../blog/domain/entity";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {CommentModel} from "../comment/domain/entity";
import {PostModel} from "../post/domain/entity";
import {LikeModel} from "../likes/domain/entity";


@injectable()
export class TestRepositories implements iTestRepositories {
    constructor(
       @inject(BlogModel) protected blogModel: typeof BlogModel,
       @inject(PostModel)protected postModel: typeof PostModel,
       @inject(UserModel)protected userModel: typeof UserModel,
       @inject(CommentModel)protected commentModel: typeof CommentModel,
       @inject(AuthSessionModel)protected authSessionModel: typeof AuthSessionModel,
       @inject(RequestLimiterModel)protected requestLimiterModel: typeof RequestLimiterModel,
       @inject(RecoveryPasswordSessionModel)protected recoveryPasswordSessionModel: typeof RecoveryPasswordSessionModel,
       @inject(LikeModel)protected likeModel: typeof LikeModel
    ) {}
    async deleteManyAllData (): Promise<void> {
        try {
            await Promise.all([
                this.blogModel.deleteMany({}),
                this.postModel.deleteMany({}),
                this.userModel.deleteMany({}),
                this.commentModel.deleteMany({}),
                this.authSessionModel.deleteMany({}),
                this.requestLimiterModel.deleteMany({}),
                this.recoveryPasswordSessionModel.deleteMany({}),
                this.likeModel.deleteMany({}),
            ])
            return
        } catch (e: any) {
            throw new Error(e)
        }
    }
}