import { MONGO_SETTINGS, ROUTERS_SETTINGS } from "../../../src/settings";
import { TestModules } from "../modules/modules";

describe(ROUTERS_SETTINGS.USER.user, () => {


    const endpoint: string = ROUTERS_SETTINGS.USER.user

    let InspectData: any;
    let query: any = {}
    let CreateData: any = {}

    beforeEach(async () => {
        const result = await TestModules.DeleteAllElements()

        InspectData = {
            headers: {
                basic_auth: "Basic YWRtaW46cXdlcnR5"
            }
        }

        CreateData = {
            login: 'TestLogin',
            password: "somePass",
            email: "example@mail.ru"
        }
    })

    afterAll(async () => {
        const result = await TestModules.DeleteAllElements()
    })

    it(`POST => GET | Super admin should create a user item, status: 201, return the map item and get all item, status: 200`, async () => {
        const CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            id: expect.any(String),
            login: CreateData.login,
            email: CreateData.email,
            createdAt: expect.any(String)
        })

        const returnValues = {...CreateElementResult}

        const GetCreatedElementResult = await TestModules.GetAllElements(endpoint, 200, query, InspectData)
        expect(GetCreatedElementResult).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [
                {
                ...returnValues
                }
            ]
        })
    })

    it(`POST => GET | Super admin should\`t create a user item, status: 400, bad login, email, password`, async () => {
        CreateData.login = '';
        let CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'login'
                }
            ]
        })

        CreateData = {
            login: 'TestLoginTTestLoginTTestLoginTTestLoginTTestLoginTTestLoginT',
            password: "sw",
            email: "example@mail.ru"
        }
        CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
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

        CreateData = {
            login: 'TestLoginTTestLoginTTestLoginTTestLoginTTestLoginTTestLoginT',
            password: "s",
            email: "examplemail.ru"
        }
        CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
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

    it(`POST => GET | Super admin should\`t create a user item, status: 400, not uniq email and login`, async () => {
        let CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateData, InspectData)

        CreateData = {
            login: 'TestLogin',
            password: "somePass",
            email: "example2@mail.ru"
        }
        CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'login'
                }
            ]
        })

        CreateData = {
            login: 'Login',
            password: "somePass",
            email: "example@mail.ru"
        }
        CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'email'
                }
            ]
        })


    })

    it(`POST => GET | Super admin should\`t create, get and delete the user item, status: 401, Unauthorized`, async () => {
        InspectData.headers.basic_auth = "Basic YWRtaW46cXd"
        const CreateElementResult = await TestModules.CreateElement(endpoint, 401, CreateData, InspectData)
        const GetElementResult = await TestModules.GetAllElements(endpoint, 401, query, InspectData)
        const DeleteElementResult = await TestModules.DeleteElementById(endpoint, 401, 'elementId', InspectData)
    })

    it(`POST => GET | Super admin should delete item by ID, and get error 404 when want to delete again`, async () => {
        const CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateData, InspectData)
        const ElementId = CreateElementResult.id

        let DeleteElementResult = await TestModules.DeleteElementById(endpoint, 204, ElementId, InspectData)
        DeleteElementResult = await TestModules.DeleteElementById(endpoint, 404, ElementId, InspectData)

    })

    it('POST => GET | should get all post elements with pagination and filters by blog ID, status: 200', async () => {
        const CreateManyData = [
            {
                login: 'Some Login',
                email: 'example@mail.ru',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                login: 'Some Login2',
                email: 'example@yandex.ru',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                login: 'Some Login3',
                email: 'example@gmail.com',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                login: 'QueryLogin',
                email: 'neemail@mail.ru',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                login: 'NotLogin',
                email: 'exam22ple@mail.ru',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                login: 'Ffjr',
                email: 'examp45le@mail.ru',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                login: 'Some2Login',
                email: 'exa32mple@mail.ru',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                login: 'Some3Login',
                email: 'exa2224mple@mail.ru',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                login: 'Some4Login',
                email: 'examfdseple@mail.ru',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                login: 'Some5Login',
                email: 'exampfffffffle@mail.ru',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                login: 'Some6Login',
                email: 'exampsszle@mail.ru',
                createdAt: '2024-06-08T10:14:38.605Z'
            },
        ]

        const CreateManyResult = await TestModules.InsertManyDataMongoDB(MONGO_SETTINGS.COLLECTIONS.users, CreateManyData)

        let GetAllElements = await TestModules.GetAllElements(endpoint, 200, query, InspectData)
        expect(GetAllElements).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 10,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.items).toHaveLength(10)

        query = {
            searchLoginTerm: null,
            searchEmailTerm: null,
            pageNumber: 2,
            pageSize: null,
            sortBy: null,
            sortDirection: null
        }
        GetAllElements = await TestModules.GetAllElements(endpoint, 200, query, InspectData)
        expect(GetAllElements).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 10,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.items).toHaveLength(1)

        query = {
            searchLoginTerm: null,
            searchEmailTerm: null,            
            pageNumber: null,
            pageSize: 11,
            sortBy: null,
            sortDirection: null
        }
        GetAllElements = await TestModules.GetAllElements(endpoint, 200, query, InspectData)
        expect(GetAllElements).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 11,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.items).toHaveLength(11)

        query = {
            searchLoginTerm: 'S',
            searchEmailTerm: '.com',            
            pageNumber: null,
            pageSize: null,
            sortBy: null,
            sortDirection: null
        }
        GetAllElements = await TestModules.GetAllElements(endpoint, 200, query, InspectData)
        expect(GetAllElements).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 8,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.items).toHaveLength(8)
    })
})

