import {BlogModel} from "../../blog/domain/entity";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {CommentModel} from "../../comment/domain/entity";
import {PostModel} from "../../post/domain/entity";
import {LikeModel} from "../../likes/domain/entity";
import {UserModel} from "../../auth-registration/domain/user-entity";
import {AuthSessionModel} from "../../auth-registration/domain/session-entity";
import {RequestLimiterModel} from "../../request-limiter/domain/entity";
import {RecoveryPasswordSessionModel} from "../../auth-registration/domain/recovery-password-entity";


@injectable()
export class TestRepositories  {
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