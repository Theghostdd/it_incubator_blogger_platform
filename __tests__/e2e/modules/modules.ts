import request from "supertest"
import { app } from "../../../src/app"
import { SETTINGS } from "../../../src/settings"
import { InspectType } from '../../../src/Applications/Types/Types';

const GetRequest = () => {
    return request(app)
}

export const TestModules = {
    async CreateElement (endpoint: string, data: any, inspectData: InspectType) {
        const result = await GetRequest()
            .post(endpoint)
            .set({'Authorization': inspectData.headers.basic_auth})
            .send(data)
            .expect(inspectData.status)
        
        if (inspectData.status === 200) {
            expect(result.body).toEqual(inspectData.checkValues)
        }
        return result.body
    },

    async GetElementById (endpoint: string, id: string | number, inspectData: InspectType) {
        const result = await GetRequest()
            .get(`${endpoint}/${id}`)
            .expect(inspectData.status)

        if (inspectData.status === 200) {
            expect(result.body).toEqual(inspectData.checkValues)
        }
        return;
    },

    async GetAllElements (endpoint: string, inspectData: InspectType) {
        const result = await GetRequest()
            .get(endpoint)
            .expect(inspectData.status)

        if (inspectData.status === 200) {
            expect(result.body.length).toBe(2)
        }
        return;
    },

    async UpdateElementById (endpoint: string, id: string | number, data: any, inspectData: InspectType) {
        const result = await GetRequest()
            .put(`${endpoint}/${id}`)
            .set({'Authorization': inspectData.headers.basic_auth})
            .send(data)
            .expect(inspectData.status)
        return;
    },

    async DeleteElementById (endpoint: string, id: string | number, inspectData: InspectType) {
        const result = await GetRequest()
            .delete(`${endpoint}/${id}`)
            .set({'Authorization': inspectData.headers.basic_auth})
            .expect(inspectData.status)
        return;
    },

    async DeleteAllElements () {
        const result = await GetRequest()
            .delete(`${SETTINGS.PATH_TEST.TEST}/${SETTINGS.PATH_TEST.TEST_ALL_DATA}`)
            .expect(204)
        return;
    }
} 