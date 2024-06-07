import { ObjectId } from 'mongodb';
import { SETTINGS } from '../../../src/settings'
import { TestModules } from '../modules/modules'

describe(SETTINGS.PATH.BLOG, () => {

    const endpoint: string = SETTINGS.PATH.BLOG

    let returnValues: any;
    let InspectData: any;
    let ElementId: string;
    let query = {}
    
    it('should delete all data', async () => {
        await TestModules.DeleteAllElements()
    })

    it('should create blog`s element, status: 201, and return element + GET by ID, status: 200', async () => {

        const CreateData = {
            name: "My first blog",
            description: "This is my first blog :)",
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

        returnValues = {...CreateElementResult}
        ElementId = CreateElementResult.id

        const GetCreatedElementResult = await TestModules.GetElementById(endpoint, 200, ElementId)
        expect(GetCreatedElementResult).toEqual(CreateElementResult) 
    })

    it('should update blog`s element, status: 204 + GET by ID, status: 200', async () => {
        const DataUpdate = {
            name: "My first blog",
            description: "This is my first blog :)",
            websiteUrl:	"https://samurai.by.io/"
        }

        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 204, ElementId, DataUpdate, InspectData)

        const GetUpdatedElementResult = await TestModules.GetElementById(endpoint, 200, ElementId)
        expect(GetUpdatedElementResult).toEqual({...returnValues, ...DataUpdate})
    })

    it('shouldn`t update blog`s element, status: 400, empty description', async () => {
        const DataUpdate = {
            name: "My first blog",
            description: "",
            websiteUrl:	"https://samurai.by.io/"
        }
        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 400, ElementId, DataUpdate, InspectData)
        expect(UpdateCreatedElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'description'
                }
            ]
        })
    })

    it('should delete blog`s element, status: 204 + GET by ID, status: 404', async () => {
        const DeleteElementByIdResult = await TestModules.DeleteElementById(endpoint, 204, ElementId, InspectData)
        const GetCreatedElementResult = await TestModules.GetElementById(endpoint, 404, ElementId)
    })

    it('should create two blog`s elements, status: 201, and return element + GET all, status: 200 + DELETE all, status: 204', async () => {

        const CreateFirstData = {
            name: "My first blog",
            description: "This is my first blog :)",
            websiteUrl:	"https://samurai.it-incubator.io/"
        }

        const CreateSecondData = {
            name: "My second blog",
            description: "This is my second blog :)",
            websiteUrl:	"https://second-blogs.by/"
        }

        const CreateFirstElementResult = await TestModules.CreateElement(endpoint, 201, CreateFirstData, InspectData)
        expect(CreateFirstElementResult).toEqual({
            id: expect.any(String),
            name: CreateFirstData.name,
            description: CreateFirstData.description,
            websiteUrl: CreateFirstData.websiteUrl,
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        })

        const CreateSecondElementResult = await TestModules.CreateElement(endpoint, 201, CreateSecondData, InspectData)
        expect(CreateSecondElementResult).toEqual({
            id: expect.any(String),
            name: CreateSecondData.name,
            description: CreateSecondData.description,
            websiteUrl: CreateSecondData.websiteUrl,
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        })

        const GetAllElementsResult = await TestModules.GetAllElements(endpoint, 200, query)
        expect(GetAllElementsResult.item.length).toBe(2)

        const DeleteAllElementsResult = await TestModules.DeleteAllElements()
    })

    it('shouldn`t update blog`s element, status: 404', async () => {
        const DataUpdate = {
            name: "My first blog",
            description: "This is my first blog :)",
            websiteUrl:	"https://samurai.by.io/"
        }       
        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 404, ElementId, DataUpdate, InspectData)
    })

    it('shouldn`t delete blog`s element, status: 404', async () => {
        const DeleteElementByIdResult = await TestModules.DeleteElementById(endpoint, 404, ElementId, InspectData)
    })

    it('shouldn`t get blog`s element, status: 404', async () => {
        const GetElementByIdResult = await TestModules.GetElementById(endpoint, 404, ElementId)
    })

    it('shouldn`t get blog`s element by ID, status: 404', async () => {
        const GetElementByIdResult = await TestModules.GetElementById(endpoint, 404, ElementId)
    })

    it('shouldn`t create blog`s element, status: 400, empty title', async () => {
        const CreateData = {
            name: "",
            description: "This is my first blog :)",
            websiteUrl:	"https://samurai.it-incubator.io/"
        }
        const CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'name'
                }
            ]
        })
    })

    it('shouldn`t create blog`s element, status: 400, empty title and bad website URL', async () => {
        const CreateData = {
            name: "",
            description: "This is my first blog :)",
            websiteUrl:	"https:samurai.lt/"
        }
        const CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'name'
                },
                {
                    message: expect.any(String),
                    field: 'websiteUrl'
                },
            ]
        })
    })

    it('shouldn`t create blog`s element, status: 401, Unauthorized', async () => {
        const CreateData = {}
        InspectData = {
            headers: {
                basic_auth: "Basic YWRtaW46cXdl"
            }
        }
        const CreateElementResult = await TestModules.CreateElement(endpoint, 401, CreateData, InspectData)
    })

    it('shouldn`t update blog`s element, status: 401, Unauthorized', async () => {
        const DataUpdate = {}
        const UpdateElementResult = await TestModules.UpdateElementById(endpoint, 401, ElementId, DataUpdate, InspectData)
    })

    it('shouldn`t delete blog`s element, status: 401, Unauthorized', async () => {
        const DeleteElementByIdResult = await TestModules.DeleteElementById(endpoint, 401, ElementId, InspectData)
    })

    it('shouldn`t update blog`s element, status: 500, bad mongo object ID', async () => {

        const DataUpdate = {
            name: "My first blog",
            description: "This is my first blog :)",
            websiteUrl:	"https://samurai.by.io/"
        }       

        InspectData = {
            headers: {
                basic_auth: "Basic YWRtaW46cXdlcnR5"
            }
        }

        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 500, '574736bbffh4656664', DataUpdate, InspectData)
    })

    it('shouldn`t delete blog`s element, status: 500, bad mongo object ID', async () => {
        const DeleteElementByIdResult = await TestModules.DeleteElementById(endpoint, 500, '574736bbffh4656664', InspectData)
    })

    it('shouldn`t get blog`s element, status: 500, bad mongo object ID', async () => {
        const GetElementByIdResult = await TestModules.GetElementById(endpoint, 500, '574736bbffh4656664')
    })















    
    it('should get all blog elements with pagination, status: 200', async () => {

        const CreateData = [
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
        const CreateManyResult = await TestModules.InsertManyDataMongoDB(SETTINGS.MONGO.COLLECTIONS.blogs, CreateData)
        
        const GetAllElements = await TestModules.GetAllElements(endpoint, 200, query)
        expect(GetAllElements).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 10,
            totalCount: 11,
            item: expect.any(Array)
        }) 
        expect(GetAllElements.item).toHaveLength(10)
    })

    it('should get all blog elements with pagination and filter name, status: 200', async () => {
        query = {
            searchNameTerm: 'IT-Incubator',
            pageNumber: null,
            pageSize: null,
            sortBy: null,
            sortDirection: null
        }
        const GetAllElements = await TestModules.GetAllElements(endpoint, 200, query)
        expect(GetAllElements).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            item: expect.any(Array)
        }) 
        expect(GetAllElements.item).toHaveLength(1)
    })

    it('should get all blog elements with pagination page 2, status: 200', async () => {
        query = {
            searchNameTerm: null,
            pageNumber: 2,
            pageSize: null,
            sortBy: null,
            sortDirection: null
        }
        const GetAllElements = await TestModules.GetAllElements(endpoint, 200, query)
        expect(GetAllElements).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 10,
            totalCount: 11,
            item: expect.any(Array)
        }) 
        expect(GetAllElements.item).toHaveLength(1)
    })

    it('should get all blog elements with pagination page size 11, status: 200', async () => {
        query = {
            searchNameTerm: null,
            pageNumber: null,
            pageSize: 11,
            sortBy: null,
            sortDirection: null
        }
        const GetAllElements = await TestModules.GetAllElements(endpoint, 200, query)
        expect(GetAllElements).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 11,
            totalCount: 11,
            item: expect.any(Array)
        }) 
        expect(GetAllElements.item).toHaveLength(11)
    })

    it('should get all blog elements with pagination and sort: desc, status: 200', async () => {
        query = {
            searchNameTerm: null,
            pageNumber: null,
            pageSize: 11,
            sortBy: null,
            sortDirection: 'asc'
        }
        const GetAllElements = await TestModules.GetAllElements(endpoint, 200, query)
        expect(GetAllElements).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 11,
            totalCount: 11,
            item: expect.any(Array)
        })
        const sortedItems = GetAllElements.item.toSorted((a: any, b: any) => a.createdAt.localeCompare(b.createdAt));
        expect(GetAllElements.item).toEqual(sortedItems)

        
    })






})

