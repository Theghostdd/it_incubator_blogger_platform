import { MONGO_SETTINGS, ROUTERS_SETTINGS } from "../../../src/settings"
import { AuthService } from "../../../src/Service/AuthService/AuthService"
import { ResultNotificationEnum } from "../../../src/Applications/Types-Models/BasicTypes";
import { ObjectId } from "mongodb";
import { InsertAuthDto, RegistrationDto } from "../../Dto/AuthDto";
import { NodemailerService } from "../../../src/Applications/Nodemailer/nodemailer";
import { DropCollections, FindAllModule, FindAndUpdateModule, FindOneModule, InsertOneDataModule } from "../../Modules/Body.Modules";



const RegistrationService = AuthService.RegistrationUser;
const RegistrationConfirm = AuthService.RegistrationUserConfirmUserByEmail;
const RegistrationResendConfirmCode = AuthService.RegistrationResendConfirmCodeToEmail;
const collectionUser = MONGO_SETTINGS.COLLECTIONS.users

describe(RegistrationService, () => {
    let RegistrationUserData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await DropCollections.DropUserCollection()      
        RegistrationUserData = RegistrationDto.RegistrationUserData
        NodemailerService.sendEmail = jest.fn().mockImplementation(() => true)
    })

    it('should registration user, status: Success', async () => {
        const result = await RegistrationService(RegistrationUserData)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const filter = {login: RegistrationUserData.login}
        const getCreatedUser = await FindOneModule(filter, collectionUser)
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
        const filter = {login: RegistrationUserData.login}
        const getUser = await FindAllModule(filter, collectionUser)
        expect(getUser.length).toBe(1)
    })
})

describe(RegistrationConfirm, () => {
    let RegistrationUserData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await DropCollections.DropUserCollection()     
        RegistrationUserData = RegistrationDto.RegistrationUserData
    })

    it('should confirm user by email, status: Success', async () => {
        await RegistrationService(RegistrationUserData)
        const GetUser = await FindOneModule({login: RegistrationUserData.login}, collectionUser)
        const confirmCode = GetUser!.userConfirm.confirmationCode
        
        const result = await RegistrationConfirm({code: confirmCode})
        expect(result.status).toBe(ResultNotificationEnum.Success)
        const getUserAfterConfirm = await FindOneModule({_id: GetUser!._id}, collectionUser)
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
        await RegistrationService(RegistrationUserData)
        const GetUser = await FindOneModule({login: RegistrationUserData.login}, collectionUser)
        
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

        const CheckCode = await FindOneModule({_id: new ObjectId(GetUser!._id)}, collectionUser)
        expect(CheckCode!.userConfirm.confirmationCode).toBe(GetUser!.userConfirm.confirmationCode)
        expect(CheckCode!.userConfirm.ifConfirm).toBe(false)
    })

    it('should not confirm user by email, code has been confirmed, status: Bad Request', async () => { 
        await RegistrationService(RegistrationUserData)
        const findAndUpdateUser = await FindAndUpdateModule({login: RegistrationUserData.login}, {$set: {'userConfirm.ifConfirm': true}}, collectionUser)

        const result = await RegistrationConfirm(findAndUpdateUser!.userConfirm.confirmationCode)
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
        await RegistrationService(RegistrationUserData)
        const findAndUpdateUser = await FindAndUpdateModule(
                {login: RegistrationUserData.login},
                {$set: {'userConfirm.dataExpire': '2000-01-01T00:00:00+02:00'}},
                collectionUser
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

describe(RegistrationResendConfirmCode, () => {
    let RegistrationUserData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await DropCollections.DropUserCollection()
        NodemailerService.sendEmail = jest.fn().mockImplementation(() => true)
        RegistrationUserData = RegistrationDto.RegistrationUserData
    })

    it('should resend confirm code to user by email, status: Success', async () => {
        await RegistrationService(RegistrationUserData)
        const GetUser = await FindOneModule({login: RegistrationUserData.login}, collectionUser)

        const result = await RegistrationResendConfirmCode({email: RegistrationUserData.email})
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const CheckUserField = await FindOneModule({login: RegistrationUserData.login}, collectionUser)
        expect(CheckUserField!.userConfirm.confirmationCode).not.toBe(GetUser!.userConfirm.confirmationCode)
        expect(CheckUserField!.userConfirm.dataExpire).not.toBe(GetUser!.userConfirm.dataExpire)

        expect(CheckUserField).toEqual({
            _id: GetUser!._id,
            login: GetUser!.login,
            password: GetUser!.password,
            email: GetUser!.email,
            userConfirm: {
                ifConfirm: false,
                confirmationCode: expect.any(String),
                dataExpire: expect.any(String)
            },
            createdAt: GetUser!.createdAt
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
        await InsertOneDataModule(InsertAuthDto.UserInsertData, collectionUser)
        
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
}) 









