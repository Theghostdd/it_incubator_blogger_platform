import { MONGO_SETTINGS, ROUTERS_SETTINGS } from "../../../src/settings";
import { TestModules } from "../modules/modules";

describe(ROUTERS_SETTINGS.AUTH.auth, () => {


    const endpointLogin: string = ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.login

    let InspectData: any;
    let query: any = {}
    let LoginData: any = {}
    let CreateDataUser: any = {}

    beforeEach(async () => {
        const result = await TestModules.DeleteAllElements()

        InspectData = {
            headers: {
                basic_auth: "Basic YWRtaW46cXdlcnR5"
            }
        }

        CreateDataUser = {
            login: 'TestLogin',
            password: "somePass",
            email: "example@mail.ru"
        }

        const CreateUserResult = await TestModules.CreateElement(ROUTERS_SETTINGS.USER.user, 201, CreateDataUser, InspectData)

        LoginData = {
            loginOrEmail: 'TestLogin',
            password: "somePass",
        }
    })

    afterAll(async () => {
        const result = await TestModules.DeleteAllElements()
    })

    it(`POST | User should login by Login or Email, status: 204`, async () => {
        let LoginUserResult = await TestModules.LoginModule(endpointLogin, 204, LoginData, InspectData)
        LoginData.loginOrEmail = "example@mail.ru"
        LoginUserResult = await TestModules.LoginModule(endpointLogin, 204, LoginData, InspectData)

    })

    it(`POST | User should\`t login by Login or Email, status: 401, incorrect login or email and password`, async () => {
        LoginData.loginOrEmail = "exampl4fse@mail.ru"
        let LoginUserResult = await TestModules.LoginModule(endpointLogin, 401, LoginData, InspectData)
        LoginData.loginOrEmail = "testlogin"
        LoginUserResult = await TestModules.LoginModule(endpointLogin, 401, LoginData, InspectData)
        LoginData = {
            loginOrEmail: 'TestLogin',
            password: "somePass23",
        }        
        LoginUserResult = await TestModules.LoginModule(endpointLogin, 401, LoginData, InspectData)
    })

    it(`POST | User should\`t login by Login or Email, status: 400, bad data login or email and password`, async () => {
        LoginData.loginOrEmail = ""
        let LoginUserResult = await TestModules.LoginModule(endpointLogin, 400, LoginData, InspectData)
        expect(LoginUserResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'loginOrEmail'
                }
            ]
        })

        LoginData.password = ""
        LoginUserResult = await TestModules.LoginModule(endpointLogin, 400, LoginData, InspectData)
        expect(LoginUserResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'loginOrEmail'
                },
                {
                    message: expect.any(String),
                    field: 'password'
                }
            ]
        })

    })


})

