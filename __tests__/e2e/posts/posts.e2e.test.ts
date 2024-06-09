import { TestModules } from '../modules/modules'
import { SETTINGS } from '../../../src/settings'
import { clear } from 'console';



describe(SETTINGS.PATH.POST, () => {

    const endpoint: string = SETTINGS.PATH.POST


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

        const CreatedBlog = await TestModules.CreateElement(SETTINGS.PATH.BLOG, 201, CreateData, InspectData)
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

        const GetCreatedElementResult = await TestModules.GetElementById(endpoint, 200, ElementId)
        expect(GetCreatedElementResult).toEqual(CreateElementResult) 

        const GetElementResult = await TestModules.GetElementById(endpoint, 404, "66632889ba80092799c0ed81")
    })

    it('POST => PUT => GET | should update a post item, status: 204 and get the item by ID, status: 200', async () => {
        const CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateDataPost, InspectData)
        const ElementId = CreateElementResult.id
        const returnValues = {...CreateElementResult}

        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 204, ElementId, DataUpdate, InspectData)

        const GetUpdatedElementResult = await TestModules.GetElementById(endpoint, 200, ElementId)
        expect(GetUpdatedElementResult).toEqual({...returnValues, ...DataUpdate})
    })

    it('POST => DELETE => GET | should delete a post item, status: 204 and should`t get the item by ID, status: 404', async () => {

        const CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateDataPost, InspectData)
        const ElementId = CreateElementResult.id

        let DeleteElementResult = await TestModules.DeleteElementById(endpoint, 204, ElementId, InspectData)

        const GetUpdatedElementResult = await TestModules.GetElementById(endpoint, 404, ElementId)

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
        const CreateManyResult = await TestModules.InsertManyDataMongoDB(SETTINGS.MONGO.COLLECTIONS.posts, CreateManyData)

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
        const GetCreatedElementResult = await TestModules.GetElementById(endpoint, 500, "66632889ba80092799")
    })

























    // it('should delete all data', async () => {
    //     await TestModules.DeleteAllElements()
    // })

    // it('should create blog`s element, status: 201, and return element', async () => {

    //     const CreateData = {
    //         name: "My first blog",
    //         description: "This is my first blog :)",
    //         websiteUrl:	"https://samurai.it-incubator.io/"
    //     }

    //     InspectData = {
    //         headers: {
    //             basic_auth: "Basic YWRtaW46cXdlcnR5"
    //         }
    //     }

    //     const CreateElementResult = await TestModules.CreateElement(SETTINGS.PATH.BLOG, 201, CreateData, InspectData)
    //     expect(CreateElementResult).toEqual({
    //         id: expect.any(String),
    //         name: CreateData.name,
    //         description: CreateData.description,
    //         websiteUrl: CreateData.websiteUrl,
    //         createdAt: expect.any(String),
    //         isMembership: expect.any(Boolean)
    //     })

    //     blogId = CreateElementResult.id
    //     blogName = CreateElementResult.name
    // })

    // it('should create post`s element, status: 201, and return element + GET by ID, status: 200', async () => {

    //     const CreateData = {
    //         title: "Some post title",
    //         shortDescription: "some short descriptions",
    //         content: "Some content",
    //         blogId: blogId
    //     }

    //     const CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateData, InspectData)
    //     expect(CreateElementResult).toEqual({
    //         id: expect.any(String),
    //         title: CreateData.title,
    //         shortDescription: CreateData.shortDescription,
    //         content: CreateData.content,
    //         blogName: blogName,
    //         blogId: blogId,
    //         createdAt: expect.any(String)
    //     })

    //     returnValues = {...CreateElementResult}
    //     ElementId = CreateElementResult.id

    //     const GetCreatedElementResult = await TestModules.GetElementById(endpoint, 200, ElementId)
    //     expect(GetCreatedElementResult).toEqual(CreateElementResult) 
    // })

    // it('should update post`s element, status: 204 + GET by ID, status: 200', async () => {
    //     const DataUpdate = {
    //         title: "Some post2 title",
    //         shortDescription: "some short2 descriptions",
    //         content: "Some2 content",
    //         blogId: blogId
    //     }

    //     const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 204, ElementId, DataUpdate, InspectData)

    //     const GetUpdatedElementResult = await TestModules.GetElementById(endpoint, 200, ElementId)
    //     expect(GetUpdatedElementResult).toEqual({...returnValues, ...DataUpdate})
    // })

    // it('shouldn`t update post`s element, status: 400, empty title', async () => {
    //     const DataUpdate = {
    //         title: "",
    //         shortDescription: "some short2 descriptions",
    //         content: "Some2 content",
    //         blogId: blogId
    //     }
    //     const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 400, ElementId, DataUpdate, InspectData)
    //     expect(UpdateCreatedElementResult).toEqual({
    //         errorsMessages: [
    //             {
    //                 message: expect.any(String),
    //                 field: 'title'
    //             }
    //         ]
    //     })
    // })

    // it('should delete post`s element, status: 204 + GET by ID, status: 404', async () => {
    //     const DeleteElementByIdResult = await TestModules.DeleteElementById(endpoint, 204, ElementId, InspectData)
    //     const GetCreatedElementResult = await TestModules.GetElementById(endpoint, 404, ElementId)
    // })

    // it('should create two post`s elements, status: 201, and return element + GET all, status: 200 + DELETE all, status: 204', async () => {

    //     const CreateFirstData = {
    //         title: "Some post title",
    //         shortDescription: "some short descriptions",
    //         content: "Some content",
    //         blogId: blogId
    //     }

    //     const CreateSecondData = {
    //         title: "Some post title",
    //         shortDescription: "some short descriptions",
    //         content: "Some content",
    //         blogId: blogId
    //     }

    //     const CreateFirstElementResult = await TestModules.CreateElement(endpoint, 201, CreateFirstData, InspectData)
    //     expect(CreateFirstElementResult).toEqual({
    //         id: expect.any(String),
    //         title: CreateFirstData.title,
    //         shortDescription: CreateFirstData.shortDescription,
    //         content: CreateFirstData.content,
    //         blogName: blogName,
    //         blogId: blogId,
    //         createdAt: expect.any(String)
    //     })

    //     const CreateSecondElementResult = await TestModules.CreateElement(endpoint, 201, CreateSecondData, InspectData)
    //     expect(CreateSecondElementResult).toEqual({
    //         id: expect.any(String),
    //         title: CreateSecondData.title,
    //         shortDescription: CreateSecondData.shortDescription,
    //         content: CreateSecondData.content,
    //         blogName: blogName,
    //         blogId: blogId,
    //         createdAt: expect.any(String)
    //     })

    //     const GetAllElementsResult = await TestModules.GetAllElements(endpoint, 200, query)
    //     expect(GetAllElementsResult.item.length).toBe(2)
    // })

    // it('shouldn`t update post`s element, status: 404', async () => {
    //     const DataUpdate = {    
    //         title: "Some post title",
    //         shortDescription: "some short descriptions",
    //         content: "Some2 content",
    //         blogId: blogId
    //     } 
    //     const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 404, ElementId, DataUpdate, InspectData)
    // })

    // it('shouldn`t delete post`s element, status: 404', async () => {
    //     const DeleteElementByIdResult = await TestModules.DeleteElementById(endpoint, 404, ElementId, InspectData)
    // })

    // it('shouldn`t get post`s element, status: 404', async () => {
    //     const GetElementByIdResult = await TestModules.GetElementById(endpoint, 404, ElementId)
    // })

    // it('shouldn`t get all post`s elements, status: 404', async () => {
    //     const GetElementByIdResult = await TestModules.GetElementById(endpoint, 404, ElementId)
    // })

    // it('shouldn`t create post`s element, status: 400, empty title and content', async () => {
    //     const CreateData = {
    //         title: "",
    //         shortDescription: "some short descriptions",
    //         content: "",
    //         blogId: blogId
    //     }
    //     const CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateData, InspectData)
    //     expect(CreateElementResult).toEqual({
    //         errorsMessages: [
    //             {
    //                 message: expect.any(String),
    //                 field: 'title'
    //             }, 
    //             {
    //                 message: expect.any(String),
    //                 field: 'content'
    //             }
    //         ]
    //     })
    // })

    // it('shouldn`t create post`s element, status: 400, bad blog id', async () => {
    //     const CreateData = {
    //         title: "some title",
    //         shortDescription: "some short descriptions",
    //         content: "some content",
    //         blogId: null
    //     }
    //     const CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateData, InspectData)
    //     expect(CreateElementResult).toEqual({
    //         errorsMessages: [
    //             {
    //                 message: expect.any(String),
    //                 field: 'blogId'
    //             }
    //         ]
    //     })
    // })

    // it('shouldn`t update post`s element, status: 400, bad blog id', async () => {
    //     const DataUpdate = {    
    //         title: "Some post title",
    //         shortDescription: "some short descriptions",
    //         content: "Some2 content",
    //         blogId: null
    //     } 
    //     const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 400, ElementId, DataUpdate, InspectData)
    //     expect(UpdateCreatedElementResult).toEqual({
    //         errorsMessages: [
    //             {
    //                 message: expect.any(String),
    //                 field: 'blogId'
    //             }
    //         ]
    //     })
    // })

    // it('shouldn`t create post`s element, status: 401, Unauthorized', async () => {
    //     const CreateData = {}
    //     InspectData = {
    //         headers: {
    //             basic_auth: "Basic YWRtaW46cXdl"
    //         }
    //     }
    //     const CreateElementResult = await TestModules.CreateElement(endpoint, 401, CreateData, InspectData)
    // })

    // it('shouldn`t update post`s element, status: 401, Unauthorized', async () => {
    //     const DataUpdate = {}
    //     const UpdateElementResult = await TestModules.UpdateElementById(endpoint, 401, ElementId, DataUpdate, InspectData)
    // })

    // it('shouldn`t delete post`s element, status: 401, Unauthorized', async () => {
    //     const DeleteElementByIdResult = await TestModules.DeleteElementById(endpoint, 401, ElementId, InspectData)
    // })

    // it('shouldn`t update post`s element, status: 500, bad mongo object ID', async () => {

    //     const DataUpdate = {
    //         title: "Some post title",
    //         shortDescription: "some short descriptions",
    //         content: "Some2 content",
    //         blogId: blogId
    //     }       

    //     InspectData = {
    //         headers: {
    //             basic_auth: "Basic YWRtaW46cXdlcnR5"
    //         }
    //     }

    //     const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 500, '574736bbffh4656664', DataUpdate, InspectData)
    // })

    // it('shouldn`t delete post`s element, status: 500, bad mongo object ID', async () => {
    //     const DeleteElementByIdResult = await TestModules.DeleteElementById(endpoint, 500, '574736bbffh4656664', InspectData)
    // })

    // it('shouldn`t get post`s element, status: 500, bad mongo object ID and delete all elements, status: 204', async () => {
    //     const GetElementByIdResult = await TestModules.GetElementById(endpoint, 500, '574736bbffh4656664')
    //     await TestModules.DeleteAllElements()
    // })
})
