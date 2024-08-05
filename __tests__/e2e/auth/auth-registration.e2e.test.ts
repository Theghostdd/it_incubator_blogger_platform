import { ROUTERS_SETTINGS } from "../../../src/settings"
import {AdminAuth, CreateUser, DropAll, GetRequest, InsertOneUniversal} from "../modules/modules"
import { addMinutes } from "date-fns"
import { InsertAuthDto, RegistrationDto } from "../../Dto/AuthDto";
import {container} from "../../../src/composition-root/composition-root";
import {NodemailerService} from "../../../src/internal/application/nodlemailer/nodemailer/nodemailer";
import {UserRepositories} from "../../../src/features/user/infrastructure/user-repositories";
import {UserModel} from "../../../src/features/auth-registration/domain/user-entity";



const nodemailerService = container.resolve(NodemailerService)

describe(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.registration, () => {

    const endpoint: string = ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.registration
    const endpointUsers: string = ROUTERS_SETTINGS.USER.user
    const endpointRegistrationConfirm: string = ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.registration_confirmation
    const endpointRegistrationResendConfirmationCode: string = ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.registration_email_resending

    let CreatedUserData: any = {}
    let InsertOneData: any = {}
    let ConfirmUserData: any = {}
    let ResendConfirmCodeData: any = {}

    beforeEach(async () => {
        nodemailerService.sendEmail = jest.fn().mockImplementation(() => Promise.resolve(true))
        await DropAll()
        
        CreatedUserData = {...RegistrationDto.RegistrationUserData}

        InsertOneData = {...InsertAuthDto.UserInsertData}
        InsertOneData.userConfirm.ifConfirm = false
        ConfirmUserData = {
            code: InsertOneData.userConfirm.confirmationCode
        }

        ResendConfirmCodeData = {
            email: InsertOneData.email
        }


    })

    it('POST => GET | should create new user, and send email, status: 204, get all user list, status: 200', async () => {
        // This simulates a scenario where user success registration in system
        await GetRequest()
            .post(endpoint)
            .send(CreatedUserData)
            .expect(204)
        // Get all the users for check success created user
        const GetAllUser = await GetRequest()
            .get(endpointUsers)
            .set(AdminAuth)
            .expect(200)
        expect(GetAllUser.body.items).toHaveLength(1)
    })

    it('POST | shouldn`t create new user, bad data, status: 400', async () => {
        // This simulates a scenario where user send bad data: login
        CreatedUserData.login = 'SomeeeeeeeeeeeLoginnnnnnnnnnnnn'
        let RegistrationUser = await GetRequest()
            .post(endpoint)
            .send(CreatedUserData)
            .expect(400)
        expect(RegistrationUser.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "login"
                }
            ]
        })
        // This simulates a scenario where user send bad data: login, email
        CreatedUserData.email = 'email.ru'
        RegistrationUser = await GetRequest()
            .post(endpoint)
            .send(CreatedUserData)
            .expect(400)
        expect(RegistrationUser.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "login"
                },
                {
                    message: expect.any(String),
                    field: "email"
                }
            ]
        })
        // This simulates a scenario where user send bad data: login, email, password
        CreatedUserData.password = ''
        RegistrationUser = await GetRequest()
            .post(endpoint)
            .send(CreatedUserData)
            .expect(400)
        expect(RegistrationUser.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "login"
                },
                {
                    message: expect.any(String),
                    field: "email"
                },
                {
                    message: expect.any(String),
                    field: "password"
                }
            ]
        })
    })

    it('POST | shouldn`t create new user, not uniq data, status: 400', async () => {
        await CreateUser(CreatedUserData)
        // This simulates a scenario where user send not uniq data: login and email
        const RegistrationUser = await GetRequest()
            .post(endpoint)
            .send(CreatedUserData)
            .expect(400)
        expect(RegistrationUser.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "login"
                }, 
                {
                    message: expect.any(String),
                    field: "email"
                }, 
            ]
        })
    })

    it('POST | should confirm new user, status: 204', async () => {
        // Crate user
        InsertOneData.userConfirm.dataExpire = addMinutes(new Date(), 1)
        await InsertOneUniversal(InsertOneData, UserModel)
        // This simulates a scenario where user confirmed email
        await GetRequest()
            .post(endpointRegistrationConfirm)
            .send(ConfirmUserData)
            .expect(204)
    })

    it('POST | shouldn`t confirm new user, bad confirm code, status: 400', async () => {
        // Create user
        InsertOneData.userConfirm.dataExpire = '2022-06-25T13:17:37.078Z'
        InsertOneData.userConfirm.ifConfirm = true
        await InsertOneUniversal(InsertOneData, UserModel)
        // This simulates a scenario where user does not confirm email, the date has expired
        let RegistrationUser = await GetRequest()
            .post(endpointRegistrationConfirm)
            .send(CreatedUserData)
            .expect(400)
        expect(RegistrationUser.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "code"
                }, 
            ]
        })
        // This simulates a scenario where user does not confirm email, user has been confirmed
        RegistrationUser = await GetRequest()
            .post(endpointRegistrationConfirm)
            .send(CreatedUserData)
            .expect(400)
        expect(RegistrationUser.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "code"
                }, 
            ]
        })   
        // This simulates a scenario where user does not confirm email, confirm code is not found
        ConfirmUserData.code = 'not code'
        RegistrationUser = await GetRequest()
            .post(endpointRegistrationConfirm)
            .send(CreatedUserData)
            .expect(400)
        expect(RegistrationUser.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "code"
                }, 
            ]
        })

        // This simulates a scenario where user does not confirm email, bad confirm code
        ConfirmUserData.code = ''
        RegistrationUser = await GetRequest()
            .post(endpointRegistrationConfirm)
            .send(CreatedUserData)
            .expect(400)
        expect(RegistrationUser.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "code"
                }, 
            ]
        })
    })

    it('POST | should resend confirmation code, status: 204', async () => {
        // Create user
        InsertOneData.userConfirm.ifConfirm = false
        await InsertOneUniversal(InsertOneData, UserModel)
        // This simulates a scenario where user want to get the new confirmation code
        await GetRequest()
            .post(endpointRegistrationResendConfirmationCode)
            .send(ResendConfirmCodeData)
            .expect(204)
    })

    it('POST | shouldn`t resend confirmation code, status: 400 and 404', async () => {
        // Create user
        InsertOneData.userConfirm.ifConfirm = true
        await InsertOneUniversal(InsertOneData, UserModel)
        // This simulates a scenario where user want to get the new confirmation code but email not found
        ResendConfirmCodeData.email = 'someemail@mail.ru'
        let RegistrationUser = await GetRequest()
            .post(endpointRegistrationResendConfirmationCode)
            .send(ResendConfirmCodeData)
            .expect(400)
        expect(RegistrationUser.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: "email"
                    }, 
                ]
            })
        ResendConfirmCodeData.email = InsertOneData.email
        // This simulates a scenario where user want to get the new confirmation code but email has been confirmed
        RegistrationUser = await GetRequest()
            .post(endpointRegistrationResendConfirmationCode)
            .send(ResendConfirmCodeData)
            .expect(400)
        expect(RegistrationUser.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "email"
                }, 
            ]
        })
        ResendConfirmCodeData.email = 'someemailmail.ru'
        // This simulates a scenario where the user wants to receive a new confirmation code without sending an incorrect email
        RegistrationUser = await GetRequest()
            .post(endpointRegistrationResendConfirmationCode)
            .send(ResendConfirmCodeData)
            .expect(400)
        expect(RegistrationUser.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "email"
                }, 
            ]
        })
    })

        

})