import { ROUTERS_SETTINGS } from "../../../src/settings";
import {AdminAuth, CreateBlog, CreateManyDataUniversal, DropAll, GetRequest} from "../modules/modules";
import {PostModel} from "../../../src/Domain/Post/Post";

describe(ROUTERS_SETTINGS.BLOG.blogs + '/:id' + ROUTERS_SETTINGS.BLOG.blogs_posts, () => {


    const endpoint: string = ROUTERS_SETTINGS.BLOG.blogs
    const additionalEndpointPost: string = ROUTERS_SETTINGS.BLOG.blogs_posts
    let endpointBlogAndPost: string
    let CreateData: any = {}
    let idBlog: string;
    let blogName: string;

    beforeEach(async () => {
        await DropAll()
        
        const CreateDataBlog: any = {
            name: "IT-Incubator",
            description: "The blog is about IT-Incubator",
            websiteUrl:	"https://samurai.it-incubator.io/"
        }
        const CreateBlogElementResult = await CreateBlog(CreateDataBlog)
        idBlog = CreateBlogElementResult.id
        blogName = CreateBlogElementResult.name

        CreateData = {
            title: 'Some Title Post',
            shortDescription: "Some short description",
            content: "Some content"
        }

        endpointBlogAndPost = `${endpoint}/${idBlog}${ROUTERS_SETTINGS.BLOG.blogs_posts}`
    })

    it(`POST => GET | should create a post item by blog ID, status: 201, return the item and get the item by ID, status: 200, and 404 if the item not found`, async () => {
        // This simulates a scenario where creating post item by blog ID in URI params
        const CreateElementResult = await GetRequest()
            .post(endpointBlogAndPost)
            .set(AdminAuth)
            .send(CreateData)
            .expect(201)
        expect(CreateElementResult.body).toEqual({
                id: expect.any(String),
                title: CreateData.title,
                shortDescription: CreateData.shortDescription,
                content: CreateData.content,
                blogName: blogName,
                blogId: idBlog,
                createdAt: expect.any(String)
        })
        // This simulates a scenario where getting all post items by Blog id in URI params
        const GetCreatedElementResult = await GetRequest()
            .get(endpointBlogAndPost)
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

    it('POST => GET | should get all post elements with pagination and filters by blog ID, status: 200', async () => {
        // Create many data in DB
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
        await CreateManyDataUniversal(CreateManyData, PostModel)
        // This simulates a scenario where getting post item by blog ID in URI params without query params
        let GetAllElements = await GetRequest()
            .get(endpointBlogAndPost)
            .expect(200)
        expect(GetAllElements.body).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 10,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.body.items).toHaveLength(10)
        // This simulates a scenario where getting post item by blog ID in URI params with query params: pageNumber
        GetAllElements = await GetRequest()
            .get(endpointBlogAndPost)
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
        // This simulates a scenario where getting post item by blog ID in URI params with query params: pageSize
        GetAllElements = await GetRequest()
            .get(endpointBlogAndPost)
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

    it('POST | should`t create a post item by blog ID, status: 400, bad request', async () => {
        // This simulates a scenario where should not creating post by blog id into URI params because bad data: title
        CreateData.title = ''
        let CreateElementResult = await GetRequest()
            .post(endpointBlogAndPost)
            .set(AdminAuth)
            .send(CreateData)
            .expect(400)
        expect(CreateElementResult.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'title'
                }
            ]
        })
        // This simulates a scenario where should not creating post by blog id into URI params because bad data: title, shortDescription
        CreateData.shortDescription = ''
        CreateElementResult = await GetRequest()
            .post(endpointBlogAndPost)
            .set(AdminAuth)
            .send(CreateData)
            .expect(400)
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
        // This simulates a scenario where should not creating post by blog id into URI params because bad data: title, shortDescription, content
        CreateData.content = ''
        CreateElementResult =await GetRequest()
            .post(endpointBlogAndPost)
            .set(AdminAuth)
            .send(CreateData)
            .expect(400)
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

    })

    it('POST | should`t create a post item by blog ID, status: 401, Unauthorized', async () => {
        // This simulates a scenario where should not creating post by blog id into URI params because user Unauthorized
        GetRequest()
            .post(endpointBlogAndPost)
            .set({})
            .expect(401)
    })
})

