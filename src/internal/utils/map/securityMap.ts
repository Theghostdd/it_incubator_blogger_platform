import {SessionOutputModelViewType, SessionsMongoViewType} from "../../../features/auth-registration/auth-types";

export const securityMapper = {
    mapsDevices (data: SessionsMongoViewType[]): SessionOutputModelViewType[] {
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