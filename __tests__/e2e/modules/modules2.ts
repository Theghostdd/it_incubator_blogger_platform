import request from "supertest"
import { app } from "../../../src/app"
import { ROUTERS_SETTINGS } from "../../../src/settings"
import { db } from "../../../src/Applications/ConnectionDB/Connection";



const AdminAuth: any = {
    Authorization: 'Basic YWRtaW46cXdlcnR5'
}

export const GetRequest = () => {
    return request(app)
}

export const TestModules2 = {
    async PostRequest (endpoint: string, status: number, queryData: any, bodyData: any, headersData: any) {
        const result = await GetRequest()
        .post(endpoint)
        .set(headersData)
        .query(queryData)
        .send(bodyData)
        .expect(status)
    return result.body
    },

    async GetRequest (endpoint: string, status: number, queryData: any, headersData: any) {
        const result = await GetRequest()
            .post(endpoint)
            .set(headersData)
            .query(queryData)
            .expect(status)
        return result.body
    },

    async PutRequest () {

    }, 

    async DeleteRequest () {

    }
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




export const DeleteAllDb = async () => {
    const result = await GetRequest()
        .delete(ROUTERS_SETTINGS.TEST.test + ROUTERS_SETTINGS.TEST.test_all_data)
    return result
}