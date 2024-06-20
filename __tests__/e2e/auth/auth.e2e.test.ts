import { ROUTERS_SETTINGS } from "../../../src/settings";
import { CreateUser, DeleteAllDb, GetRequest, LoginUser } from "../modules/modules";

describe(ROUTERS_SETTINGS.AUTH.auth, () => {

    const endpointAuth: string = ROUTERS_SETTINGS.AUTH.auth
    const endpointLogin: string = ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.login
    const endpointMe: string = ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.me
    let LoginData: any = {}
    let CreateUserData: any = {}
    let UserID: string

    beforeEach(async () => {
        await DeleteAllDb()

        CreateUserData = {
            login: 'TestLogin',
            email: "example@mail.ru",
            password: "somePass"
        }

        const CreateUserResult = await CreateUser(CreateUserData)
        UserID = CreateUserResult.id

        LoginData = {
            loginOrEmail: CreateUserData.login,
            password: CreateUserData.password,
        }
    })

    afterAll(async () => {
        await DeleteAllDb()
    })

    it(`POST | User should login by Login or Email, status: 200`, async () => {
        // This simulates a scenario where the user provides a valid login and password.
        const LoginByLoginResult = await GetRequest()
            .post(endpointLogin)
            .send(LoginData)
            .expect(200)

        expect(LoginByLoginResult.body).toEqual({
            accessToken: expect.any(String)
        })

        // This simulates a scenario where the user provides a valid email and password.
        LoginData.loginOrEmail = CreateUserData.email
        const LoginByEmailResult = await GetRequest()
            .post(endpointLogin)
            .send(LoginData)
            .expect(200)

        expect(LoginByEmailResult.body).toEqual({
            accessToken: expect.any(String)
        })
    })

    it(`POST | User should\`t login by Login or Email, status: 401, incorrect login or email and password`, async () => {
        // This simulates a scenario where the user provides an email that does not exist or is not registered.
        LoginData.loginOrEmail = "exampl4fse@mail.ru"
        let LoginResult = await GetRequest()
            .post(endpointLogin)
            .send(LoginData)
            .expect(401)

        // This simulates a scenario where the user provides a login name that does not exist or is not registered.
        LoginData.loginOrEmail = "testlogin"
        LoginResult =  await GetRequest()
            .post(endpointLogin)
            .send(LoginData)
            .expect(401)

        // This simulates a scenario where the user provides both a wrong login and a wrong password.
        LoginData = {
                loginOrEmail: 'TestLogin',
                password: "somePass23",
        }        
        LoginResult =  await GetRequest()
                .post(endpointLogin)
                .send(LoginData)
                .expect(401)
    })

    it(`POST | User should\`t login by Login or Email, status: 400, bad data login or email and password`, async () => {
        // This simulates a scenario where the user did not provide a login or email.
        LoginData.loginOrEmail = ""
        let LoginResult = await GetRequest()
            .post(endpointLogin)
            .send(LoginData)
            .expect(400)

        expect(LoginResult.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'loginOrEmail'
                }
            ]
        })

        // This simulates a scenario where the user did not provide both a login/email and a password.
        LoginData.password = ""
        LoginResult = await GetRequest()
            .post(endpointLogin)
            .send(LoginData)
            .expect(400)

        expect(LoginResult.body).toEqual({
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

    it(`GET | Get info about user by access token jwt, status: 200`, async () => {
        // Login to the system and receive a access token to pass to the request
        const LoginUserResult = await LoginUser(LoginData)
        
        // Request to endpoint for receive the information about current user by access token 
        let result = await GetRequest()
            .get(endpointMe)
            .set({"Authorization": `Bearer ${LoginUserResult.accessToken}`})
            .expect(200)

        expect(result.body).toEqual({
            email: CreateUserData.email,
            login: CreateUserData.login,
            userId: UserID
        })
    })

    it(`GET | Should\`t get info about user by access token jwt, status: 401`, async () => {
        // First request: No authorization is provided, and a 401 response is expected.
        let result = await GetRequest()
            .get(endpointMe)
            .expect(401)

        // Second request: An invalid token 'some token' is set in the Authorization header, expecting a 401 response.
        result = await GetRequest()
            .get(endpointMe)
            .set({"Authorization": `some token`})
            .expect(401)

        // Third request: A malformed or expired JWT token is set in the Authorization header, again expecting a 401 response.
        result = await GetRequest()
            .get(endpointMe)
            .set({"Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJ1c2VySWQiOiI2NjcxOWY2ODY2OGQzZTRhMjIyMDBhZWMiLCJpYXQiOjE3MTg3Mjk4MzEsImV4cCI6MTcxODczMzQzMX0Jfi95NhJhB1ERRBLEtRg=`})
            .expect(401)
    
    })
})

