import {BlogModel} from "../../Domain/Blog/Blog";
import {PostModel} from "../../Domain/Post/Post";
import {UserModel} from "../../Domain/User/User";
import {CommentModel} from "../../Domain/Comment/Comment";
import {AuthSessionModel, RequestLimiterModel} from "../../Domain/Auth/Auth";
import {RecoveryPasswordSessionModel} from "../../Domain/RecoveryPasswordSession/RecoveryPasswordSession";


export const TestRepositories = {
    async deleteManyAllData () {
        try {
            await Promise.all([
                BlogModel.deleteMany({}),
                PostModel.deleteMany({}),
                UserModel.deleteMany({}),
                CommentModel.deleteMany({}),
                AuthSessionModel.deleteMany({}),
                RequestLimiterModel.deleteMany({}),
                RecoveryPasswordSessionModel.deleteMany({}),
            ])
            return 
        } catch (e: any) {
            throw new Error(e)
        }
    }
}