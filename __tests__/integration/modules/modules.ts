import {UserModel} from "../../../src/Domain/User/User";
import {AuthSessionModel} from "../../../src/Domain/Auth/Auth";
import {ObjectId} from "mongodb";
import {BlogModel} from "../../../src/Domain/Blog/Blog";
import {PostModel} from "../../../src/Domain/Post/Post";
import {CommentModel} from "../../../src/Domain/Comment/Comment";
import {RecoveryPasswordSessionModel} from "../../../src/Domain/RecoveryPasswordSession/RecoveryPasswordSession";




export const UserModule = {
    async CreateUserModule(data: any) {
        try {
            return await new UserModel(data).save()
        } catch (e: any) {
            console.error('CreateUserModule ', e)
        }
    },

    async GetAllSessionModule () {
        try {
            return await AuthSessionModel.find().lean()
        } catch (e: any) {
            console.error('GetAllSessionModule ', e)
        }
    },

    async GetSessionByFilterModule (filter: any) {
        try {
            return await AuthSessionModel.findOne(filter)
        } catch (e: any) {
            console.error('GetSessionByFilterModule ', e)
        }
    },

    async DeleteSessionByIdModule (id: string) {
        try {
            return await AuthSessionModel.findByIdAndDelete(id)
        } catch (e: any) {
            console.error('DeleteSessionByIdModule ', e)
        }
    },

    async UpdateSessionIssueAtByIdModule (id: ObjectId, issueAt: string) {
        try {
            const Session = new AuthSessionModel(await this.GetSessionByFilterModule({_id: id}))
            Session.issueAt = issueAt
            return await Session.save()
        } catch (e: any) {
            console.error('UpdateSessionIssueAtByIdModule ', e)
        }
    },

    async UpdateSessionUserIdByIdModule (id: ObjectId, userId: string) {
        try {
            const Session = new AuthSessionModel(await this.GetSessionByFilterModule({_id: id}))
            Session.userId = userId
            return await Session.save()
        } catch (e: any) {
            console.error('UpdateSessionUserIdByIdModule ', e)
        }
    },

    async GetAllUsersModule () {
        try {
            return await UserModel.find().lean()
        } catch (e: any) {
            console.error('GetAllUsersModule ', e)
        }
    }
}

export const BlogModule = {
    async CreateBlogModule(data: any) {
        try {
            return await new BlogModel(data).save()
        } catch (e: any) {
            console.error('CreateBlogModule ', e)
        }
    },
}

export const PostModule = {
    async CreatePostModule(data: any) {
        try {
            return await new PostModel(data).save()
        } catch (e: any) {
            console.error('CreatePostModule ', e)
        }
    },
}

export const CommentModule = {
    async CreateCommentModule(data: any) {
        try {
            return await new CommentModel(data).save()
        } catch (e: any) {
            console.error('CreateCommentModule ', e)
        }
    },

    async FindAllCommentModule() {
        try {
            return await CommentModel.find().lean()
        } catch (e: any) {
            console.error('FindAllCommentModule ', e)
        }
    },
}

export const RecoverPasswordSession = {
    async FindAllRecoverySession () {
        try {
            return RecoveryPasswordSessionModel.find().lean()
        } catch(e: any) {
            console.error('FindAllRecoverySession ', e)
        }
    }
}

export const Drop = {
    async DropAll () {
        await Promise.all([
             UserModel.deleteMany(),
             AuthSessionModel.deleteMany(),
             BlogModel.deleteMany(),
             PostModel.deleteMany(),
             CommentModel.deleteMany(),
             RecoveryPasswordSessionModel.deleteMany()
        ])
    }
}

export const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const UniversalFindAllModule = (model: any) => {
    try {
        return new model.find()
    } catch(e: any) {
        console.error('UniversalFindAllModule ', e)
    }
}