import request from "supertest"
import { app } from "../../../src/app"
import { ROUTERS_SETTINGS } from "../../../src/settings"
import { db } from "../../../src/Applications/ConnectionDB/Connection";



export const AdminAuth: any = {
    Authorization: 'Basic YWRtaW46cXdlcnR5'
}

export const GetRequest = () => {
    return request(app)
}

export const DeleteAllDb = async () => {
    const result = await GetRequest()
        .delete(ROUTERS_SETTINGS.TEST.test + ROUTERS_SETTINGS.TEST.test_all_data)
    return result.body    
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

export const CreateManyDataUniversal = async (data: any, collectionName: string) => {
    return await db.collection(collectionName).insertMany(data)
}
