import request from "supertest"
import { app } from "../../../src/app"
import {MONGO_SETTINGS, ROUTERS_SETTINGS} from "../../../src/settings"
import {AuthSessionModel, RequestLimiterModel} from "../../../src/Domain/Auth/Auth";
import {UserModel} from "../../../src/Domain/User/User";
import {CommentModel, LikeModel} from "../../../src/Domain/Comment/Comment";
import {BlogModel} from "../../../src/Domain/Blog/Blog";
import {PostModel} from "../../../src/Domain/Post/Post";
import mongoose from "mongoose";
import {RecoveryPasswordSessionModel} from "../../../src/Domain/RecoveryPasswordSession/RecoveryPasswordSession";



export const AdminAuth: any = {
    Authorization: 'Basic YWRtaW46cXdlcnR5'
}

beforeAll(async () => {
    await mongoose.connect(MONGO_SETTINGS.URL, {dbName: MONGO_SETTINGS.DB_NAME})
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