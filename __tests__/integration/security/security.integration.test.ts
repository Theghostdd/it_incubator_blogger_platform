import { MONGO_SETTINGS } from "../../../src/settings";
import { SecurityService } from '../../../src/Service/SecurityService/SecurityService'
import { DeleteOneModule, DropCollections, FindAllModule, FindAndUpdateModule, FindOneModule, InsertOneDataModule } from "../../Modules/Body.Modules";
import { AuthDto, InsertAuthDto } from "../../Dto/AuthDto";
import { AuthService } from "../../../src/Service/AuthService/AuthService";
import { ResultNotificationEnum } from "../../../src/Applications/Types-Models/BasicTypes";
import { ObjectId } from "mongodb";

const DeleteSessionByIdService = SecurityService.DeleteSessionByDeviceId;
const DeleteAllSessionService = SecurityService.DeleteAllSessionExcludeCurrent;
const LoginService = AuthService.AuthUser;


const collectionSession = MONGO_SETTINGS.COLLECTIONS.auth_session;
const collectionUser = MONGO_SETTINGS.COLLECTIONS.users;


describe(DeleteAllSessionService, () => {
    let token: any;
    let UserId: string;
    let SessionId: ObjectId

    beforeEach( async () => {
        jest.resetAllMocks();
        await DropCollections.DropAllCollections()

        const InsertUser = await InsertOneDataModule({...InsertAuthDto.UserInsertData}, collectionUser)
        UserId = InsertUser.insertedId.toString()
        const AuthUser = await LoginService({...AuthDto.AuthUserData}, '192.13.12', 'MacOS')
        token = AuthUser.data!.refreshToken
        const FindSession = await FindOneModule({userId: new ObjectId(UserId)}, collectionSession)
        SessionId = FindSession!._id

        await LoginService({...AuthDto.AuthUserData}, '195.13.12', 'Chrome')
        await LoginService({...AuthDto.AuthUserData}, '191.13.12', 'MacOS System')
        await LoginService({...AuthDto.AuthUserData}, '190.13.12', 'Windows')
    })

    it('should delete all sessions, exclude current session, status: Success', async () => {
        const result = await DeleteAllSessionService(token)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const FindAllSession = await FindAllModule({}, collectionSession)
        expect(FindAllSession.length).toBe(1)
    })

    it('should not delete all sessions, bad token, status: Unauthorized', async () => {
        const result = await DeleteAllSessionService("token")
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const FindAllSession = await FindAllModule({}, collectionSession)
        expect(FindAllSession.length).toBe(4)
    })

    it('should not delete all sessions, session not found, status: Unauthorized', async () => {
        await DeleteOneModule({_id: SessionId}, collectionSession)

        const result = await DeleteAllSessionService(token)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const FindAllSession = await FindAllModule({}, collectionSession)
        expect(FindAllSession.length).toBe(3)
    })

    it('should not delete all sessions, session iat not token iat, status: Unauthorized', async () => {
        await FindAndUpdateModule({_id: SessionId}, {$set: {issueAt: '2023-07-06T13:41:33.211Z'}}, collectionSession)
        
        const result = await DeleteAllSessionService(token)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const FindAllSession = await FindAllModule({}, collectionSession)
        expect(FindAllSession.length).toBe(4)
    })
})

describe(DeleteSessionByIdService, () => {
    let token: any;
    let UserId: string;
    let deviceId: string;
    beforeEach( async () => {
        jest.clearAllMocks()
        await DropCollections.DropAllCollections()

        const InsertUser = await InsertOneDataModule({...InsertAuthDto.UserInsertData}, collectionUser)
        UserId = InsertUser.insertedId.toString()
        const AuthUser = await LoginService({...AuthDto.AuthUserData}, '192.13.12', 'MacOS')
        token = AuthUser.data!.refreshToken
        const FindSession = await FindOneModule({userId: new ObjectId(UserId)}, collectionSession)
        deviceId = FindSession!.dId
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
        await DeleteOneModule({userId: new ObjectId(UserId)}, collectionSession)

        const result = await DeleteSessionByIdService(deviceId, token)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)
    })

    it('should not delete session by ID, session iat not token iat, status: Unauthorized', async () => {
        await FindAndUpdateModule({userId: new ObjectId(UserId)}, {$set: {issueAt: '2023-07-06T13:41:33.211Z'}}, collectionSession)
        
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
        await FindAndUpdateModule({dId: deviceId}, {$set: {userId: new ObjectId('5598e4097b81760274dadb6e')}}, collectionSession)
        
        const result = await DeleteSessionByIdService(deviceId, token)
        expect(result.status).toBe(ResultNotificationEnum.Forbidden)
    })

})