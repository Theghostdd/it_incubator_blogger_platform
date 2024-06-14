import { TestModules } from '../modules/modules'
import { MONGO_SETTINGS, ROUTERS_SETTINGS } from '../../../src/settings'



describe(ROUTERS_SETTINGS.POST.post, () => {

    const endpoint: string = ROUTERS_SETTINGS.POST.post
    let InspectData: any;
    let query = {}
    let idBlog: string
    let blogName: string
    let DataUpdate: any = {}
    let CreateDataPost: any = {}

    
    beforeEach(async () => {
        const result = await TestModules.DeleteAllElements()

        InspectData = {
            headers: {
                basic_auth: "Basic YWRtaW46cXdlcnR5"
            }
        }

        const CreateData = {
            name: "IT-Incubator",
            description: "The blog is about IT-Incubator",
            websiteUrl:	"https://samurai.it-incubator.io/"
        }
        const CreatedBlog = await TestModules.CreateElement(ROUTERS_SETTINGS.BLOG.blogs, 201, CreateData, InspectData)
        idBlog = CreatedBlog.id
        blogName = CreatedBlog.name

        CreateDataPost = {
            title: 'Some Title Post',
            shortDescription: "Some short description",
            content: "Some content",
            blogId: idBlog
        }

        DataUpdate = {
            title: 'Some Title Post 2',
            shortDescription: "Some short description 2",
            content: "Some content 2",
            blogId: idBlog
        }
    })

    afterAll(async () => {
        const result = await TestModules.DeleteAllElements()
    })

    it('POST => GET | should create a post item, status: 201, return the item and get created item, status: 200, and status: 404 if element doesn`t found', async () => {

        const CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateDataPost, InspectData)
        expect(CreateElementResult).toEqual({
            id: expect.any(String),
            title: CreateDataPost.title,
            shortDescription: CreateDataPost.shortDescription,
            content: CreateDataPost.content,
            blogName: blogName,
            blogId: idBlog,
            createdAt: expect.any(String)
        })

        const returnValues = {...CreateElementResult}
        const ElementId = CreateElementResult.id

        const GetCreatedElementResult = await TestModules.GetElementById(endpoint, 200, ElementId, InspectData)
        expect(GetCreatedElementResult).toEqual(CreateElementResult) 

        const GetElementResult = await TestModules.GetElementById(endpoint, 404, "66632889ba80092799c0ed81", InspectData)
    })

    it('POST => PUT => GET | should update a post item, status: 204 and get the item by ID, status: 200', async () => {
        const CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateDataPost, InspectData)
        const ElementId = CreateElementResult.id
        const returnValues = {...CreateElementResult}

        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 204, ElementId, DataUpdate, InspectData)

        const GetUpdatedElementResult = await TestModules.GetElementById(endpoint, 200, ElementId, InspectData)
        expect(GetUpdatedElementResult).toEqual({...returnValues, ...DataUpdate})
    })

    it('POST => DELETE => GET | should delete a post item, status: 204 and should`t get the item by ID, status: 404', async () => {

        const CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateDataPost, InspectData)
        const ElementId = CreateElementResult.id

        let DeleteElementResult = await TestModules.DeleteElementById(endpoint, 204, ElementId, InspectData)

        const GetUpdatedElementResult = await TestModules.GetElementById(endpoint, 404, ElementId, InspectData)

        DeleteElementResult = await TestModules.DeleteElementById(endpoint, 404, ElementId, InspectData)
    })

    it('POST => PUT | should`t update a post item, status: 400, bad request, and status: 404, not found', async () => {

        const CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateDataPost, InspectData)
        const ElementId = CreateElementResult.id

        let UpdateElementResult = await TestModules.UpdateElementById(endpoint, 404, "66632889ba80092799c0ed81", DataUpdate, InspectData)

        DataUpdate.shortDescription = '';
        UpdateElementResult = await TestModules.UpdateElementById(endpoint, 400, ElementId, DataUpdate, InspectData)
        expect(UpdateElementResult).toEqual({
                    errorsMessages: [
                        {
                            message: expect.any(String),
                            field: 'shortDescription'
                        }
                    ]
                })

        DataUpdate = {
            title: '',
            shortDescription: "",
            content: "Some content 2",
            blogId: idBlog
        }
        UpdateElementResult = await TestModules.UpdateElementById(endpoint, 400, ElementId, DataUpdate, InspectData)
        expect(UpdateElementResult).toEqual({
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

        DataUpdate = {
            title: '',
            shortDescription: "",
            content: "",
            blogId: idBlog
        }
        UpdateElementResult = await TestModules.UpdateElementById(endpoint, 400, ElementId, DataUpdate, InspectData)
        expect(UpdateElementResult).toEqual({
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

    it('POST => GET | should get all post elements with pagination and filters, status: 200', async () => {

        const CreateManyData = [
            {
                title: 'Post is number 1',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: blogName,
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 2',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: blogName,
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 3',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: blogName,
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 4',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: blogName,
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 5',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: blogName,
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 6',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: blogName,
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 7',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: blogName,
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 8',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: blogName,
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 9',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: blogName,
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 10',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: blogName,
                createdAt: '2024-06-08T10:14:38.605Z'
            },

            {
                title: 'Post is number 11',
                shortDescription: "Some short description",
                content: "Some content",
                blogId: idBlog,
                blogName: blogName,
                createdAt: '2024-06-08T10:14:38.605Z'
            },
        ]
        const CreateManyResult = await TestModules.InsertManyDataMongoDB(MONGO_SETTINGS.COLLECTIONS.posts, CreateManyData)

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
            searchNameTerm: null,
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
            searchNameTerm: null,
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
    })

    it('POST | should`t create a post item, status: 400, bad request', async () => {

        CreateDataPost.title = ''

        let CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateDataPost, InspectData)
        expect(CreateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'title'
                }
            ]
        })

        CreateDataPost = {
            title: '',
            shortDescription: "",
            content: "Some content",
            blogId: idBlog
        }

        CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateDataPost, InspectData)
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

        CreateDataPost = {
            title: '',
            shortDescription: "",
            content: "",
            blogId: idBlog
        }
        CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateDataPost, InspectData)
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

        CreateDataPost = {
            title: '',
            shortDescription: "",
            content: "",
            blogId: '66632889ba80092799c0ed89'
        }
        CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateDataPost, InspectData)
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
                },
                {
                    message: expect.any(String),
                    field: 'blogId'
                }
            ]
        })

    })

    it('POST => PUT => DELETE | should`t create, update, delete a blog item, status: 401, Unauthorized', async () => {
        InspectData = {
            headers: {
                basic_auth: "Basic YWRtaW46cXdl"
            }
        }

        const CreateElementResult = await TestModules.CreateElement(endpoint, 401, CreateDataPost, InspectData)
        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 401, "66632889ba80092799c0ed81", DataUpdate, InspectData)
        const DeleteElementResult = await TestModules.DeleteElementById(endpoint, 401, "66632889ba80092799c0ed81", InspectData)
    })

    it('POST => PUT => DELETE => GET | should`t update, delete, get a blog item by ID, status: 500, bad mongo object ID', async () => {
        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 500, "66632889ba80092799", DataUpdate, InspectData)
        const DeleteElementResult = await TestModules.DeleteElementById(endpoint, 500, "66632889ba80092799", InspectData)
        const GetCreatedElementResult = await TestModules.GetElementById(endpoint, 500, "66632889ba80092799", InspectData)
    })
})
