import { ROUTERS_SETTINGS } from "../../../src/settings";
import {AdminAuth, CreateManyDataUniversal, CreateUser, DropAll, GetRequest} from "../modules/modules";
import {UserModel} from "../../../src/Domain/User/User";
import {InsertAuthDto} from "../../Dto/AuthDto";

describe(ROUTERS_SETTINGS.USER.user, () => {


    const endpoint: string = ROUTERS_SETTINGS.USER.user

    let CreateData: any = {}
    let InsertManyDataUser: any;

    beforeEach(async () => {
        await DropAll()
        InsertManyDataUser = structuredClone(InsertAuthDto.CreateManyData)
        CreateData = {
            login: 'TestLogin',
            password: "somePass",
            email: "example@mail.ru"
        }
    })

    it(`POST => GET | Super admin should create a user item, status: 201, return the map item and get all item, status: 200`, async () => {
        // This simulates a scenario where super admin creating new user
        const CreateElementResult = await GetRequest()
            .post(endpoint)
            .set(AdminAuth)
            .send(CreateData)
            .expect(201)
        expect(CreateElementResult.body).toEqual({
            id: expect.any(String),
            login: CreateData.login,
            email: CreateData.email,
            createdAt: expect.any(String)
        })
        // This simulates a scenario where super admin getting all user
        const GetCreatedElementResult = await GetRequest()
            .get(endpoint)
            .set(AdminAuth)
            .expect(200)
        expect(GetCreatedElementResult.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [
                {
                ...CreateElementResult.body
                }
            ]
        })
    })

    it(`POST | Super admin should\`t create a user item, status: 400, bad login, email, password`, async () => {
        // This simulates a scenario where super admin should not do creating new user because bad login
        CreateData.login = '';
        let CreateElementResult = await GetRequest()
            .post(endpoint)
            .set(AdminAuth)
            .send(CreateData)
            .expect(400)
        expect(CreateElementResult.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'login'
                }
            ]
        })
        // This simulates a scenario where super admin should not do creating new user because bad login, password
        CreateData.password = 'sw'
        CreateElementResult = await GetRequest()
            .post(endpoint)
            .set(AdminAuth)
            .send(CreateData)
            .expect(400)
        expect(CreateElementResult.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'login'
                },
                {
                    message: expect.any(String),
                    field: 'password'
                }
            ]
        })
        // This simulates a scenario where super admin should not do creating new user because bad login, password, email
        CreateData = {
            login: 'TestLoginTTestLoginTTestLoginTTestLoginTTestLoginTTestLoginT',
            password: "s",
            email: "examplemail.ru"
        }
        CreateElementResult = await GetRequest()
            .post(endpoint)
            .set(AdminAuth)
            .send(CreateData)
            .expect(400)
        expect(CreateElementResult.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'login'
                },
                {
                    message: expect.any(String),
                    field: 'password'
                },
                {
                    message: expect.any(String),
                    field: 'email'
                }
            ]
        })
    })

    it(`POST | Super admin should\`t create a user item, status: 400, not uniq email and login`, async () => {
        // Create the user
        let CreateElementResult = await CreateUser(CreateData)
        // This simulates a scenario where super admin should not do creating new user because not uniq login
        CreateData.email = 'example2@mail.ru'
        CreateElementResult = await GetRequest()
            .post(endpoint)
            .set(AdminAuth)
            .send(CreateData)
            .expect(400)
        expect(CreateElementResult.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'login'
                }
            ]
        })
        // This simulates a scenario where super admin should not do creating new user because not uniq email
        CreateData = {
            login: 'Login',
            password: "somePass",
            email: "example@mail.ru"
        }
        CreateElementResult = await GetRequest()
            .post(endpoint)
            .set(AdminAuth)
            .send(CreateData)
            .expect(400)
        expect(CreateElementResult.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'email'
                }
            ]
        })


    })

    it(`POST => GET => DELETE | Super admin should\`t create, get and delete the user item, status: 401, Unauthorized`, async () => {
        // This simulates a scenario where super admin should not do creating, delete new user because Unauthorized
        await GetRequest()
            .post(endpoint)
            .set({})
            .expect(401)
        await GetRequest()
            .post(endpoint)
            .set({Authorization: ''})
            .expect(401)
        await GetRequest()
            .post(endpoint)
            .set({Authorization: 'frfrfrfrfr'})
            .expect(401)
    })

    it(`POST => GET | Super admin should delete item by ID, and get error 404 when want to delete again`, async () => {
        // Create user
        const CreateElementResult = await CreateUser(CreateData)
        // This simulates a scenario where super admin should delete the user by id
        await GetRequest()
            .delete(`${endpoint}/${CreateElementResult.id}`)
            .set(AdminAuth)
            .expect(204)
        // This simulates a scenario where super admin want to delete the user by id but user deleted
        await GetRequest()
            .delete(`${endpoint}/${CreateElementResult.id}`)
            .set(AdminAuth)
            .expect(404)
    })

    it('POST => GET | should get all post elements with pagination and filters by blog ID, status: 200', async () => {
        // Create many data
        await CreateManyDataUniversal(InsertManyDataUser, UserModel)
        // This simulates a scenario where super admin want to get all user without query params
        let GetAllElements = await GetRequest()
            .get(endpoint)
            .set(AdminAuth)
            .expect(200)
        expect(GetAllElements.body).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 10,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.body.items).toHaveLength(10)
        // This simulates a scenario where super admin want to get all user with query params: pageNumber
        GetAllElements = await GetRequest()
            .get(endpoint)
            .query({pageNumber: 2})
            .set(AdminAuth)
            .expect(200)
        expect(GetAllElements.body).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 10,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.body.items).toHaveLength(1)
        // This simulates a scenario where super admin want to get all user with query params: pageSize
        GetAllElements = await GetRequest()
            .get(endpoint)
            .query({pageSize: 11})
            .set(AdminAuth)
            .expect(200)
        expect(GetAllElements.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 11,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.body.items).toHaveLength(11)
        // This simulates a scenario where super admin want to get all user with query params: searchLoginTerm, searchEmailTerm
        GetAllElements = await GetRequest()
            .get(endpoint)
            .query({searchLoginTerm: 'S', searchEmailTerm: '.com'})
            .set(AdminAuth)
            .expect(200)
        expect(GetAllElements.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 8,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.body.items).toHaveLength(8)
    })
})

