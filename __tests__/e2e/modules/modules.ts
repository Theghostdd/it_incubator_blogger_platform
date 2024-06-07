import request from "supertest"
import { app } from "../../../src/app"
import { SETTINGS } from "../../../src/settings"
import { InspectType } from '../../../src/Applications/Types/Types';
import { db } from "../../../src/Applications/ConnectionDB/Connection";

const GetRequest = () => {
    return request(app)
}

export const TestModules = {
    async CreateElement (endpoint: string, status: number, CreateData: any, InspectData: any) {
        const result = await GetRequest()
            .post(endpoint)
            .set({'Authorization': InspectData.headers.basic_auth})
            .send(CreateData)
            .expect(status)
        return result.body
    },

    async GetElementById (endpoint: string, status: number, id: string | number) {
        const result = await GetRequest()
            .get(`${endpoint}/${id}`)
            .expect(status)

        return result.body;
    },

    async GetAllElements (endpoint: string, status: number, query: any) {
        const result = await GetRequest()
            .get(endpoint)
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
            .delete(`${SETTINGS.PATH_TEST.TEST}/${SETTINGS.PATH_TEST.TEST_ALL_DATA}`)
            .expect(204)
        return;
    },

    async InsertManyDataMongoDB (collection: string, data: any) {
        const result = await db.collection(collection).insertMany(data)
        return result
    }
} 