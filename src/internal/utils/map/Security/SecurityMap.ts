import { SessionOutputModelViewType, SessionsMongoViewType } from "../../../Applications/Types-Models/Auth/AuthTypes"



export const SecurityMapper = { 
    /*
    * Maps the sessions data (`data`) from `SessionsMongoViewType` to `SessionOutputModelViewType`.
    * Returns an array of `SessionOutputModelViewType` objects, each representing a mapped session.
    */
    async MapsDevices (data: SessionsMongoViewType[]): Promise<SessionOutputModelViewType[]> {
        return data.map((items) => {
            return {
                ip: items.ip,
                title: items.deviceName,
                lastActiveDate: items.issueAt,
                deviceId: items.dId
            }
        })
    },
}