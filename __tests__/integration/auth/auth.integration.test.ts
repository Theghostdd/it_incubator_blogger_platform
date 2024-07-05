import { ResultNotificationEnum } from "../../../src/Applications/Types-Models/BasicTypes";
import { AuthService } from "../../../src/Service/AuthService/AuthService";
import { MONGO_SETTINGS, ROUTERS_SETTINGS } from "../../../src/settings";
import { AuthDto, InsertDto, RegistrationDto } from "../modules/dto";
import { InsertData, dropCollections } from "../modules/modules";





const RegistrationService = AuthService.RegistrationUser;
const LoginService =  AuthService.AuthUser;
const RefreshToken = AuthService.RefreshToken;
const LogoutService = AuthService.LogOut;

const collectionUser = MONGO_SETTINGS.COLLECTIONS.users
const collectionTokenBlackList = MONGO_SETTINGS.COLLECTIONS.token_black_list



describe(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.login, () => {
    let AuthData: any;
    beforeEach( async () => {
        await dropCollections.dropUserCollection()
        AuthData = AuthDto.AuthUserData
    })

    it('should auth user, status: Success', async () => {
        await InsertData(InsertDto.UserInsertData, collectionUser)

        const result = await LoginService(AuthData)
        expect(result.status).toBe(ResultNotificationEnum.Success)
        expect(result.data).toEqual({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
        })
    })

    it('should not auth user, login or email not found, status: Unauthorized', async () => {
        const result = await LoginService(AuthData)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)
    })

    it('should not auth user, email not confirmed, status: Bad Request', async () => {
        await RegistrationService(RegistrationDto.RegistrationUserData)

        const result = await LoginService(AuthData)
        expect(result.status).toBe(ResultNotificationEnum.BadRequest)
        expect(result.errorField).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'code'
                }
            ]
        })
    })

    it('should not auth user, password isn`t correct, status: Unauthorized', async () => {
        await InsertData(InsertDto.UserInsertData, collectionUser)

        AuthData = {...AuthData, password:'otherPassword'}
        const result = await LoginService(AuthData)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)
    })
})

describe(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.refresh_token, () => {
    let AuthData: any;
    beforeEach( async () => {
        await dropCollections.dropUserCollection()
        AuthData = AuthDto.AuthUserData
    })

    it('should send to client new tokens pair, status: Success', async () => {
        await InsertData(InsertDto.UserInsertData, collectionUser)
        const LoginUser = await LoginService(AuthData)
        const { refreshToken } = LoginUser.data!


        const result = await RefreshToken(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Success)
        expect(result.data).toEqual({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
        })
    })

    it('should not send to client new tokens pair, bad token, status: Unauthorized', async () => {
        const result = await RefreshToken('refreshToken')
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)
    })

    it('should not send to client new tokens pair, token into black list status: Unauthorized', async () => {
        await InsertData(InsertDto.UserInsertData, collectionUser)
        const LoginUser = await LoginService(AuthData)
        const { refreshToken } = LoginUser.data!
        
        let result = await RefreshToken(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        result = await RefreshToken(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)
    })
})

describe(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.logout, () => {
    let AuthData: any;
    beforeEach( async () => {
        await dropCollections.dropUserCollection()
        AuthData = AuthDto.AuthUserData
    })

    it('should success logout client, status: Success', async () => {
        await InsertData(InsertDto.UserInsertData, collectionUser)
        const LoginUser = await LoginService(AuthData)
        const { refreshToken } = LoginUser.data!


        const result = await LogoutService(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Success)
    })

    it('should not logout client, bad token, status: Unauthorized', async () => {
        const result = await LogoutService('refreshToken')
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)
    })

    it('should not logout client, token into black list, status: Unauthorized', async () => {
        await InsertData(InsertDto.UserInsertData, collectionUser)
        const LoginUser = await LoginService(AuthData)
        const { refreshToken } = LoginUser.data!
        
        let result = await RefreshToken(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const LogoutResult = await LogoutService(refreshToken)
        expect(LogoutResult.status).toBe(ResultNotificationEnum.Unauthorized)
    })
})