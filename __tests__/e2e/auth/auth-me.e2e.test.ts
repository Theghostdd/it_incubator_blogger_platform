import { MONGO_SETTINGS, ROUTERS_SETTINGS } from '../../../src/settings'
import { CreateBlog, DeleteAllDb, GetRequest, AdminAuth, CreatedPost, CreateManyDataUniversal, CreateUser, LoginUser } from '../modules/modules';



describe(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.me, () => {

    const endpoint: string = ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.me

    let AuthData: any = {}
    let CreatedUserData: any = {}
    let userId: string

    beforeEach(async () => {
        await DeleteAllDb()

        CreatedUserData = {
            login: 'TestLogin',
            password: "somePass",
            email: "example@mail.ru"
        }
        const CreatedUserResult = await CreateUser(CreatedUserData)
        userId = CreatedUserResult.id

        const LoginData = {
            loginOrEmail: CreatedUserData.login,
            password: CreatedUserData.password,
        }
        const LoginUserResult = await LoginUser(LoginData)
        
        AuthData = {
            Authorization: 'Bearer ' + LoginUserResult.accessToken
        }
    })

    afterAll(async () => {
        await DeleteAllDb()
    })

    it('GET | should get info about current user by access token, status: 200', async () => {
        // This simulates a scenario where we get info about current user by access token
        const CreateElementResult = await GetRequest()
            .get(endpoint)
            .set(AuthData)
            .expect(200)
        expect(CreateElementResult.body).toEqual({
            email: CreatedUserData.email,
            login: CreatedUserData.login,
            userId: userId
        })
    })

    it('GET | should`t get info about current user by access token, status: 401', async () => {
        // This simulates a scenario where we should`t get info about current user by access token because not auth data
        const CreateElementResult = await GetRequest()
            .get(endpoint)
            .set({})
            .expect(401)
    })

})