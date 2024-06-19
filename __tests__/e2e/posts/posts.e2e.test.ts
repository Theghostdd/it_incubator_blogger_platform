import { TestModules } from '../modules/modules'
import { MONGO_SETTINGS, ROUTERS_SETTINGS } from '../../../src/settings'
import { CreateBlog, DeleteAllDb, GetRequest, AdminAuth, CreatedPost, CreateManyDataUniversal } from '../modules/modules2';



describe(ROUTERS_SETTINGS.POST.post, () => {

    const endpoint: string = ROUTERS_SETTINGS.POST.post

    let DataUpdate: any = {}
    let CreateDataPost: any = {}
    let idBlog: string
    let blogName: string
    let CreateDataBlog: any = {} 
    beforeEach(async () => {
        await DeleteAllDb()

        CreateDataBlog = {
            name: "IT-Incubator",
            description: "The blog is about IT-Incubator",
            websiteUrl:	"https://samurai.it-incubator.io/"
        }
        const CreatedBlog = await CreateBlog(CreateDataBlog)
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
        await DeleteAllDb()
    })

    it('POST => GET | should create a post item, status: 201, return the item and get created item, status: 200, and status: 404 if element doesn`t found', async () => {
        // This simulates a scenario where creating post item
        const CreateElementResult = await GetRequest()
            .post(endpoint)
            .set(AdminAuth)
            .send(CreateDataPost)
            .expect(201)
        expect(CreateElementResult.body).toEqual({
            id: expect.any(String),
            title: CreateDataPost.title,
            shortDescription: CreateDataPost.shortDescription,
            content: CreateDataPost.content,
            blogName: blogName,
            blogId: idBlog,
            createdAt: expect.any(String)
        })
        // This simulates a scenario we get created item
        let GetElementResult = await GetRequest()
            .get(`${endpoint}/${CreateElementResult.body.id}`)
            .expect(200)
        expect(GetElementResult.body).toEqual(CreateElementResult.body)
        // This simulates a scenario we don`t get created item, because this id not found
        GetElementResult = await GetRequest()
            .get(`${endpoint}/66632889ba80092799c0ed81`)
            .expect(404)
    })

    it('POST => DELETE => GET => DELETE | should delete a post item, status: 204 and should`t get the item by ID, status: 404 and where user delete item again status: 404', async () => {
        // Create the post item
        const CreateElementResult =  await CreatedPost(CreateDataPost)
        // This simulates a scenario where the post item success deleted
        let DeleteElementResult = await GetRequest()
            .delete(`${endpoint}/${CreateElementResult.id}`)
            .set(AdminAuth)
            .expect(204)
        // This simulates a scenario where the post item not found because was deleted
        const GetElementResult = await GetRequest()
            .get(`${endpoint}/${CreateElementResult.id}`)
            .expect(404)
        // This simulates a scenario where user want to delete the post item but it was deleted
        DeleteElementResult = await GetRequest()
            .delete(`${endpoint}/${CreateElementResult.id}`)
            .set(AdminAuth)
            .expect(404)
    })

    it('POST => PUT => GET | should update the post item by id, status: 204 and get updated the item by ID', async () => {
        // Create the post item
        const CreateElementResult =  await CreatedPost(CreateDataPost)
        // This simulates a scenario where user want to update the post item
        const UpdateElementResult = await GetRequest()
            .put(`${endpoint}/${CreateElementResult.id}`)
            .set(AdminAuth)
            .send(DataUpdate)
            .expect(204)
        // This simulates a scenario where user want to look to updated the post item
        const GetElementResult = await GetRequest()
            .get(`${endpoint}/${CreateElementResult.id}`)
            .expect(200)
        expect(GetElementResult.body).toEqual({
            id: CreateElementResult.id,
            title: DataUpdate.title,
            shortDescription: DataUpdate.shortDescription,
            content: DataUpdate.content,
            blogName: blogName,
            blogId: idBlog,
            createdAt: CreateElementResult.createdAt
        })
    })

    it('POST => GET => PUT | should`t update a post item, status: 400, bad request, and status: 404, not found', async () => {
        // Create the post item
        const CreateElementResult =  await CreatedPost(CreateDataPost)
        // This simulates a scenario where post not found
        let UpdateElementResult = await GetRequest()
            .put(`${endpoint}/66632889ba80092799c0ed81`)
            .set(AdminAuth)
            .send(DataUpdate)
            .expect(404)
        // This simulates a scenario where post data to update has bad shortDescription
        DataUpdate.shortDescription = '';
        UpdateElementResult = await GetRequest()
            .put(`${endpoint}/${CreateElementResult.id}`)
            .set(AdminAuth)
            .send(DataUpdate)
            .expect(400)
        expect(UpdateElementResult.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: 'shortDescription'
                    }
                ]
            })
        // This simulates a scenario where post data to update has bad shortDescription, title
        DataUpdate.title = '';
        UpdateElementResult = await GetRequest()
            .put(`${endpoint}/${CreateElementResult.id}`)
            .set(AdminAuth)
            .send(DataUpdate)
            .expect(400)
        expect(UpdateElementResult.body).toEqual({
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
        // This simulates a scenario where post data to update has bad shortDescription, title, content
        DataUpdate.content = '';
        UpdateElementResult = await GetRequest()
            .put(`${endpoint}/${CreateElementResult.id}`)
            .set(AdminAuth)
            .send(DataUpdate)
            .expect(400)
        expect(UpdateElementResult.body).toEqual({
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
        // This simulates a scenario where post data to update has bad shortDescription, title, content, blogId
        DataUpdate.blogId = '66632889ba80092799c0ed81';
        UpdateElementResult = await GetRequest()
            .put(`${endpoint}/${CreateElementResult.id}`)
            .set(AdminAuth)
            .send(DataUpdate)
            .expect(400)
        expect(UpdateElementResult.body).toEqual({
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

    it('POST => GET | should get all post elements with pagination and filters, status: 200', async () => {
        // Create data 
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
        // Insert many data to Mongo
        await CreateManyDataUniversal(CreateManyData, MONGO_SETTINGS.COLLECTIONS.posts)
        // This simulates a scenario where user want to get all items without query params
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
        // This simulates a scenario where user want to get all items with query, page number 2
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
        // This simulates a scenario where user want to get all items with query, element on page 11
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

    it('POST | should`t create a post item, status: 400, bad request', async () => {
        // This simulates a scenario where user send bad title
        CreateDataPost.title = ''
        let CreateElementResult = await GetRequest()
            .post(endpoint)
            .set(AdminAuth)
            .send(CreateDataPost)
        expect(CreateElementResult.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'title'
                }
            ]
        })
        // This simulates a scenario where user send bad title, shortDescription
        CreateDataPost.shortDescription = ''
        CreateElementResult = await GetRequest()
            .post(endpoint)
            .set(AdminAuth)
            .send(CreateDataPost)
        expect(CreateElementResult.body).toEqual({
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
        // This simulates a scenario where user send bad title, shortDescription, content
        CreateDataPost.content = ''
        CreateElementResult = await GetRequest()
            .post(endpoint)
            .set(AdminAuth)
            .send(CreateDataPost)
        expect(CreateElementResult.body).toEqual({
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
        // This simulates a scenario where user send bad title, shortDescription, content, blogId
        CreateDataPost.blogId = '66632889ba80092799c0ed89'
        CreateElementResult = await GetRequest()
            .post(endpoint)
            .set(AdminAuth)
            .send(CreateDataPost)
        expect(CreateElementResult.body).toEqual({
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
        // This simulates a scenario where user want to create a post item but he doesn`t have login or password
        const CreateElementResult = await GetRequest()
            .post(endpoint)
            .set({})
            .expect(401)
        // This simulates a scenario where user want to update the post item but he doesn`t have login or password
        const UpdateCreatedElementResult = await GetRequest()
            .put(`${endpoint}/66632889ba80092799c0ed81`)
            .set({Authorization: "Basic YWRtaW46cXdl"})
            .expect(401)
        // This simulates a scenario where user want to delete the post item but he doesn`t have login or password
        const DeleteElementResult = await GetRequest()
            .delete(`${endpoint}/66632889ba80092799c0ed81`)
            .set({Authorization: "Basic YWRtaW46cXdl"})
            .expect(401)
    })

    it('POST => PUT => DELETE => GET | should`t update, delete, get a blog item by ID, status: 500, bad mongo object ID', async () => {
        // This simulates a scenario where user want to update the post but post`s id not object ID
        const UpdateCreatedElementResult = await GetRequest()
            .put(`${endpoint}/66632889ba80092`)
            .set(AdminAuth)
            .send(DataUpdate)
            .expect(500)
        // This simulates a scenario where user want to delete the post but post`s id not object ID
        const DeleteElementResult = await GetRequest()
            .delete(`${endpoint}/66632889ba80092`)
            .set(AdminAuth)
            .expect(500)
        // This simulates a scenario where user want to get the post but post`s id not object ID
        const GetElementResult = await GetRequest()
            .get(`${endpoint}/66632889ba80092`)
            .expect(500)
    })
})
