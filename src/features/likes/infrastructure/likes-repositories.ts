import {inject, injectable} from "inversify";
import {HydratedDocument} from "mongoose";
import {LikeDto} from "../domain/dto";
import {ILikesInstanceMethods} from "../domain/interfaces";
import {LikeModel} from "../domain/entity";

@injectable()
export class LikesRepositories {
    constructor(
        @inject(LikeModel) private likeModel: typeof LikeModel
    ) {}

    async save (like: HydratedDocument<LikeDto, ILikesInstanceMethods>): Promise<void> {
        await like.save()
    }

    async getLikeByParentIdAndUserId(userId: string, parentId: string): Promise<HydratedDocument<LikeDto, ILikesInstanceMethods> | null> {
        return this.likeModel.findOne({userId: userId, parentId: parentId})
    }
}