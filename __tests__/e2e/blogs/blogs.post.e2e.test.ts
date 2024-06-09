import { SETTINGS } from "../../../src/settings";
import { TestModules } from "../modules/modules";

describe(SETTINGS.PATH.BLOG + '/:id' +SETTINGS.PATH.additionalBlog.posts, () => {


    const endpoint: string = SETTINGS.PATH.BLOG
    const additionalEndpointPost: string = SETTINGS.PATH.additionalBlog.posts

    let InspectData: any;
    let query: any = {}
    const CreateDataBlog: any = {
        name: "IT-Incubator",
        description: "The blog is about IT-Incubator",
        websiteUrl:	"https://samurai.it-incubator.io/"
    }

    let CreateData: any = {}

    beforeEach(async () => {
        const result = await TestModules.DeleteAllElements()

        InspectData = {
            headers: {
                basic_auth: "Basic YWRtaW46cXdlcnR5"
            }
        }
    })

    afterAll(async () => {
        const result = await TestModules.DeleteAllElements()
    })

    it(`POST => GET | should create a post item by blog ID, status: 201, return the item and get the item by ID, status: 200, and 404 if the item not found`, async () => {
        const CreateBlogElementResult = await TestModules.CreateElement(endpoint, 201, CreateDataBlog, InspectData)
        const idBlog = CreateBlogElementResult.id

        CreateData = {
            title: 'Some Title Post',
            shortDescription: "Some short description",
            content: "Some content"
        }
        
        const CreateElementResult = await TestModules.CreateElement(`${endpoint}/${idBlog}/${additionalEndpointPost}`, 201, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            id: expect.any(String),
            title: CreateData.title,
            shortDescription: CreateData.shortDescription,
            content: CreateData.content,
            blogName: CreateDataBlog.name,
            blogId: idBlog,
            createdAt: expect.any(String)
        })

        const returnValues = {...CreateElementResult}

        const GetCreatedElementResult = await TestModules.GetAllElements(`${endpoint}/${idBlog}/${additionalEndpointPost}`, 200, query)
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

        const GetElementResult = await TestModules.GetAllElements(`${endpoint}/66632889ba80092799c0ed81/${additionalEndpointPost}`, 404, query) 
    })

    it('POST => GET | should get all post elements with pagination and filters by blog ID, status: 200', async () => {
        const CreateBlogElementResult = await TestModules.CreateElement(endpoint, 201, CreateDataBlog, InspectData)
        const idBlog = CreateBlogElementResult.id

        const CreateManyData = [
            {
                title: 'Post is number 1',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: 'IT-Incubator',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 2',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: 'IT-Incubator',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 3',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: 'IT-Incubator',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 4',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: 'IT-Incubator',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 5',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: 'IT-Incubator',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 6',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: 'IT-Incubator',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 7',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: 'IT-Incubator',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 8',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: 'IT-Incubator',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 9',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: 'IT-Incubator',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 10',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: 'IT-Incubator',
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 11',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: 'IT-Incubator',
                createdAt: '2024-06-08T10:14:38.605Z'
            },
        ]

        const CreateManyResult = await TestModules.InsertManyDataMongoDB(SETTINGS.MONGO.COLLECTIONS.posts, CreateManyData)

        let GetAllElements = await TestModules.GetAllElements(`${endpoint}/${idBlog}/${additionalEndpointPost}`, 200, query)
        expect(GetAllElements).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 10,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.items).toHaveLength(10)

        query = {
            searchNameTerm: null,
            pageNumber: 2,
            pageSize: null,
            sortBy: null,
            sortDirection: null
        }
        GetAllElements = await TestModules.GetAllElements(`${endpoint}/${idBlog}/${additionalEndpointPost}`, 200, query)
        expect(GetAllElements).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 10,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.items).toHaveLength(1)

        query = {
            searchNameTerm: null,
            pageNumber: null,
            pageSize: 11,
            sortBy: null,
            sortDirection: null
        }
        GetAllElements = await TestModules.GetAllElements(`${endpoint}/${idBlog}/${additionalEndpointPost}`, 200, query)
        expect(GetAllElements).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 11,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.items).toHaveLength(11)
    })

    it('POST | should`t create a post item by blog ID, status: 400, bad request', async () => {
        const CreateBlogElementResult = await TestModules.CreateElement(endpoint, 201, CreateDataBlog, InspectData)
        const idBlog = CreateBlogElementResult.id

        CreateData = {
            title: '',
            shortDescription: "Some short description",
            content: "Some content"
        }
        let CreateElementResult = await TestModules.CreateElement(`${endpoint}/${idBlog}/${additionalEndpointPost}`, 400, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'title'
                }
            ]
        })

        CreateData = {
            title: '',
            shortDescription: "",
            content: "Some content"
        }
        CreateElementResult = await TestModules.CreateElement(`${endpoint}/${idBlog}/${additionalEndpointPost}`, 400, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'title'
                },
                {
                    message: expect.any(String),
                    field: 'shortDescription'
                }
            ]
        })

        CreateData = {
            title: '',
            shortDescription: "",
            content: ""
        }
        CreateElementResult = await TestModules.CreateElement(`${endpoint}/${idBlog}/${additionalEndpointPost}`, 400, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'title'
                },
                {
                    message: expect.any(String),
                    field: 'shortDescription'
                },
                {
                    message: expect.any(String),
                    field: 'content'
                }
            ]
        })

    })

    it('POST | should`t create a post item by blog ID, status: 401, Unauthorized', async () => {
        const CreateBlogElementResult = await TestModules.CreateElement(endpoint, 201, CreateDataBlog, InspectData)
        const idBlog = CreateBlogElementResult.id

        CreateData = null;

        InspectData = {
            headers: {
                basic_auth: "Basic YWRtaW46cXdl"
            }
        }

        const CreateElementResult = await TestModules.CreateElement(`${endpoint}/${idBlog}/${additionalEndpointPost}`, 401, CreateData, InspectData)
    })
})
