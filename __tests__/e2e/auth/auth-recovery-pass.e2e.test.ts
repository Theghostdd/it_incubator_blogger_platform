import {ROUTERS_SETTINGS} from "../../../src/settings";
import {nodemailerService} from "../../../src/internal/application/nodlemailer/nodemailer";
import {
    CreateRecoveryPassCode,
    DropAll,
    FindAllUniversal,
    GetRequest,
    InsertOneUniversal
} from "../modules/modules";
import {AuthDto, InsertAuthDto, RegistrationDto} from "../../Dto/AuthDto";
import {UserModel} from "../../../src/Domain/User/User";
import {RecoveryPasswordSessionModel} from "../../../src/Domain/RecoveryPasswordSession/RecoveryPasswordSession";
import {userRepositories} from "../../../src/composition-root/user-composition-root";
import {
    recoveryPasswordSessionRepository
} from "../../../src/composition-root/auth-registration-composition-root";


describe(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.password_recovery, () => {

    const endpoint: string = ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.password_recovery

    let InsertUserData: any;
    let RecoveryData: any;

    beforeEach(async () => {
        jest.clearAllMocks()

        nodemailerService.sendEmail = jest.fn().mockImplementation(() => Promise.resolve(true))
        await DropAll()

        RecoveryData = structuredClone(AuthDto.RecoveryPassData)
        InsertUserData = structuredClone(InsertAuthDto.UserInsertData)
        await InsertOneUniversal(InsertUserData, UserModel)
    })

    it('POST | should send confirmation link to recovery pass, and send email, status: 204', async () => {
        // This simulates a scenario where user want to get recovery link for change pass
        await GetRequest()
            .post(endpoint)
            .send(RecoveryData)
            .expect(204)

        const getSession = await FindAllUniversal(RecoveryPasswordSessionModel)
        expect(getSession!.length).toBe(1)
    })

    it('POST | should send confirmation link to recovery pass, but not create session, email not found, status: 204', async () => {
        // This simulates a scenario where user want to get recovery link for change pass but email not found
        RecoveryData.email = 'otheremail@mail.ru'
        await GetRequest()
            .post(endpoint)
            .send(RecoveryData)
            .expect(204)

        const getSession = await FindAllUniversal(RecoveryPasswordSessionModel)
        expect(getSession!.length).toBe(0)
    })

    it('POST | should not send confirmation link to recovery pass, bad email, status: 400', async () => {
        // This simulates a scenario where user want to get recovery link for change pass but email was bad
        RecoveryData.email = 'other@'
        const result = await GetRequest()
            .post(endpoint)
            .send(RecoveryData)
            .expect(400)
        expect(result.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'email'
                }
            ]
        })
    })
})

describe(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.new_password, () => {

    const endpoint: string = ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.new_password
    const endpointAuth: string = ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.login

    let InsertUserData: any;
    let RecoveryData: any;
    let NewPassData: any;
    let AuthData: any;
    let RegData : any;
    beforeEach(async () => {
        jest.clearAllMocks()
        await DropAll()

        nodemailerService.sendEmail = jest.fn().mockImplementation(() => Promise.resolve(true))

        InsertUserData = structuredClone(InsertAuthDto.UserInsertData)
        await InsertOneUniversal(InsertUserData, UserModel)

        RecoveryData = structuredClone(AuthDto.RecoveryPassData)
        await CreateRecoveryPassCode(RecoveryData)

        const getSession = await FindAllUniversal(RecoveryPasswordSessionModel)
        NewPassData = structuredClone(AuthDto.NewPassData)
        NewPassData.recoveryCode = getSession![0].code

        AuthData = {
            loginOrEmail: RecoveryData.email,
            password: NewPassData.newPassword
        }

        RegData = structuredClone(RegistrationDto.RegistrationUserData)
    })

    it('POST | should change password, status: 204', async () => {
        // This simulates a scenario where user want to change password.
        await GetRequest()
            .post(endpoint)
            .send(NewPassData)
            .expect(204)

        const getSession = await FindAllUniversal(RecoveryPasswordSessionModel)
        expect(getSession!.length).toBe(0)
    })

    it('POST | should change password, and auth-registration with new password status: 204', async () => {
        // This simulates a scenario where user want to change password.
        await GetRequest()
            .post(endpoint)
            .send(NewPassData)
            .expect(204)

        const getSession = await FindAllUniversal(RecoveryPasswordSessionModel)
        expect(getSession!.length).toBe(0)

        // This simulates a scenario where user auth-registration with new pass.
        await GetRequest()
            .post(endpointAuth)
            .send(AuthData)
            .expect(200)
    })

    it('POST | should change password, and not auth-registration with old password status: 401', async () => {
        // This simulates a scenario where user want to change password.
        await GetRequest()
            .post(endpoint)
            .send(NewPassData)
            .expect(204)

        const getSession = await FindAllUniversal(RecoveryPasswordSessionModel)
        expect(getSession!.length).toBe(0)

        // This simulates a scenario where user auth-registration with old pass.
        AuthData.password = RegData.password
        await GetRequest()
            .post(endpointAuth)
            .send(AuthData)
            .expect(401)
    })

    it('POST | should not change password, bad code, status: 400', async () => {
        // This simulates a scenario where user want to change password but recovery code not found.
        NewPassData.recoveryCode = 'other-code'
        const result = await GetRequest()
            .post(endpoint)
            .send(NewPassData)
            .expect(400)
        expect(result.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'recoveryCode'
                },
            ]
        })

        const getSession = await FindAllUniversal(RecoveryPasswordSessionModel)
        expect(getSession!.length).toBe(1)
    })

    it('POST | should not change password, code was expire, status: 400', async () => {
        recoveryPasswordSessionRepository.getSessionByCode = jest.fn().mockImplementation(() => {
            return {
                email: InsertUserData.email,
                code: NewPassData.recoveryCode,
                expAt: '2022-07-06T13:41:33.211Z'
            }
        })
        // This simulates a scenario where user want to change password but recovery code was expire.
        const result = await GetRequest()
            .post(endpoint)
            .send(NewPassData)
            .expect(400)
        expect(result.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'recoveryCode'
                },
            ]
        })
    })

    it('POST | should not change password, bad data, status: 400', async () => {
        // This simulates a scenario where user want to change password but send bad data.
        NewPassData.recoveryCode = '';
        NewPassData.newPassword = '';

        const result = await GetRequest()
            .post(endpoint)
            .send(NewPassData)
            .expect(400)

        expect(result.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'newPassword'
                },
                {
                    message: expect.any(String),
                    field: 'recoveryCode'
                },
            ]
        })
    })

    it('POST | should not change password, user not found, status: 400', async () => {
        userRepositories.getUserByEmail = jest.fn().mockImplementation(() => null)
        // This simulates a scenario where user want to change password but user not found.
        await GetRequest()
            .post(endpoint)
            .send(NewPassData)
            .expect(400)
    })
})