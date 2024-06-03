import { TestModules } from '../modules/modules'
import { SETTINGS } from '../../../src/settings'
import { clear } from 'console';



describe(SETTINGS.PATH.POST, () => {

    const endpoint: string = SETTINGS.PATH.POST

    let returnValues: any;
    let ElementId: string;

    let blogId: string;
    let blogName: string;
    let InspectData: any;


    it('should delete all data', async () => {
        await TestModules.DeleteAllElements()
    })

    it('should create blog`s element, status: 201, and return element', async () => {

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

        const CreateElementResult = await TestModules.CreateElement(SETTINGS.PATH.BLOG, 201, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            id: expect.any(String),
            name: CreateData.name,
            description: CreateData.description,
            websiteUrl: CreateData.websiteUrl,
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        })

        blogId = CreateElementResult.id
        blogName = CreateElementResult.name
    })

    it('should create post`s element, status: 201, and return element + GET by ID, status: 200', async () => {

        const CreateData = {
            title: "Some post title",
            shortDescription: "some short descriptions",
            content: "Some content",
            blogId: blogId
        }

        const CreateElementResult = await TestModules.CreateElement(endpoint, 201, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            id: expect.any(String),
            title: CreateData.title,
            shortDescription: CreateData.shortDescription,
            content: CreateData.content,
            blogName: blogName,
            blogId: blogId,
            createdAt: expect.any(String)
        })

        returnValues = {...CreateElementResult}
        ElementId = CreateElementResult.id

        const GetCreatedElementResult = await TestModules.GetElementById(endpoint, 200, ElementId)
        expect(GetCreatedElementResult).toEqual(CreateElementResult) 
    })

    it('should update post`s element, status: 204 + GET by ID, status: 200', async () => {
        const DataUpdate = {
            title: "Some post2 title",
            shortDescription: "some short2 descriptions",
            content: "Some2 content",
            blogId: blogId
        }

        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 204, ElementId, DataUpdate, InspectData)

        const GetUpdatedElementResult = await TestModules.GetElementById(endpoint, 200, ElementId)
        expect(GetUpdatedElementResult).toEqual({...returnValues, ...DataUpdate})
    })

    it('shouldn`t update post`s element, status: 400, empty title', async () => {
        const DataUpdate = {
            title: "",
            shortDescription: "some short2 descriptions",
            content: "Some2 content",
            blogId: blogId
        }
        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 400, ElementId, DataUpdate, InspectData)
        expect(UpdateCreatedElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'title'
                }
            ]
        })
    })

    it('should delete post`s element, status: 204 + GET by ID, status: 404', async () => {
        const DeleteElementByIdResult = await TestModules.DeleteElementById(endpoint, 204, ElementId, InspectData)
        const GetCreatedElementResult = await TestModules.GetElementById(endpoint, 404, ElementId)
    })

    it('should create two post`s elements, status: 201, and return element + GET all, status: 200 + DELETE all, status: 204', async () => {

        const CreateFirstData = {
            title: "Some post title",
            shortDescription: "some short descriptions",
            content: "Some content",
            blogId: blogId
        }

        const CreateSecondData = {
            title: "Some post title",
            shortDescription: "some short descriptions",
            content: "Some content",
            blogId: blogId
        }

        const CreateFirstElementResult = await TestModules.CreateElement(endpoint, 201, CreateFirstData, InspectData)
        expect(CreateFirstElementResult).toEqual({
            id: expect.any(String),
            title: CreateFirstData.title,
            shortDescription: CreateFirstData.shortDescription,
            content: CreateFirstData.content,
            blogName: blogName,
            blogId: blogId,
            createdAt: expect.any(String)
        })

        const CreateSecondElementResult = await TestModules.CreateElement(endpoint, 201, CreateSecondData, InspectData)
        expect(CreateSecondElementResult).toEqual({
            id: expect.any(String),
            title: CreateSecondData.title,
            shortDescription: CreateSecondData.shortDescription,
            content: CreateSecondData.content,
            blogName: blogName,
            blogId: blogId,
            createdAt: expect.any(String)
        })

        const GetAllElementsResult = await TestModules.GetAllElements(endpoint, 200)
        expect(GetAllElementsResult.length).toBe(2)
    })

    it('shouldn`t update post`s element, status: 404', async () => {
        const DataUpdate = {    
            title: "Some post title",
            shortDescription: "some short descriptions",
            content: "Some2 content",
            blogId: blogId
        } 
        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 404, ElementId, DataUpdate, InspectData)
    })

    it('shouldn`t delete post`s element, status: 404', async () => {
        const DeleteElementByIdResult = await TestModules.DeleteElementById(endpoint, 404, ElementId, InspectData)
    })

    it('shouldn`t get post`s element, status: 404', async () => {
        const GetElementByIdResult = await TestModules.GetElementById(endpoint, 404, ElementId)
    })

    it('shouldn`t get all post`s elements, status: 404', async () => {
        const GetElementByIdResult = await TestModules.GetElementById(endpoint, 404, ElementId)
    })

    it('shouldn`t create post`s element, status: 400, empty title and content', async () => {
        const CreateData = {
            title: "",
            shortDescription: "some short descriptions",
            content: "",
            blogId: blogId
        }
        const CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'title'
                }, 
                {
                    message: expect.any(String),
                    field: 'content'
                }
            ]
        })
    })

    it('shouldn`t create post`s element, status: 400, bad blog id', async () => {
        const CreateData = {
            title: "some title",
            shortDescription: "some short descriptions",
            content: "some content",
            blogId: null
        }
        const CreateElementResult = await TestModules.CreateElement(endpoint, 400, CreateData, InspectData)
        expect(CreateElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'blogId'
                }
            ]
        })
    })

    it('shouldn`t update post`s element, status: 400, bad blog id', async () => {
        const DataUpdate = {    
            title: "Some post title",
            shortDescription: "some short descriptions",
            content: "Some2 content",
            blogId: null
        } 
        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 400, ElementId, DataUpdate, InspectData)
        expect(UpdateCreatedElementResult).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'blogId'
                }
            ]
        })
    })

    it('shouldn`t create post`s element, status: 401, Unauthorized', async () => {
        const CreateData = {}
        InspectData = {
            headers: {
                basic_auth: "Basic YWRtaW46cXdl"
            }
        }
        const CreateElementResult = await TestModules.CreateElement(endpoint, 401, CreateData, InspectData)
    })

    it('shouldn`t update post`s element, status: 401, Unauthorized', async () => {
        const DataUpdate = {}
        const UpdateElementResult = await TestModules.UpdateElementById(endpoint, 401, ElementId, DataUpdate, InspectData)
    })

    it('shouldn`t delete post`s element, status: 401, Unauthorized', async () => {
        const DeleteElementByIdResult = await TestModules.DeleteElementById(endpoint, 401, ElementId, InspectData)
    })

    it('shouldn`t update post`s element, status: 400, bad mongo object ID', async () => {

        const DataUpdate = {
            title: "Some post title",
            shortDescription: "some short descriptions",
            content: "Some2 content",
            blogId: blogId
        }       

        InspectData = {
            headers: {
                basic_auth: "Basic YWRtaW46cXdlcnR5"
            }
        }

        const UpdateCreatedElementResult = await TestModules.UpdateElementById(endpoint, 400, '574736bbffh4656664', DataUpdate, InspectData)
    })

    it('shouldn`t delete post`s element, status: 400, bad mongo object ID', async () => {
        const DeleteElementByIdResult = await TestModules.DeleteElementById(endpoint, 400, '574736bbffh4656664', InspectData)
    })

    it('shouldn`t get post`s element, status: 400, bad mongo object ID and delete all elements, status: 204', async () => {
        const GetElementByIdResult = await TestModules.GetElementById(endpoint, 400, '574736bbffh4656664')
        await TestModules.DeleteAllElements()
    })
})
