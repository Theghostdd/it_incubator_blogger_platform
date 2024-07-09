import { MONGO_SETTINGS, ROUTERS_SETTINGS } from "../../../src/settings"
import { AuthService } from "../../../src/Service/AuthService/AuthService"
import { RegistrationDto } from "../modules/dto";
import { ResultNotificationEnum } from "../../../src/Applications/Types-Models/BasicTypes";
import { dropCollections } from "../modules/modules";
let sendEmail = require("../../../src/Applications/Nodemailer/nodemailer");
import { db } from "../../../src/Applications/ConnectionDB/Connection";
import { ObjectId } from "mongodb";



const RegistrationService = AuthService.RegistrationUser;
const RegistrationConfirm = AuthService.RegistrationUserConfirmUserByEmail;
const RegistrationResendConfirmCode = AuthService.RegistrationResendConfirmCodeToEmail;
const collectionUser = MONGO_SETTINGS.COLLECTIONS.users

describe(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.registration, () => {
    let RegistrationUserData: any;
    beforeEach( async () => {
        await dropCollections.dropUserCollection()
        RegistrationUserData = RegistrationDto.RegistrationUserData
        jest.clearAllMocks()
        sendEmail = jest.fn().mockResolvedValue(() => true)
    })

    it('should registration user, status: Success', async () => {
        const result = await RegistrationService(RegistrationUserData)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const getCreatedUser = await db.collection(collectionUser)
            .findOne({login: RegistrationUserData.login});
        expect(getCreatedUser).not.toBeNull()
        expect(getCreatedUser).toEqual({
            _id: expect.any(ObjectId),
            login: RegistrationUserData.login,
            email: RegistrationUserData.email,
            password: expect.any(String),
            userConfirm: {
                ifConfirm: false,
                confirmationCode: expect.any(String),
                dataExpire: expect.any(String)
            },
            createdAt: expect.any(String)
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

        const getUser = await db.collection(collectionUser)
            .find({login: RegistrationUserData.login}).toArray();
        expect(getUser.length).toBe(1)
    })
})

describe(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.registration_confirmation, () => {
    let RegistrationUserData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await dropCollections.dropUserCollection()
        RegistrationUserData = RegistrationDto.RegistrationUserData
    })

    it('should confirm user by email, status: Success', async () => {
        const CreateUser = await RegistrationService(RegistrationUserData)
        const GetUser = await db.collection(collectionUser)
            .findOne({login: RegistrationUserData.login})
        const confirmCode = GetUser!.userConfirm.confirmationCode
        
        const result = await RegistrationConfirm({code: confirmCode})
        expect(result.status).toBe(ResultNotificationEnum.Success)
        const getUserAfterConfirm = await db.collection(collectionUser)
            .findOne({_id: GetUser!._id})
        expect(getUserAfterConfirm).toEqual({
            _id: GetUser!._id,
            login: RegistrationUserData.login,
            email: RegistrationUserData.email,
            password: GetUser!.password,
            userConfirm: {
                ifConfirm: true,
                confirmationCode: confirmCode,
                dataExpire: GetUser!.userConfirm.dataExpire
            },
            createdAt: GetUser!.createdAt
        })
    })

    it('should not confirm user by email, code not found, status: Bad Request', async () => { 
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
    })

    it('should not confirm user by email, code has been confirmed, status: Bad Request', async () => { 
        const CreateUser = await RegistrationService(RegistrationUserData)
        const findAndUpdateUser = await db.collection(collectionUser)
            .findOneAndUpdate(
                {login: RegistrationUserData.login}, 
                {$set: {'userConfirm.ifConfirm': true}}, 
                {returnDocument: 'after'}
            )

        const result = await RegistrationConfirm({code: findAndUpdateUser!.userConfirm.confirmationCode})
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
        const CreateUser = await RegistrationService(RegistrationUserData)
        const findAndUpdateUser = await db.collection(collectionUser)
            .findOneAndUpdate(
                {login: RegistrationUserData.login},
                {$set: {'userConfirm.dataExpire': '2000-01-01T00:00:00+02:00'}},
                {returnDocument: 'after'}
            )


        const result = await RegistrationConfirm({code: findAndUpdateUser!.userConfirm.confirmationCode})
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

describe(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.registration_email_resending, () => {
    let RegistrationUserData: any;
    beforeEach( async () => {
        await dropCollections.dropUserCollection()
        RegistrationUserData = RegistrationDto.RegistrationUserData
        jest.clearAllMocks()
        sendEmail = jest.fn().mockResolvedValue(() => true)
    })

    it('should resend confirm code to user by email, status: Success', async () => {
        const CreateUser = await RegistrationService(RegistrationUserData)
        const GetUser = await db.collection(collectionUser)
            .findOne({login: RegistrationUserData.login})
        
        const result = await RegistrationResendConfirmCode({email: RegistrationUserData.email})
        expect(result.status).toBe(ResultNotificationEnum.Success)
        const getUserAfterResend = await db.collection(collectionUser)
            .findOne({_id: GetUser!._id})
        expect(getUserAfterResend).toEqual({
            _id: GetUser!._id,
            login: RegistrationUserData.login,
            email: RegistrationUserData.email,
            password: GetUser!.password,
            userConfirm: {
                ifConfirm: false,
                confirmationCode: expect.any(String),
                dataExpire: expect.any(String)
            },
            createdAt: GetUser!.createdAt
        })
        expect(getUserAfterResend!.userConfirm.confirmationCode).not.toBe(GetUser!.userConfirm.confirmationCode)
        expect(getUserAfterResend!.userConfirm.dataExpire).not.toBe(GetUser!.userConfirm.dataExpire)
    })
}) 