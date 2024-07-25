import {BlogModel} from "../../Domain/Blog/Blog";
import {PostModel} from "../../Domain/Post/Post";
import {UserModel} from "../../Domain/User/User";
import {CommentModel} from "../../Domain/Comment/Comment";
import {AuthSessionModel, RequestLimiterModel} from "../../Domain/Auth/Auth";
import {RecoveryPasswordSessionModel} from "../../Domain/RecoveryPasswordSession/RecoveryPasswordSession";
import {iTestRepositories} from "./test-interface";

export class TestRepositories implements iTestRepositories {
    constructor(
        protected blogModel: typeof BlogModel,
        protected postModel: typeof PostModel,
        protected userModel: typeof UserModel,
        protected commentModel: typeof CommentModel,
        protected authSessionModel: typeof AuthSessionModel,
        protected requestLimiterModel: typeof RequestLimiterModel,
        protected recoveryPasswordSessionModel: typeof RecoveryPasswordSessionModel,
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
            ])
            return
        } catch (e: any) {
            throw new Error(e)
        }
    }
}