import { MONGO_SETTINGS, ROUTERS_SETTINGS } from "../../../src/settings"
import { AuthService } from "../../../src/Service/AuthService/AuthService"
import { RegistrationDto } from "../modules/dto";
import { ResultNotificationEnum } from "../../../src/Applications/Types-Models/BasicTypes";
import { dropCollections } from "../modules/modules";

import { db } from "../../../src/Applications/ConnectionDB/Connection";
import { ObjectId } from "mongodb";



const RegistrationService = AuthService.RegistrationUser;
const RegistrationConfirm = AuthService.RegistrationUserConfirmUserByEmail;
const RegistrationResendConfirmCode = AuthService.RegistrationResendConfirmCodeToEmail;
const collectionUser = MONGO_SETTINGS.COLLECTIONS.users

describe(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.registration, () => {
    beforeEach( async () => {
        await dropCollections.dropUserCollection()
    })

    it('should registration user, status: Success', async () => {
        const result = await RegistrationService(RegistrationDto.RegistrationUserData)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const getCreatedUser = await db.collection(collectionUser)
            .findOne({login: RegistrationDto.RegistrationUserData.login});
        expect(getCreatedUser).not.toBeNull()
        expect(getCreatedUser).toEqual({
            _id: expect.any(ObjectId),
            login: RegistrationDto.RegistrationUserData.login,
            email: RegistrationDto.RegistrationUserData.email,
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
        const result = await RegistrationService(RegistrationDto.RegistrationUserData)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const resultSecond = await RegistrationService(RegistrationDto.RegistrationUserData)
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
            .find({login: RegistrationDto.RegistrationUserData.login}).toArray();
        expect(getUser.length).toBe(1)
    })
})

describe(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.registration_confirmation, () => {
    beforeEach( async () => {
        await dropCollections.dropUserCollection()
    })

    it('should confirm user by email, status: Success', async () => {
        const CreateUser = await RegistrationService(RegistrationDto.RegistrationUserData)
        const GetUser = await db.collection(collectionUser)
            .findOne({login: RegistrationDto.RegistrationUserData.login})
        const confirmCode = GetUser!.userConfirm.confirmationCode
        
        const result = await RegistrationConfirm({code: confirmCode})
        expect(result.status).toBe(ResultNotificationEnum.Success)
        const getUserAfterConfirm = await db.collection(collectionUser)
            .findOne({_id: GetUser!._id})
        expect(getUserAfterConfirm).toEqual({
            _id: GetUser!._id,
            login: RegistrationDto.RegistrationUserData.login,
            email: RegistrationDto.RegistrationUserData.email,
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
        const CreateUser = await RegistrationService(RegistrationDto.RegistrationUserData)
        const getUser = await db.collection(collectionUser)
            .findOne({login: RegistrationDto.RegistrationUserData.login})
        await db.collection(collectionUser)
            .updateOne(
                {_id: getUser!._id}, 
                {$set: {'userConfirm.ifConfirm': true}}
            )

        const result = await RegistrationConfirm({code: getUser!.userConfirm.confirmationCode})
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
        const CreateUser = await RegistrationService(RegistrationDto.RegistrationUserData)
        const getUser = await db.collection(collectionUser)
            .findOne({login: RegistrationDto.RegistrationUserData.login})
        await db.collection(collectionUser)
            .updateOne(
                {_id: getUser!._id}, 
                {$set: {'userConfirm.dataExpire': '2000-01-01T00:00:00+02:00'}}
            )

        const result = await RegistrationConfirm({code: getUser!.userConfirm.confirmationCode})
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
    beforeEach( async () => {
        await dropCollections.dropUserCollection()
    })

    it('should resend confirm code to user by email, status: Success', async () => {
        const CreateUser = await RegistrationService(RegistrationDto.RegistrationUserData)
        const GetUser = await db.collection(collectionUser)
            .findOne({login: RegistrationDto.RegistrationUserData.login})
        
        const result = await RegistrationResendConfirmCode({email: RegistrationDto.RegistrationUserData.email})
        expect(result.status).toBe(ResultNotificationEnum.Success)
        const getUserAfterResend = await db.collection(collectionUser)
            .findOne({_id: GetUser!._id})
        expect(getUserAfterResend).toEqual({
            _id: GetUser!._id,
            login: RegistrationDto.RegistrationUserData.login,
            email: RegistrationDto.RegistrationUserData.email,
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