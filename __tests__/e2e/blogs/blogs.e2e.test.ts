import { ObjectId } from 'mongodb';
import { SETTINGS } from '../../../src/settings'
import { TestModules } from '../modules/modules'

describe(SETTINGS.PATH.BLOG, () => {

    const endpoint: string = SETTINGS.PATH.BLOG

    let InspectData: any;
    let query = {}
    let CreateData: any = {}
    let CreateManyData: any = []
    
    beforeEach(async () => {
        const result = await TestModules.DeleteAllElements()
    })

    afterAll(async () => {
        const result = await TestModules.DeleteAllElements()
    })


    it('POST => GET | should create a blog item, status: 201, return the item and get the item by ID, status: 200', async () => {

        CreateData = {
            name: "IT-Incubator",
            description: "The blog is about IT-Incubator",
            websiteUrl:	"https://samurai.it-incubator.io/"
        }

        InspectData = {
            headers: {
                basic_auth: "Basic YWRtaW46cXdlcnR5"
            }
        }

        const CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            id: expect.any(String),
            name: CreateData.name,
            description: CreateData.description,
            websiteUrl: CreateData.websiteUrl,
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        })

        const returnValues = {...CreateElementResult}
        const ElementId = CreateElementResult.id

        const GetCreatedElementResult = await TestModules.GetElementById(endpoint, 200, ElementId)
        expect(GetCreatedElementResult).toEqual(CreateElementResult) 
    })

    it('POST => PUT => GET | should update a blog item, status: 204 and get the item by ID, status: 200', async () => {
        const DataUpdate = {
            name: "IT-Incubator 2",
            description: "I had some error, this blog is about IT-Incubator 2",
            websiteUrl:	"https://samurai.by.io/"
        }

        const CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateData, InspectData)
        const ElementId = CreateElementResult.id
        const returnValues = {...CreateElementResult}

        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 204, ElementId, DataUpdate, InspectData)

        const GetUpdatedElementResult = await TestModules.GetElementById(endpoint, 200, ElementId)
        expect(GetUpdatedElementResult).toEqual({...returnValues, ...DataUpdate})
    })

    it('POST => DELETE => GET | should delete a blog item, status: 204 and should`t get the item by ID, status: 404', async () => {

        const CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateData, InspectData)
        const ElementId = CreateElementResult.id

        let DeleteElementResult = await TestModules.DeleteElementById(endpoint, 204, ElementId, InspectData)

        const GetUpdatedElementResult = await TestModules.GetElementById(endpoint, 404, ElementId)

        DeleteElementResult = await TestModules.DeleteElementById(endpoint, 404, ElementId, InspectData)

    })

    it('POST => PUT | should`t update a blog item, status: 400, bad request, and status: 404, not found', async () => {
        let DataUpdate = {
            name: "IT-Incubator 2",
            description: "Some description",
            websiteUrl:	"https://samurai.by.io/"
        }

        const CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateData, InspectData)
        const ElementId = CreateElementResult.id

        let UpdateElementResult = await TestModules.UpdateElementById(endpoint, 404, "66632889ba80092799c0ed81", DataUpdate, InspectData)

        DataUpdate = {
            name: "IT-Incubator 2",
            description: "",
            websiteUrl:	"https://samurai.by.io/"
        }
        UpdateElementResult = await TestModules.UpdateElementById(endpoint, 400, ElementId, DataUpdate, InspectData)
        expect(UpdateElementResult).toEqual({
                    errorsMessages: [
                        {
                            message: expect.any(String),
                            field: 'description'
                        }
                    ]
                })

        DataUpdate = {
            name: "",
            description: "",
            websiteUrl:	"https://samurai.by.io/"
        }
        UpdateElementResult = await TestModules.UpdateElementById(endpoint, 400, ElementId, DataUpdate, InspectData)
        expect(UpdateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'description'
                },
                {
                    message: expect.any(String),
                    field: 'name'
                }
            ]
        })

        DataUpdate = {
            name: "",
            description: "",
            websiteUrl:	"https:.by.io/"
        }
        UpdateElementResult = await TestModules.UpdateElementById(endpoint, 400, ElementId, DataUpdate, InspectData)
        expect(UpdateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'description'
                },
                {
                    message: expect.any(String),
                    field: 'name'
                },
                {
                    message: expect.any(String),
                    field: 'websiteUrl'
                }
            ]
        })

    })

    it('POST => GET | should get all blog elements with pagination and filters, status: 200', async () => {

        CreateManyData = [
            {
                name: "IT-Incubator",
                description: "Blog about IT Incubator ;)",
                websiteUrl:	"https://samurai.it-incubator.io/",
                createdAt: "2024-06-07T12:44:43.684Z",
                isMembership: false
            },

            {
                name: "NodeJs Blog",
                description: "This blog is about NodeJs",
                websiteUrl:	"https://samurai.it-incubator.io/",
                createdAt: "2024-06-07T13:44:43.684Z",
                isMembership: false
            },

            {
                name: "JS blog",
                description: "This blog is about JS",
                websiteUrl:	"https://samurai.it-incubator.io/",
                createdAt: "2024-06-07T14:44:43.684Z",
                isMembership: false
            },

            {
                name: "PHP Blog",
                description: "This blog is about PHP",
                websiteUrl:	"https://samurai.it-incubator.io/",
                createdAt: "2024-06-07T15:44:43.684Z",
                isMembership: false
            },

            {
                name: "Python Blog",
                description: "This blog is about Python",
                websiteUrl:	"https://samurai.it-incubator.io/",
                createdAt: "2024-06-07T16:44:43.684Z",
                isMembership: false
            },

            {
                name: "IT Kamasutra",
                description: "IT Blog",
                websiteUrl:	"https://samurai.it-incubator.io/",
                createdAt: "2024-06-07T17:44:43.684Z",
                isMembership: false
            },

            {
                name: "Isn`t blog about IT",
                description: "This isn`t blog about IT",
                websiteUrl:	"https://samurai.it-incubator.io/",
                createdAt: "2024-06-07T18:44:43.684Z",
                isMembership: false
            },

            {
                name: "XXX Blog",
                description: "A lot of info about IT",
                websiteUrl:	"https://samurai.it-incubator.io/",
                createdAt: "2024-06-07T19:44:43.684Z",
                isMembership: false
            },

            {
                name: "God`s blog",
                description: "Just god`s blog",
                websiteUrl:	"https://samurai.it-incubator.io/",
                createdAt: "2024-06-07T20:44:43.684Z",
                isMembership: false
            },

            {
                name: "xXx IT Blog",
                description: "Just blog about ID",
                websiteUrl:	"https://samurai.it-incubator.io/",
                createdAt: "2024-06-07T21:44:43.684Z",
                isMembership: false
            },

            {
                name: "IkT IT Blog",
                description: "It`s my first blog :)",
                websiteUrl:	"https://samurai.it-incubator.io/",
                createdAt: "2024-06-07T22:44:43.684Z",
                isMembership: false
            },
        ]
        const CreateManyResult = await TestModules.InsertManyDataMongoDB(SETTINGS.MONGO.COLLECTIONS.blogs, CreateManyData)

        let GetAllElements = await TestModules.GetAllElements(endpoint, 200, query)
        expect(GetAllElements).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 10,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.items).toHaveLength(10)

        query = {
            searchNameTerm: 'IT-Incubator',
            pageNumber: null,
            pageSize: null,
            sortBy: null,
            sortDirection: null
        }
        GetAllElements = await TestModules.GetAllElements(endpoint, 200, query)
        expect(GetAllElements).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.items).toHaveLength(1)

        query = {
            searchNameTerm: null,
            pageNumber: 2,
            pageSize: null,
            sortBy: null,
            sortDirection: null
        }
        GetAllElements = await TestModules.GetAllElements(endpoint, 200, query)
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
        GetAllElements = await TestModules.GetAllElements(endpoint, 200, query)
        expect(GetAllElements).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 11,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.items).toHaveLength(11)


    })

    it('POST | should`t create a blog item, status: 400, bad request', async () => {

        CreateData = {
            name: "",
            description: "The blog is about IT-Incubator",
            websiteUrl:	"https://samurai.it-incubator.io/"
        }

        let CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'name'
                }
            ]
        })

        CreateData = {
            name: "",
            description: "",
            websiteUrl:	"https://samurai.it-incubator.io/"
        }

        CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'description'
                },
                {
                    message: expect.any(String),
                    field: 'name'
                }
            ]
        })

        CreateData = {
            name: "",
            description: "",
            websiteUrl:	"it-incubator.io/"
        }

        CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'description'
                },
                {
                    message: expect.any(String),
                    field: 'name'
                },
                {
                    message: expect.any(String),
                    field: 'websiteUrl'
                }
            ]
        })

    })

    it('POST => PUT => DELETE | should`t create, update, delete a blog item, status: 401, Unauthorized', async () => {

        CreateData = {
            name: "Some name",
            description: "The blog is about IT-Incubator",
            websiteUrl:	"https://samurai.it-incubator.io/"
        }

        const DataUpdate = {
            name: "IT-Incubator 2",
            description: "I had some error, this blog is about IT-Incubator 2",
            websiteUrl:	"https://samurai.by.io/"
        }

        InspectData = {
            headers: {
                basic_auth: "Basic YWRtaW46cXdl"
            }
        }

        const CreateElementResult = await TestModules.CreateElement(endpoint, 401, CreateData, InspectData)
        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 401, "66632889ba80092799c0ed81", DataUpdate, InspectData)
        const DeleteElementResult = await TestModules.DeleteElementById(endpoint, 401, "66632889ba80092799c0ed81", InspectData)
    })

    it('POST => PUT => DELETE => GET | should`t update, delete, get a blog item by ID, status: 500, bad mongo object ID', async () => {

        CreateData = {
            name: "Some name",
            description: "The blog is about IT-Incubator",
            websiteUrl:	"https://samurai.it-incubator.io/"
        }

        const DataUpdate = {
            name: "IT-Incubator 2",
            description: "I had some error, this blog is about IT-Incubator 2",
            websiteUrl:	"https://samurai.by.io/"
        }

        InspectData = {
            headers: {
                basic_auth: "Basic YWRtaW46cXdlcnR5"
            }
        }

        const CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateData, InspectData)
        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 500, "66632889ba80092799", DataUpdate, InspectData)
        const DeleteElementResult = await TestModules.DeleteElementById(endpoint, 500, "66632889ba80092799", InspectData)
        const GetCreatedElementResult = await TestModules.GetElementById(endpoint, 500, "66632889ba80092799")

    })
})

