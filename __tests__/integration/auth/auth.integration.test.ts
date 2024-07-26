import { ObjectId } from "mongodb";
import { ResultNotificationEnum } from "../../../src/typings/basic-types";
import { AuthService } from "../../../src/Service/AuthService/AuthService";
import { MONGO_SETTINGS } from "../../../src/settings";
import { AuthDto, InsertAuthDto, RegistrationDto } from "../../Dto/AuthDto";
import {delay, Drop, RecoverPasswordSession, UserModule} from "../modules/modules";
import mongoose from "mongoose";
import {NodemailerService} from "../../../src/internal/application/nodlemailer/nodemailer";
import {addMinutes} from "date-fns";
import {AuthRepositories} from "../../../src/Repositories/AuthRepositories/AuthRepositories";

const RegistrationService = AuthService.RegistrationUser;
const LoginService = AuthService.AuthUser;
const JWTRefreshTokenAuthService = AuthService.JWTRefreshTokenAuth;
const RegistrationConfirm = AuthService.RegistrationUserConfirmUserByEmail;
const RegistrationResendConfirmCode = AuthService.RegistrationResendConfirmCodeToEmail;
const RecoveryPassService = AuthService.PasswordRecovery;
const ChangePassService = AuthService.ChangeUserPassword;


beforeAll(async () => {
    await mongoose.connect(MONGO_SETTINGS.URL, {dbName: MONGO_SETTINGS.DB_NAME})
})
afterAll(async () => {
    await mongoose.disconnect();
})

describe(LoginService, () => {
    let AuthData: any;
    let InsertOneUserData: any;
    let RegistrationData: any;

    beforeEach(async () => {
        jest.clearAllMocks()
        await Drop.DropAll()


        InsertOneUserData = structuredClone(InsertAuthDto.UserInsertData)
        AuthData = structuredClone(AuthDto.AuthUserData)
        RegistrationData = structuredClone(RegistrationDto.RegistrationUserData)
    })

    it('should auth-registration user, and create session for user, status: Success', async () => {
        const CreateUser = await UserModule.CreateUserModule(InsertOneUserData)

        const result = await LoginService(AuthData, '192.11.11', 'Chrome')
        expect(result.status).toBe(ResultNotificationEnum.Success)
        expect(result.data).toEqual({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
        })

        const CheckSession = await UserModule.GetAllSessionModule()
        expect(CheckSession!.length).toBe(1)
        expect(CheckSession![0]).toEqual({
            _id: expect.any(ObjectId),
            dId: expect.any(String),
            userId: CreateUser!._id.toString(),
            deviceName: expect.any(String),
            ip: expect.any(String),
            issueAt: expect.any(String),
            expAt: expect.any(String),
            __v: expect.any(Number)
        })
    })

    it('should not auth-registration user, login or email not found, session not be created, status: Unauthorized', async () => {
        const result = await LoginService(AuthData, '192.11.11', 'Chrome')
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const CheckSession = await UserModule.GetAllSessionModule()
        expect(CheckSession!.length).toBe(0)
    })

    it('should not auth-registration user, email not confirmed, session not be created, status: Bad Request', async () => {
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

        const CheckSession = await UserModule.GetAllSessionModule()
        expect(CheckSession!.length).toBe(0)
    })

    it('should not auth-registration user, password isn`t correct, session not be created, status: Unauthorized', async () => {
        await UserModule.CreateUserModule(InsertOneUserData)

        AuthData = {...AuthData, password: 'otherPassword'}
        const result = await LoginService(AuthData, '192.11.11', 'Chrome')
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const CheckSession = await UserModule.GetAllSessionModule()
        expect(CheckSession!.length).toBe(0)
    })

    it('should auth-registration user, from two devices, must be two sessions, status: Success', async () => {
        await UserModule.CreateUserModule(InsertOneUserData)
        await LoginService(AuthData, '191.22.33', 'Chrome')
        await delay(1000)
        await LoginService(AuthData, '191.01.23', 'MacOs')

        const CheckSession = await UserModule.GetAllSessionModule()
        expect(CheckSession!.length).toBe(2)
        expect(CheckSession![0]._id).not.toBe(CheckSession![1]._id)
        expect(CheckSession![0].dId).not.toBe(CheckSession![1].dId)
        expect(CheckSession![0].deviceName).not.toBe(CheckSession![1].deviceName)
        expect(CheckSession![0].ip).not.toBe(CheckSession![1].ip)
        expect(CheckSession![0].issueAt).not.toBe(CheckSession![1].issueAt)
        expect(CheckSession![0].userId).toBe(CheckSession![1].userId)
        expect(CheckSession![0].expAt).not.toBe(CheckSession![1].expAt)

    })
})

describe(AuthService.RefreshToken, () => {
    let AuthData: any;
    let InsertOneUserData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()

        InsertOneUserData = structuredClone(InsertAuthDto.UserInsertData)
        AuthData = structuredClone(AuthDto.AuthUserData)
    })

    it('should send to client new tokens pair, issueAt must be updated, status: Success', async () => {
        await UserModule.CreateUserModule(InsertOneUserData)
        const LoginUser = await LoginService(AuthData, '191.22.33', 'Chrome')
        const { refreshToken } = LoginUser.data!
        const FindFirstSession = await UserModule.GetAllSessionModule()
        await delay(1000)

        const result = await AuthService.RefreshToken(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Success)
        expect(result.data).toEqual({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
        })

        const FindSecondSession = await UserModule.GetAllSessionModule()
        expect(FindSecondSession![0].issueAt).not.toBe(FindFirstSession![0].issueAt)
    })

    it('should not send to client new tokens pair, bad token, issueAt must not be updated status: Unauthorized', async () => {
        await UserModule.CreateUserModule(InsertOneUserData)
        await LoginService(AuthData, '191.22.33', 'Chrome')
        const FindFirstSession = await UserModule.GetAllSessionModule()

        const result = await AuthService.RefreshToken('refreshToken')
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const FindSecondSession = await UserModule.GetAllSessionModule()
        expect(FindSecondSession![0].issueAt).toBe(FindFirstSession![0].issueAt)
    })

    it('should not send to client new tokens pair, session not found: Unauthorized', async () => {
        await UserModule.CreateUserModule(InsertOneUserData)
        const LoginUser = await LoginService(AuthData, '191.22.33', 'Chrome')
        const { refreshToken } = LoginUser.data!
        await AuthService.LogOut(refreshToken)

        const result = await AuthService.RefreshToken(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const FindSession = await UserModule.GetAllSessionModule()
        expect(FindSession!.length).toBe(0)
    })

    it('should not send to client new tokens pair, was send new refresh token to this valid token: Unauthorized', async () => {
        await UserModule.CreateUserModule(InsertOneUserData)
        const LoginUser = await LoginService(AuthData, '191.22.33', 'Chrome')
        const { refreshToken } = LoginUser.data!
        const FindFirstSession = await UserModule.GetAllSessionModule()
        await delay(1000)
        await AuthService.RefreshToken(refreshToken)
        const FindSecondSession = await UserModule.GetAllSessionModule()
        expect(FindSecondSession![0].issueAt).not.toBe(FindFirstSession![0].issueAt)

        const result = await AuthService.RefreshToken(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const FindSecondSessionAgain = await UserModule.GetAllSessionModule()
        expect(FindSecondSessionAgain![0].issueAt).toBe(FindSecondSession![0].issueAt)
    })

    it('should send to client new tokens pair to many devices, issueAt must be updated, status: Success', async () => {
        await UserModule.CreateUserModule(InsertOneUserData)
        const LoginUser = await LoginService(AuthData, '191.22.33', 'Chrome')
        const { refreshToken } = LoginUser.data!
        await delay(1000)
        const LoginUser2 = await LoginService(AuthData, '191.22.33', 'MacOs')
        const { refreshToken: refreshToken2 } = LoginUser2.data!

        const FindFirstSessions = await UserModule.GetAllSessionModule()

        await AuthService.RefreshToken(refreshToken)
        await delay(1000)
        await AuthService.RefreshToken(refreshToken2)

        const FindSecondSessions = await UserModule.GetAllSessionModule()

        expect(FindSecondSessions!.length).toBe(2)
        expect(FindFirstSessions![0]).not.toEqual(FindSecondSessions![0])
        expect(FindFirstSessions![1]).not.toEqual(FindSecondSessions![1])
    })


})

describe(AuthService.LogOut, () => {
    let AuthData: any;
    let InsertOneUserData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()

        InsertOneUserData = structuredClone(InsertAuthDto.UserInsertData)
        AuthData = structuredClone(AuthDto.AuthUserData)
    })

    it('should success logout client, session must be deleted status: Success', async () => {
        await UserModule.CreateUserModule(InsertOneUserData)
        const LoginUser = await LoginService(AuthData, '191.11.23', 'Chrome')
        const { refreshToken } = LoginUser.data!

        const result = await AuthService.LogOut(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const CheckSession = await UserModule.GetAllSessionModule()
        expect(CheckSession!.length).toBe(0)
    })

    it('should not logout client, bad token, session must be, status: Unauthorized', async () => {
        await UserModule.CreateUserModule(InsertOneUserData)
        await LoginService(AuthData, '191.11.23', 'Chrome')

        const result = await AuthService.LogOut('refreshToken')
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const CheckSession = await UserModule.GetAllSessionModule()
        expect(CheckSession!.length).toBe(1)
    })

    it('should not logout client, session not found, status: Unauthorized', async () => {
        await UserModule.CreateUserModule(InsertOneUserData)
        const LoginUser = await LoginService(AuthData, '191.11.23', 'Chrome')
        const { refreshToken } = LoginUser.data!
        await AuthService.LogOut(refreshToken)

        const result = await AuthService.LogOut(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const CheckSession = await UserModule.GetAllSessionModule()
        expect(CheckSession!.length).toBe(0)
    })

    it('should not logout client, not correct token, was get new token, status: Unauthorized', async () => {
        await UserModule.CreateUserModule(InsertOneUserData)
        const LoginUser = await LoginService(AuthData, '191.11.23', 'Chrome')
        const { refreshToken } = LoginUser.data!
        await delay(1000)
        await AuthService.RefreshToken(refreshToken)

        const result = await AuthService.LogOut(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)

        const CheckSession = await UserModule.GetAllSessionModule()
        expect(CheckSession!.length).toBe(1)
    })
})

describe(JWTRefreshTokenAuthService, () => {
    let AuthData: any;
    let InsertOneUserData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()

        InsertOneUserData = structuredClone(InsertAuthDto.UserInsertData)
        AuthData = structuredClone(AuthDto.AuthUserData)
    })

    it('should success send data, status: Success', async () => {
        await UserModule.CreateUserModule(InsertOneUserData)
        const LoginUser = await LoginService(AuthData, '191.11.23', 'Chrome')
        const { refreshToken } = LoginUser.data!

        const result = await JWTRefreshTokenAuthService(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Success)
    })

    it('should not send data, bad token, status: Unauthorized', async () => {
        const result = await JWTRefreshTokenAuthService('refreshToken')
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)
    })

    it('should not send data, session not found, status: Unauthorized', async () => {
        await UserModule.CreateUserModule(InsertOneUserData)
        const LoginUser = await LoginService(AuthData, '191.11.23', 'Chrome')
        const { refreshToken } = LoginUser.data!
        await AuthService.LogOut(refreshToken)

        const result = await JWTRefreshTokenAuthService(refreshToken)
        expect(result.status).toBe(ResultNotificationEnum.Unauthorized)
    })
})

describe(RegistrationService, () => {
    let RegistrationUserData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()

        RegistrationUserData = structuredClone(RegistrationDto.RegistrationUserData)
        NodemailerService.sendEmail = jest.fn().mockImplementation(() => Promise.resolve(true))
    })

    it('should registration user, status: Success', async () => {
        const result = await RegistrationService(RegistrationUserData)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const getCreatedUser = await UserModule.GetAllUsersModule()
        expect(getCreatedUser!.length).toBe(1)
        expect(getCreatedUser![0]).toEqual({
            _id: expect.any(ObjectId),
            login: RegistrationUserData.login,
            email: RegistrationUserData.email,
            password: expect.any(String),
            userConfirm: {
                ifConfirm: false,
                confirmationCode: expect.any(String),
                dataExpire: expect.any(String)
            },
            createdAt: expect.any(String),
            __v: expect.any(Number),
        })
    })

    it('should not registration user, status: Bad Request, not uniq login and email', async () => {
        const result = await RegistrationService(RegistrationUserData)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const resultSecond = await RegistrationService(RegistrationUserData)
        expect(resultSecond.status).toBe(ResultNotificationEnum.BadRequest)
        expect(resultSecond.errorField).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'login'
                },
                {
                    message: expect.any(String),
                    field: 'email'
                },
            ]
        })
        const getUser = await UserModule.GetAllUsersModule()
        expect(getUser!.length).toBe(1)
    })
})

describe(RegistrationConfirm, () => {
    let RegistrationUserData: any;
    let InsertOneUserData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()
        RegistrationUserData = structuredClone(RegistrationDto.RegistrationUserData)
        InsertOneUserData = structuredClone(InsertAuthDto.UserInsertData)
    })

    it('should confirm user by email, status: Success', async () => {
        await RegistrationService(RegistrationUserData)
        const GetUser = await UserModule.GetAllUsersModule()
        const confirmCode = GetUser![0].userConfirm.confirmationCode

        const result = await RegistrationConfirm({code: confirmCode})
        expect(result.status).toBe(ResultNotificationEnum.Success)
        const getUserAfterConfirm = await UserModule.GetAllUsersModule()
        expect(getUserAfterConfirm![0]).toEqual({
            _id: GetUser![0]._id,
            login: RegistrationUserData.login,
            email: RegistrationUserData.email,
            password: GetUser![0].password,
            userConfirm: {
                ifConfirm: true,
                confirmationCode: confirmCode,
                dataExpire: GetUser![0].userConfirm.dataExpire
            },
            createdAt: GetUser![0].createdAt,
            __v: expect.any(Number),
        })
    })

    it('should not confirm user by email, code not found, status: Bad Request', async () => {
        await RegistrationService(RegistrationUserData)
        const GetUser = await UserModule.GetAllUsersModule()

        const result = await RegistrationConfirm({code: 'some-code'})
        expect(result.status).toBe(ResultNotificationEnum.BadRequest)
        expect(result.errorField).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'code'
                }
            ]
        })

        const CheckCode =  await UserModule.GetAllUsersModule()
        expect(CheckCode![0].userConfirm.confirmationCode).toBe(GetUser![0].userConfirm.confirmationCode)
        expect(CheckCode![0].userConfirm.ifConfirm).toBe(false)
    })

    it('should not confirm user by email, code has been confirmed, status: Bad Request', async () => {
        await UserModule.CreateUserModule(InsertOneUserData)
        const GetUser = await UserModule.GetAllUsersModule()

        const result = await RegistrationConfirm({code: GetUser![0].userConfirm.confirmationCode})
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

    it('should not confirm user by email, code has expired, status: Bad Request', async () => {
        InsertOneUserData.userConfirm.ifConfirm = false
        await UserModule.CreateUserModule(InsertOneUserData)
        const GetUser = await UserModule.GetAllUsersModule()

        const result = await RegistrationConfirm({code: GetUser![0].userConfirm.confirmationCode})
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
})

describe(RegistrationResendConfirmCode, () => {
    let RegistrationUserData: any;
    let InsertOneUserData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()
        NodemailerService.sendEmail = jest.fn().mockImplementation(() => Promise.resolve(true))
        RegistrationUserData = structuredClone(RegistrationDto.RegistrationUserData)
        InsertOneUserData = structuredClone(InsertAuthDto.UserInsertData)
    })

    it('should resend confirm code to user by email, status: Success', async () => {
        await RegistrationService(RegistrationUserData)
        const GetUser = await UserModule.GetAllUsersModule()

        const result = await RegistrationResendConfirmCode({email: RegistrationUserData.email})
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const CheckUserField = await UserModule.GetAllUsersModule()
        expect(CheckUserField![0].userConfirm.confirmationCode).not.toBe(GetUser![0].userConfirm.confirmationCode)
        expect(CheckUserField![0].userConfirm.dataExpire).not.toBe(GetUser![0].userConfirm.dataExpire)

        expect(CheckUserField![0]).toEqual({
            _id: GetUser![0]._id,
            login: GetUser![0].login,
            password: GetUser![0].password,
            email: GetUser![0].email,
            userConfirm: {
                ifConfirm: false,
                confirmationCode: expect.any(String),
                dataExpire: expect.any(String)
            },
            createdAt: GetUser![0].createdAt,
            __v: expect.any(Number)
        })
    })

    it('should not resend confirm code to user by email, email not found, status: BadRequest', async () => {
        const result = await RegistrationResendConfirmCode({email: RegistrationUserData.email})
        expect(result.status).toBe(ResultNotificationEnum.BadRequest)
        expect(result.errorField).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'email'
                }
            ]
        })


    })

    it('should not resend confirm code to user by email, email has been confirmed status: BadRequest', async () => {
        InsertOneUserData.userConfirm.ifConfirm = true
        await UserModule.CreateUserModule(InsertOneUserData)
        const result = await RegistrationResendConfirmCode({email: InsertOneUserData.email})
        expect(result.status).toBe(ResultNotificationEnum.BadRequest)
        expect(result.errorField).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'email'
                }
            ]
        })


    })
})

describe(RecoveryPassService, () => {
    let recoveryData: any;

    beforeEach(async () => {
        jest.clearAllMocks()
        await Drop.DropAll()
        recoveryData = structuredClone(AuthDto.RecoveryPassData)
        NodemailerService.sendEmail = jest.fn().mockImplementation(() => Promise.resolve(true))
        await UserModule.CreateUserModule(structuredClone(InsertAuthDto.UserInsertData))
    })

    it('should send link for recovery password, status: Success', async () => {
        const result = await RecoveryPassService(recoveryData)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const findSession = await RecoverPasswordSession.FindAllRecoverySession()
        expect(findSession!.length).toBe(1)
        expect(findSession![0]).toEqual({
            _id: expect.any(ObjectId),
            email: recoveryData.email,
            code: expect.any(String),
            expAt: expect.any(String),
            __v: expect.any(Number)
        })
    })

    it('should send link for recovery password, but not creating session, status: Success', async () => {
        recoveryData.email = 'othermail@gmail.com'
        const result = await RecoveryPassService(recoveryData)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const findSession = await RecoverPasswordSession.FindAllRecoverySession()
        expect(findSession!.length).toBe(0)
    })
})

describe(ChangePassService, () => {
    let recoveryData: any;
    let UserData: any;
    let changePassData: any;
    beforeEach(async () => {
        jest.clearAllMocks()
        await Drop.DropAll()

        recoveryData = structuredClone(AuthDto.RecoveryPassData)
        await UserModule.CreateUserModule(structuredClone(InsertAuthDto.UserInsertData))
        UserData = structuredClone(RegistrationDto.RegistrationUserData)
        await RecoveryPassService(recoveryData)
        const getSession = await RecoverPasswordSession.FindAllRecoverySession()

        changePassData = structuredClone(AuthDto.NewPassData)
        changePassData.recoveryCode = getSession![0].code
    })

    it('should update password for user, status: Success', async () => {
        const getUserFirst = await UserModule.GetAllUsersModule()

        const result = await ChangePassService(changePassData)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const getUserSecond = await UserModule.GetAllUsersModule()
        expect(getUserSecond![0].password).not.toBe(getUserFirst![0].password)

        const getSession = await RecoverPasswordSession.FindAllRecoverySession()
        expect(getSession!.length).toBe(0)
    })

    it('should not update password for user, code not found, status: BadRequest', async () => {
        const getUserFirst = await UserModule.GetAllUsersModule()

        changePassData.recoveryCode = 'other-code'
        const result = await ChangePassService(changePassData)
        expect(result.status).toBe(ResultNotificationEnum.BadRequest)
        expect(result.errorField).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'recoveryCode'
                }
            ]
        })

        const getUserSecond = await UserModule.GetAllUsersModule()
        expect(getUserSecond![0].password).toBe(getUserFirst![0].password)
    })

    it('should not update password for user, code is not valid, status: BadRequest', async () => {
        const getUserFirst = await UserModule.GetAllUsersModule()
        AuthRepositories.GetRecoveryPasswordSessionByCode = jest.fn().mockImplementation(() => {
            return {
                email: recoveryData.email,
                code: changePassData.recoveryCode,
                expAt: '2022-07-06T13:41:33.211Z'
            }
        })

        const result = await ChangePassService(changePassData)
        expect(result.status).toBe(ResultNotificationEnum.BadRequest)
        expect(result.errorField).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'recoveryCode'
                }
            ]
        })

        const getUserSecond = await UserModule.GetAllUsersModule()
        expect(getUserSecond![0].password).toBe(getUserFirst![0].password)
    })

    it('should not update password for user, user not found, status: BadRequest', async () => {
        const getUserFirst = await UserModule.GetAllUsersModule()
        AuthRepositories.GetRecoveryPasswordSessionByCode = jest.fn().mockImplementation(() => {
            return {
                email: 'otheremail@mail.ru',
                code: changePassData.recoveryCode,
                expAt: addMinutes(new Date(), 10).toISOString()
            }
        })

        const result = await ChangePassService(changePassData)
        expect(result.status).toBe(ResultNotificationEnum.BadRequest)
        const getUserSecond = await UserModule.GetAllUsersModule()
        expect(getUserSecond![0].password).toBe(getUserFirst![0].password)
    })
})


