import request from "supertest"
import { app } from "../../../src/app"
import { ROUTERS_SETTINGS } from "../../../src/settings"
import { db } from "../../../src/Applications/ConnectionDB/Connection";

const GetRequest = () => {
    return request(app)
}

export const TestModules = {
    async LoginModule (endpoint: string, status: number, LoginData: any, InspectData: any) {
        const result = await GetRequest()
        .post(endpoint)
        .send(LoginData)
        .expect(status)
    return result.body
    },

    async CreateElement (endpoint: string, status: number, CreateData: any, InspectData: any) {
        const result = await GetRequest()
            .post(endpoint)
            .set({'Authorization': InspectData.headers.basic_auth})
            .send(CreateData)
            .expect(status)
        return result.body
    },

    async GetElementById (endpoint: string, status: number, id: string | number, InspectData: any) {
        const result = await GetRequest()
            .get(`${endpoint}/${id}`)
            .set({'Authorization': InspectData.headers.basic_auth})
            .expect(status)

        return result.body;
    },

    async GetAllElements (endpoint: string, status: number, query: any, InspectData: any) {
        const result = await GetRequest()
            .get(endpoint)
            .set({'Authorization': InspectData.headers.basic_auth})
            .query(query)
            .expect(status)
        return result.body;
    },

    async UpdateElementById (endpoint: string, status: number, id: string | number, UpdateData: any, InspectData: any) {
        const result = await GetRequest()
            .put(`${endpoint}/${id}`)
            .set({'Authorization': InspectData.headers.basic_auth})
            .send(UpdateData)
            .expect(status)
        return result.body;
    },

    async DeleteElementById (endpoint: string, status: number, id: string | number, InspectData: any) {
        const result = await GetRequest()
            .delete(`${endpoint}/${id}`)
            .set({'Authorization': InspectData.headers.basic_auth})
            .expect(status)
        return;
    },

    async DeleteAllElements () {
        const result = await GetRequest()
            .delete(`${ROUTERS_SETTINGS.TEST.test}/${ROUTERS_SETTINGS.TEST.test_all_data}`)
            .expect(204)
        return;
    },

    async InsertManyDataMongoDB (collection: string, data: any) {
        const result = await db.collection(collection).insertMany(data)
        return result
    }
} 