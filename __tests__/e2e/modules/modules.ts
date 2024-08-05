import request from "supertest"
import { app } from "../../../src/app"
import {MONGO_SETTINGS, ROUTERS_SETTINGS} from "../../../src/settings"
import mongoose from "mongoose";
import {BlogModel} from "../../../src/features/blog/domain/entity";
import {UserModel} from "../../../src/features/auth-registration/domain/user-entity";
import {PostModel} from "../../../src/features/post/domain/entity";
import {AuthSessionModel} from "../../../src/features/auth-registration/domain/session-entity";
import {CommentModel} from "../../../src/features/comment/domain/entity";
import {RequestLimiterModel} from "../../../src/features/request-limiter/domain/entity";
import {RecoveryPasswordSessionModel} from "../../../src/features/auth-registration/domain/recovery-password-entity";
import {LikeModel} from "../../../src/features/likes/domain/entity";
import { MongoMemoryServer } from "mongodb-memory-server";



export const AdminAuth: any = {
    Authorization: 'Basic YWRtaW46cXdlcnR5'
}

beforeAll(async () => {
    await mongoose.connect(MONGO_SETTINGS.URL_CLOUD, {dbName: MONGO_SETTINGS.DB_NAME})
})
afterAll(async () => {
    await mongoose.disconnect();
})

export const GetRequest = () => {
    return request(app)
}

export const DropAll = async () => {
    await Promise.all([
        BlogModel.deleteMany({}),
        PostModel.deleteMany({}),
        UserModel.deleteMany({}),
        CommentModel.deleteMany({}),
        AuthSessionModel.deleteMany({}),
        RequestLimiterModel.deleteMany({}),
        RecoveryPasswordSessionModel.deleteMany({}),
        LikeModel.deleteMany({})
    ])
}

export const CreateUser = async (data: any) => {
    const result = await GetRequest()
        .post(ROUTERS_SETTINGS.USER.user)
        .set(AdminAuth)
        .send(data)
    return result.body
}

export const LoginUser = async (data: any) => {
    const result = await GetRequest()
        .post(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.login)
        .send(data)
    return result.body
}

export const CreateBlog = async (data: any) => {
    const result = await GetRequest()
        .post(ROUTERS_SETTINGS.BLOG.blogs)
        .set(AdminAuth)
        .send(data)
    return result.body
}

export const CreatedPost = async (data: any) => {
    const result = await GetRequest()
        .post(ROUTERS_SETTINGS.POST.post)
        .set(AdminAuth)
        .send(data)
    return result.body
}

export const RegistrationUser = async (data: any) => {
    const result = await GetRequest()
        .post(ROUTERS_SETTINGS.AUTH.auth +ROUTERS_SETTINGS.AUTH.registration)
        .send(data)
    return result.body
}

export const RegistrationConfirmCode = async (data: any) => {
    const result = await GetRequest()
        .post(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.registration_confirmation)
        .send(data)
    return result.body
}

export const RegistrationResendConfirmCode = async (data: any) => {
    const result = await GetRequest()
        .post(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.registration_email_resending)
        .send(data)
    return result.body
}

export const CreateRecoveryPassCode = async (data: any) => {
    const result = await GetRequest()
        .post(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.password_recovery)
        .send(data)
    return result.body
}

export const CreateManyDataUniversal = async (data: any, model: any) => {
    return await model.insertMany(data)
}

export const InsertOneUniversal =async (data: any, model: any) => {
    return await new model(data).save()
}

export const FindAllUniversal = async (model: any) => {
    return await model.find().lean()
}




export const likePost = async (id: string, status: string, token: string) => {
    const result = await GetRequest()
        .put(`${ROUTERS_SETTINGS.POST.post}/${id}${ROUTERS_SETTINGS.POST.like_status}`)
        .set({authorization: `Bearer ${token}`})
        .send({likeStatus: status})
    
    return result.body
}