import { MONGO_SETTINGS } from "../../../src/settings";
import { SecurityService } from '../../../src/Service/SecurityService/SecurityService'
import { AuthDto, InsertAuthDto } from "../../Dto/AuthDto";
import { AuthService } from "../../../src/Service/AuthService/AuthService";
import { ResultNotificationEnum } from "../../../src/typings/basic-types";
import { ObjectId } from "mongodb";
import { Drop, UserModule} from "../modules/modules";
import mongoose from "mongoose";

const DeleteSessionByIdService = SecurityService.DeleteSessionByDeviceId;
const DeleteAllSessionService = SecurityService.DeleteAllSessionExcludeCurrent;
const LoginService = AuthService.AuthUser;

beforeAll(async () => {
    await mongoose.connect(MONGO_SETTINGS.URL, {dbName: MONGO_SETTINGS.DB_NAME})
})
afterAll(async () => {
    await mongoose.disconnect();
})

describe(DeleteAllSessionService, () => {
    let token: any;
    let UserId: string;
    let SessionId: ObjectId

    beforeEach( async () => {
        jest.resetAllMocks();
        await Drop.DropAll()

        const InsertUser = await UserModule.CreateUserModule(structuredClone(InsertAuthDto.UserInsertData))
        UserId = InsertUser!._id.toString()
        const AuthUser = await LoginService(structuredClone(AuthDto.AuthUserData), '192.13.12', 'MacOS')
        token = AuthUser.data!.refreshToken
        const FindSession = await UserModule.GetAllSessionModule()
        SessionId = FindSession![0]._id

        await LoginService({...AuthDto.AuthUserData}, '195.13.12', 'Chrome')
        await LoginService({...AuthDto.AuthUserData}, '191.13.12', 'MacOS System')
        await LoginService({...AuthDto.AuthUserData}, '190.13.12', 'Windows')
    })

    it('should delete all sessions, exclude current session, status: Success', async () => {
        const result = await DeleteAllSessionService(token)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const FindAllSession = await UserModule.GetAllSessionModule()
        expect(FindAllSession!.length).toBe(1)
    })

    it('should not delete all sessions, bad token, status: Unauthorized', async () => {
        const result = await DeleteAllSessionService("token")
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const FindAllSession = await UserModule.GetAllSessionModule()
        expect(FindAllSession!.length).toBe(4)
    })

    it('should not delete all sessions, session not found, status: Unauthorized', async () => {
        await UserModule.DeleteSessionByIdModule(SessionId.toString())

        const result = await DeleteAllSessionService(token)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const FindAllSession = await UserModule.GetAllSessionModule()
        expect(FindAllSession!.length).toBe(3)
    })

    it('should not delete all sessions, session iat not token iat, status: Unauthorized', async () => {
        await UserModule.UpdateSessionIssueAtByIdModule(SessionId, '2023-07-06T13:41:33.211Z')

        const result = await DeleteAllSessionService(token)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const FindAllSession = await UserModule.GetAllSessionModule()
        expect(FindAllSession!.length).toBe(4)
    })
})

describe(DeleteSessionByIdService, () => {
    let token: any;
    let UserId: string;
    let deviceId: string;
    let sessionId: ObjectId;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()

        const InsertUser = await UserModule.CreateUserModule(structuredClone(InsertAuthDto.UserInsertData))
        UserId = InsertUser!._id.toString()
        const AuthUser = await LoginService(structuredClone(AuthDto.AuthUserData), '192.13.12', 'MacOS')
        token = AuthUser.data!.refreshToken
        const FindSession = await UserModule.GetAllSessionModule()
        deviceId = FindSession![0].dId
        sessionId = FindSession![0]._id
    })

    it('should delete session by ID, status: Success', async () => {
        const result = await DeleteSessionByIdService(deviceId, token)
        expect(result.status).toBe(ResultNotificationEnum.Success)
    })

    it('should not delete session by ID, bad token, status: Unauthorized', async () => {
        const result = await DeleteSessionByIdService(deviceId, "token")
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)
    })

    it('should not delete session by ID, session not found, status: Unauthorized', async () => {
        await UserModule.DeleteSessionByIdModule(sessionId.toString())

        const result = await DeleteSessionByIdService(deviceId, token)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)
    })

    it('should not delete session by ID, session iat not token iat, status: Unauthorized', async () => {
        await UserModule.UpdateSessionIssueAtByIdModule(sessionId, '2023-07-06T13:41:33.211Z')
        
        const result = await DeleteSessionByIdService(deviceId, token)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)
    })

    it('should not delete session by ID, session not user`s session, status: Forbidden', async () => {
        AuthService.JWTRefreshTokenAuth = jest.fn().mockImplementation(() => {
            return {
                status: ResultNotificationEnum.Success,
                data: {RefreshJWTPayload: {userId: new ObjectId(UserId)}}
            }
        })
        await UserModule.UpdateSessionUserIdByIdModule(sessionId, '5598e4097b81760274dadb6e')
        
        const result = await DeleteSessionByIdService(deviceId, token)
        expect(result.status).toBe(ResultNotificationEnum.Forbidden)
    })

})