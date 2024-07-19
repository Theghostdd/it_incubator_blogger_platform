import { ObjectId } from "mongodb";
import { ResultNotificationEnum } from "../../../src/Applications/Types-Models/BasicTypes";
import { AuthService } from "../../../src/Service/AuthService/AuthService";
import { MONGO_SETTINGS } from "../../../src/settings";
import { AuthDto, InsertAuthDto, RegistrationDto } from "../../Dto/AuthDto";
import { DropCollections, FindAllModule, FindOneModule, InsertOneDataModule } from "../../Modules/Body.Modules";

const RegistrationService = AuthService.RegistrationUser;
const LoginService = AuthService.AuthUser;
const JWTRefreshTokenAuthService = AuthService.JWTRefreshTokenAuth;
const collectionUser = MONGO_SETTINGS.COLLECTIONS.users
const collectionAuthSession = MONGO_SETTINGS.COLLECTIONS.auth_session


describe(LoginService, () => {
let AuthData: any;
let InsertOneUserData: any;
let RegistrationData: any;
beforeEach( async () => {
jest.clearAllMocks()
await DropCollections.DropUserCollection(),
await DropCollections.DropAuthSessionsCollection()


InsertOneUserData = {...InsertAuthDto.UserInsertData}
AuthData = {...AuthDto.AuthUserData}
RegistrationData = {...RegistrationDto.RegistrationUserData}
})

it('should auth user, and create session for user, status: Success', async () => {
const InsertData = await InsertOneDataModule(InsertOneUserData, collectionUser)

const result = await LoginService(AuthData, '192.11.11', 'Chrome')
expect(result.status).toBe(ResultNotificationEnum.Success)
expect(result.data).toEqual({
accessToken: expect.any(String),
refreshToken: expect.any(String)
})

const filterSessions = {userId: new ObjectId(InsertData.insertedId)}
const CheckSession = await FindOneModule(filterSessions, collectionAuthSession)
expect(CheckSession).toEqual({
_id: expect.any(ObjectId),
dId: expect.any(String),
userId: InsertData.insertedId,
deviceName: expect.any(String),
ip: expect.any(String),
issueAt: expect.any(String),
})
})

it('should not auth user, login or email not found, session not be created, status: Unauthorized', async () => {
const result = await LoginService(AuthData, '192.11.11', 'Chrome')
expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

const CheckSession = await FindAllModule({}, collectionAuthSession)
expect(CheckSession.length).toBe(0)
})

it('should not auth user, email not confirmed, session not be created, status: Bad Request', async () => {
await RegistrationService(RegistrationData)

const result = await LoginService(AuthData, '192.11.11', 'Chrome')
expect(result.status).toBe(ResultNotificationEnum.BadRequest)
expect(result.errorField).toEqual({
errorsMessages: [
{
message: expect.any(String),
field: 'code'
}
]
})

const CheckSession = await FindAllModule({}, collectionAuthSession)
expect(CheckSession.length).toBe(0)
})

it('should not auth user, password isn`t correct, session not be created, status: Unauthorized', async () => {
await InsertOneDataModule(InsertOneUserData, collectionUser)

AuthData = {...AuthData, password:'otherPassword'}
const result = await LoginService(AuthData, '192.11.11', 'Chrome')
expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

const CheckSession = await FindAllModule({}, collectionAuthSession)
expect(CheckSession.length).toBe(0)
})

it('should auth user, from two devices, must be two sessions, status: Success', async () => {
await InsertOneDataModule(InsertOneUserData, collectionUser)
await LoginService(AuthData, '191.22.33', 'Chrome')
await LoginService(AuthData, '191.01.23', 'MacOs')

const CheckSession = await FindAllModule({}, collectionAuthSession)
expect(CheckSession.length).toBe(2)
expect(CheckSession[0]._id).not.toBe(CheckSession[1]._id)
expect(CheckSession[0].dId).not.toBe(CheckSession[1].dId)
expect(CheckSession[0].deviceName).not.toBe(CheckSession[1].deviceName)
expect(CheckSession[0].ip).not.toBe(CheckSession[1].ip)
expect(CheckSession[0].issueAt).not.toBe(CheckSession[1].issueAt)
expect(CheckSession[0].userId).toStrictEqual(CheckSession[1].userId)
})
})

describe(AuthService.RefreshToken, () => {
    let AuthData: any;
    let InsertOneUserData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await DropCollections.DropUserCollection(),
        await DropCollections.DropAuthSessionsCollection()

        InsertOneUserData = {...InsertAuthDto.UserInsertData}
        AuthData = {...AuthDto.AuthUserData}
    })

    it('should send to client new tokens pair, issueAt must be updated, status: Success', async () => {
        const InsertData = await InsertOneDataModule(InsertOneUserData, collectionUser)
        const LoginUser = await LoginService(AuthData, '191.22.33', 'Chrome')
        const { refreshToken } = LoginUser.data!
        const filterSession = {userId: new ObjectId(InsertData.insertedId)}
        const FindFirstSession = await FindOneModule(filterSession, collectionAuthSession)

        const result = await AuthService.RefreshToken(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Success)
        expect(result.data).toEqual({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
        })

        const FindSecondSession = await FindOneModule(filterSession, collectionAuthSession)
        expect(FindSecondSession!.issueAt).not.toBe(FindFirstSession!.issueAt)
    })

    it('should not send to client new tokens pair, bad token, issueAt must not be updated status: Unauthorized', async () => {
        const InsertData = await InsertOneDataModule(InsertOneUserData, collectionUser)
        const LoginUser = await LoginService(AuthData, '191.22.33', 'Chrome')
        const filterSession = {userId: new ObjectId(InsertData.insertedId)}
        const FindFirstSession = await FindOneModule(filterSession, collectionAuthSession)


        const result = await AuthService.RefreshToken('refreshToken')
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const FindSecondSession = await FindOneModule(filterSession, collectionAuthSession)
        expect(FindSecondSession!.issueAt).toBe(FindFirstSession!.issueAt)
    })

    it('should not send to client new tokens pair, session not found: Unauthorized', async () => {
        await InsertOneDataModule(InsertOneUserData, collectionUser)
        const LoginUser = await LoginService(AuthData, '191.22.33', 'Chrome')
        const { refreshToken } = LoginUser.data!

        await AuthService.LogOut(refreshToken)
        let result = await AuthService.RefreshToken(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const FindSession = await FindAllModule({}, collectionAuthSession)
        expect(FindSession.length).toBe(0)
    })

    it('should not send to client new tokens pair, was send new refresh token to this valid token: Unauthorized', async () => {
        const InsertData = await InsertOneDataModule(InsertOneUserData, collectionUser)
        const LoginUser = await LoginService(AuthData, '191.22.33', 'Chrome')
        const { refreshToken } = LoginUser.data!
        const filterSession = {userId: new ObjectId(InsertData.insertedId)}
        const FindFirstSession = await FindOneModule(filterSession, collectionAuthSession)
        
        await AuthService.RefreshToken(refreshToken)
        const FindSecondSession = await FindOneModule(filterSession, collectionAuthSession)
        expect(FindSecondSession!.issueAt).not.toBe(FindFirstSession!.issueAt)

        const result = await AuthService.RefreshToken(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const FindSecondSessionAgain = await FindOneModule(filterSession, collectionAuthSession)
        expect(FindSecondSessionAgain!.issueAt).toBe(FindSecondSession!.issueAt)
    })

    it('should send to client new tokens pair to many devices, issueAt must be updated, status: Success', async () => {
        const InsertData = await InsertOneDataModule(InsertOneUserData, collectionUser)
        const LoginUser = await LoginService(AuthData, '191.22.33', 'Chrome')
        const { refreshToken } = LoginUser.data!
        const LoginUser2 = await LoginService(AuthData, '191.22.33', 'MacOs')
        const { refreshToken: refreshToken2 } = LoginUser2.data!

        const FindFirstSessions = await FindAllModule({}, collectionAuthSession)

        await AuthService.RefreshToken(refreshToken)
        await AuthService.RefreshToken(refreshToken2)

        const FindSecondSessions = await FindAllModule({}, collectionAuthSession)

        expect(FindSecondSessions.length).toBe(2)
        expect(FindFirstSessions[0]).not.toEqual(FindSecondSessions[0])
        expect(FindFirstSessions[1]).not.toEqual(FindSecondSessions[1])
    })


})

describe(AuthService.LogOut, () => {
    let AuthData: any;
    let InsertOneUserData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await DropCollections.DropUserCollection(),
        await DropCollections.DropAuthSessionsCollection()

        InsertOneUserData = {...InsertAuthDto.UserInsertData}
        AuthData = {...AuthDto.AuthUserData}
    })

    it('should success logout client, session must be deleted status: Success', async () => {
        await InsertOneDataModule(InsertOneUserData, collectionUser)
        const LoginUser = await LoginService(AuthData, '191.11.23', 'Chrome')
        const { refreshToken } = LoginUser.data!

        const result = await AuthService.LogOut(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const CheckSession = await FindAllModule({}, collectionAuthSession)
        expect(CheckSession.length).toBe(0)
    })

    it('should not logout client, bad token, session must be, status: Unauthorized', async () => {
        await InsertOneDataModule(InsertOneUserData, collectionUser)
        const LoginUser = await LoginService(AuthData, '191.11.23', 'Chrome')

        const result = await AuthService.LogOut('refreshToken')
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const CheckSession = await FindAllModule({}, collectionAuthSession)
        expect(CheckSession.length).toBe(1)
    })

    it('should not logout client, session not found, status: Unauthorized', async () => {
        await InsertOneDataModule(InsertOneUserData, collectionUser)
        const LoginUser = await LoginService(AuthData, '191.11.23', 'Chrome')
        const { refreshToken } = LoginUser.data!
        await AuthService.LogOut(refreshToken)

        const result = await AuthService.LogOut(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const CheckSession = await FindAllModule({}, collectionAuthSession)
        expect(CheckSession.length).toBe(0)
    })

    it('should not logout client, not correct token, was get new token, status: Unauthorized', async () => {
        await InsertOneDataModule(InsertOneUserData, collectionUser)
        const LoginUser = await LoginService(AuthData, '191.11.23', 'Chrome')
        const { refreshToken } = LoginUser.data!
        await AuthService.RefreshToken(refreshToken)

        const result = await AuthService.LogOut(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const CheckSession = await FindAllModule({}, collectionAuthSession)
        expect(CheckSession.length).toBe(1)
    })
})

describe(JWTRefreshTokenAuthService, () => {
    let AuthData: any;
    let InsertOneUserData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await DropCollections.DropUserCollection(),
        await DropCollections.DropAuthSessionsCollection()

        InsertOneUserData = {...InsertAuthDto.UserInsertData}
        AuthData = {...AuthDto.AuthUserData}
    })

    it('should success send data, status: Success', async () => {
        await InsertOneDataModule(InsertOneUserData, collectionUser)
        const LoginUser = await LoginService(AuthData, '191.11.23', 'Chrome')
        const { refreshToken } = LoginUser.data!

        const result = await JWTRefreshTokenAuthService(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Success)
        expect(result.data).toEqual({
            RefreshJWTPayload: {
                deviceId: expect.any(String),
                userId: expect.any(String),
                iat: expect.any(Number),
                exp: expect.any(Number),
            },
            SessionData: {
                _id: expect.any(ObjectId),
                dId: expect.any(String),
                userId: expect.any(ObjectId),
                deviceName: expect.any(String),
                ip: expect.any(String),
                issueAt: expect.any(String),
            }
        })
    })

    it('should not send data, bad token, status: Unauthorized', async () => {
        const result = await JWTRefreshTokenAuthService('refreshToken')
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)
    })

    it('should not send data, session not found, status: Unauthorized', async () => {
        await InsertOneDataModule(InsertOneUserData, collectionUser)
        const LoginUser = await LoginService(AuthData, '191.11.23', 'Chrome')
        const { refreshToken } = LoginUser.data!
        await AuthService.LogOut(refreshToken)

        const result = await JWTRefreshTokenAuthService(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)
    })

    it('should not logout client, not correct token, was get new token, status: Unauthorized', async () => {
        await InsertOneDataModule(InsertOneUserData, collectionUser)
        const LoginUser = await LoginService(AuthData, '191.11.23', 'Chrome')
        const { refreshToken } = LoginUser.data!
        await AuthService.RefreshToken(refreshToken)

        const result = await JWTRefreshTokenAuthService(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)
    })
})