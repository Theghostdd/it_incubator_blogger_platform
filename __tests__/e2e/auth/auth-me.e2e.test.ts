import { ROUTERS_SETTINGS } from '../../../src/settings'
import { AuthDto, RegistrationDto } from '../../Dto/AuthDto';
import { DropCollections } from '../../Modules/Body.Modules';
import { GetRequest, CreateUser, LoginUser } from '../modules/modules';



describe(ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.me, () => {

    const endpoint: string = ROUTERS_SETTINGS.AUTH.auth + ROUTERS_SETTINGS.AUTH.me

    let AuthData: any = {}
    let CreatedUserData: any = {}
    let userId: string

    beforeEach(async () => {
        jest.clearAllMocks()
        await DropCollections.DropAllCollections()

        CreatedUserData = {...RegistrationDto.RegistrationUserData}

        const CreatedUserResult = await CreateUser(CreatedUserData)
        userId = CreatedUserResult.id

        const LoginData = {...AuthDto.AuthUserData}
        const LoginUserResult = await LoginUser(LoginData)
        AuthData = {
            Authorization: 'Bearer ' + LoginUserResult.accessToken
        }
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