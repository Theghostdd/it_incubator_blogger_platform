import { ROUTERS_SETTINGS } from '../../../src/settings'
import {AdminAuth, CreateBlog, CreateManyDataUniversal, DropAll, GetRequest} from '../modules/modules';
import {BlogModel} from "../../../src/Domain/Blog/Blog";

describe(ROUTERS_SETTINGS.BLOG.blogs, () => {

    const endpoint: string = ROUTERS_SETTINGS.BLOG.blogs

    let CreateData: any = {}
    let CreateManyData: any = []
    let DataUpdate: any;
    
    beforeEach(async () => {
        await DropAll()

        CreateData = {
            name: "IT-Incubator",
            description: "The blog is about IT-Incubator",
            websiteUrl:	"https://samurai.it-incubator.io/"
        }

        DataUpdate = {
            name: "IT-Incubator 2",
            description: "I had some error, this blog is about IT-Incubator 2",
            websiteUrl:	"https://samurai.by.io/"
        }
    })

    it('POST => GET | should create a blog item, status: 201, return the item and get the item by ID, status: 200, if element does not found, status: 404', async () => {
        // This simulates a scenario where the blog item success create
        const CreateElementResult = await GetRequest()
            .post(endpoint)
            .set(AdminAuth)
            .send(CreateData)
            .expect(201)
        expect(CreateElementResult.body).toEqual({
            id: expect.any(String),
            name: CreateData.name,
            description: CreateData.description,
            websiteUrl: CreateData.websiteUrl,
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        })
        // This simulates a scenario where the blog item success getting
        const GetCreatedElementResult = await GetRequest()
            .get(`${endpoint}/${CreateElementResult.body.id}`)
            .expect(200)
        expect(GetCreatedElementResult.body).toEqual(CreateElementResult.body)
        // This simulates a scenario where the blog not found
        await GetRequest()
            .get(`${endpoint}/66632889ba80092799c0ed81`)
            .expect(404)
    })

    it('POST => PUT => GET | should update a blog item, status: 204 and get the item by ID, status: 200', async () => {
        // Create element
        const CreateElement = await CreateBlog(CreateData)
        // This simulates a scenario where the blog item success updated
        await GetRequest()
            .put(`${endpoint}/${CreateElement.id}`)
            .set(AdminAuth)
            .send(DataUpdate)
            .expect(204)
        // This simulates a scenario where the blog item success updated and his data is correct
        const GetElementResult = await GetRequest()
            .get(`${endpoint}/${CreateElement.id}`)
            .expect(200)
        expect(GetElementResult.body).toEqual({...CreateElement, ...DataUpdate})
    })

    it('POST => DELETE | should delete a blog item, status: 204 and should`t delete the item by ID, status: 404', async () => {
        // Create element
        const CreateElement = await CreateBlog(CreateData)
        // This simulates a scenario where the blog item success delete by ID
        await GetRequest()
            .delete(`${endpoint}/${CreateElement.id}`)
            .set(AdminAuth)
            .expect(204)
        // This simulates a scenario where the blog item not found because was deleted
        await GetRequest()
            .delete(`${endpoint}/${CreateElement.id}`)
            .set(AdminAuth)
            .expect(404)
    })

    it('POST => PUT | should`t update a blog item, status: 400, bad request, and status: 404, not found', async () => {
        // This simulates a scenario where the blog item not found when user want to update item
        let UpdateElementResult = await GetRequest()
            .put(`${endpoint}/66632889ba80092799c0ed81`)
            .set(AdminAuth)
            .send(DataUpdate)
            .expect(404)
        // This simulates a scenario where the blog item does not update because bad description
        DataUpdate.description = ''
        UpdateElementResult = await GetRequest()
            .put(`${endpoint}/id`)
            .set(AdminAuth)
            .send(DataUpdate)
            .expect(400)
        expect(UpdateElementResult.body).toEqual({
                    errorsMessages: [
                        {
                            message: expect.any(String),
                            field: 'description'
                        }
                    ]
                })
        // This simulates a scenario where the blog item does not update because bad description, name
        DataUpdate.name = ''
        UpdateElementResult = await GetRequest()
            .put(`${endpoint}/id`)
            .set(AdminAuth)
            .send(DataUpdate)
            .expect(400)
        expect(UpdateElementResult.body).toEqual({
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
        // This simulates a scenario where the blog item does not update because bad description, name, websiteUrl
        DataUpdate.websiteUrl = 'https:.by.io/'
        UpdateElementResult = await GetRequest()
            .put(`${endpoint}/id`)
            .set(AdminAuth)
            .send(DataUpdate)
            .expect(400)
        expect(UpdateElementResult.body).toEqual({
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

    it('DELETE => POST => GET | should get all blog elements with pagination and filters, status: 200', async () => {
        // Create many data
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
        await CreateManyDataUniversal(CreateManyData, BlogModel)
        // This simulates a scenario where get all item without query params
        let GetAllElements = await GetRequest()
            .get(endpoint)
            .expect(200)
        expect(GetAllElements.body).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 10,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.body.items).toHaveLength(10)
        // This simulates a scenario where get all item with query params searchNameTerm
        GetAllElements = await GetRequest()
            .get(endpoint)
            .query({searchNameTerm: 'IT-Incubator'})
            .expect(200)
        expect(GetAllElements.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.body.items).toHaveLength(1)
        // This simulates a scenario where get all item with query params pageNumber
        GetAllElements = await GetRequest()
            .get(endpoint)
            .query({pageNumber: 2})
            .expect(200)
        expect(GetAllElements.body).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 10,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.body.items).toHaveLength(1)
        // This simulates a scenario where get all item with query params pageSize
        GetAllElements = await GetRequest()
            .get(endpoint)
            .query({pageSize: 11})
            .expect(200)
        expect(GetAllElements.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 11,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.body.items).toHaveLength(11)
    })

    it('POST | should`t create a blog item, status: 400, bad request', async () => {
        // This simulates a scenario where the blog item does not do created because bad name
        CreateData.name = ''
        let CreateElementResult = await GetRequest()
            .post(endpoint)
            .set(AdminAuth)
            .send(CreateData)
            .expect(400)
        expect(CreateElementResult.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'name'
                }
            ]
        })
        // This simulates a scenario where the blog item does not do created because bad name, description
        CreateData.description = ''
        CreateElementResult = await GetRequest()
            .post(endpoint)
            .set(AdminAuth)
            .send(CreateData)
            .expect(400)
        expect(CreateElementResult.body).toEqual({
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
        // This simulates a scenario where the blog item does not do created because bad name, description, websiteUrl
        CreateData.websiteUrl = 'it-incubator.io/'
        CreateElementResult = await GetRequest()
            .post(endpoint)
            .set(AdminAuth)
            .send(CreateData)
            .expect(400)
        expect(CreateElementResult.body).toEqual({
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
        // This simulates a scenario where the user Unauthorized
        await GetRequest()
            .post(endpoint)
            .set({Authorization: ""})
            .expect(401)

        await GetRequest()
            .put(`${endpoint}/66632889ba80092799c0ed81`)
            .expect(401)

        await GetRequest()
            .delete(`${endpoint}/66632889ba80092799c0ed81`)
            .set({Authorization: "Basic fkrjjfhryfjc"})
            .expect(401)
    })

    it('PUT => DELETE => GET | should`t update, delete, get a blog item by ID, status: 500, bad mongo object ID', async () => {
        // This simulates a scenario where was sent bad id (Not Mongo ID)
        await GetRequest()
            .put(`${endpoint}/66632889ba80092799`)
            .set(AdminAuth)
            .send(DataUpdate)
            .expect(500)

        await GetRequest()
            .delete(`${endpoint}/66632889ba80092799`)
            .set(AdminAuth)
            .expect(500)

        await GetRequest()
            .get(`${endpoint}/66632889ba80092799`)
            .expect(500)
    })
})

