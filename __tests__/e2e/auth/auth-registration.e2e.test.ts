import { StatSyncFn } from "fs"
import { sendEmail } from "../../../src/Applications/Nodemailer/nodemailer"
import { ROUTERS_SETTINGS } from "../../../src/settings"
import { AdminAuth, DeleteAllDb, GetRequest } from "../modules/modules"


describe(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.registration, () => {

    const endpoint: string = ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.registration
    const endpointUsers: string = ROUTERS_SETTINGS.USER.user

    let AuthData: any = {}
    let CreatedUserData: any = {}
    let userId: string

    beforeEach(async () => {
        await DeleteAllDb()

        CreatedUserData = {
            login: 'SomeLogin',
            password: "SomePass",
            email: "example@mail.ru"
        }
        sendEmail: jest.fn(() => {
            return true
        })
        // const CreatedUserResult = await CreateUser(CreatedUserData)
        // userId = CreatedUserResult.id

        // const LoginData = {
        //     loginOrEmail: CreatedUserData.login,
        //     password: CreatedUserData.password,
        // }
        // const LoginUserResult = await LoginUser(LoginData)
        
        // AuthData = {
        //     Authorization: 'Bearer ' + LoginUserResult.accessToken
        // }
    })

    afterAll(async () => {
        await DeleteAllDb()
    })

    it('POST => GET | should create new user, and send email, status: 204, get all user list, status: 200', async () => {
        // This simulates a scenario where user success registration in system
        const RegistrationUser = await GetRequest()
            .post(endpoint)
            .send(CreatedUserData)
            .expect(204)

        const GetAllUser = await GetRequest()
            .get(endpointUsers)
            .set(AdminAuth)
            .expect(200)
        expect(GetAllUser.body.items).toHaveLength(1)

    })

})