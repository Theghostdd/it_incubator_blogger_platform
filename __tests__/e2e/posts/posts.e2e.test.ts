import { TestModules } from '../modules/modules'
import { SETTINGS } from '../../../src/settings'
import { idBlogForPost, nameBlog } from '../blogs/blogs.e2e.test';
import { after } from 'node:test';



describe(SETTINGS.PATH.POST, () => {

    const endpoint: string = SETTINGS.PATH.POST

    let returnValues: any;
    let inspectData: any;
    let idElement: string;
    let idElementToDell: string;

    it('should create post`s element, status: 201, and return element', async () => {

        const DataToSend = {
            title: "Some post title",
            shortDescription: "some short descriptions",
            content: "Some content",
            blogId: idBlogForPost
        }

        inspectData = {
            status: 201,
            headers: {
                basic_auth: "Basic YWRtaW46cXdlcnR5"
            },
            checkValues: {
                id: expect.any(String),
                title: DataToSend.title,
                shortDescription: DataToSend.shortDescription,
                content: DataToSend.content,
                blogId: DataToSend.blogId,
                blogName: nameBlog
            }
        }

        const result = await TestModules.CreateElement(endpoint, DataToSend, inspectData)
        returnValues = {...result}
        idElement = result.id
    })

    it('should create second post`s element, status: 201, and return element', async () => {

        const DataToSend = {
            title: "Some post title",
            shortDescription: "some short descriptions",
            content: "Some content",
            blogId: idBlogForPost
        }

        const result = await TestModules.CreateElement(endpoint, DataToSend, inspectData)
        idElementToDell = result.id
    })

    it('should get created first element, status: 200, and return element', async () => {

        inspectData = {
            ...inspectData,
            status: 200,
            checkValues: {
                ...returnValues
            }
        }
        const result = await TestModules.GetElementById(endpoint, idElement, inspectData)
    })

    it('should get all element, status: 200, and return array elements',async () => {
        const result = await TestModules.GetAllElements(endpoint, inspectData)
    })

    it('should delete second element, status: 204', async () => {
        inspectData = {
            ...inspectData,
            status: 204

        }
        const result = await TestModules.DeleteElementById(endpoint, idElementToDell, inspectData)
    })

    it('should update first created element, status: 204', async () => {

        const DataToUpdate = {
            title: "Some post title2",
            shortDescription: "some short2 descriptions",
            content: "Some content2",
            blogId: idBlogForPost
        }

        inspectData = {
            ...inspectData,
            status: 204,
            checkValues: {
                ...inspectData.checkValues,
                ...DataToUpdate
            }
        }

        const result = await TestModules.UpdateElementById(endpoint, idElement, DataToUpdate, inspectData)
    })

    it('should get updated element, status: 200, and return elements',async () => {
        inspectData = {
            ...inspectData,
            status: 200
        }
        const result = await TestModules.GetElementById(endpoint, idElement, inspectData)
    })

    it('shouldn`t get element, status: 404',async () => {
        inspectData = {
            ...inspectData,
            status: 404
        }
        const result = await TestModules.GetElementById(endpoint, "0", inspectData)
    })

    it('shouldn`t update element, status: 404',async () => {
        const DataToUpdate = {
            title: "Some post title",
            shortDescription: "some short descriptions",
            content: "Some content",
            blogId: idBlogForPost
        }

        const result = await TestModules.UpdateElementById(endpoint, "0", DataToUpdate, inspectData)
    })

    it('shouldn`t delete element, status: 404',async () => {
        const result = await TestModules.DeleteElementById(endpoint, "0", inspectData)
    })

    it('shouldn`t update element, bad request, empty "title", status: 400',async () => {
        const DataToUpdate = {
            title: "",
            shortDescription: "some short descriptions",
            content: "Some content",
            blogId: idBlogForPost
        }

        inspectData = {
            ...inspectData,
            status: 400,
            checkValues: {
                errorsMessages: [
                    {
                        "message": expect.any(String),
                        "field": expect.any(String)
                    }
                ]
            }
        }

        const result = await TestModules.UpdateElementById(endpoint, idElement, DataToUpdate, inspectData)
    })

    it('shouldn`t update element, bad request, empty title and empty blogId, status: 400',async () => {
        const DataToUpdate = {
            title: "",
            shortDescription: "some short descriptions",
            content: "Some content",
            blogId: ""
        }

        inspectData = {
            ...inspectData,
            status: 400,
            checkValues: {
                errorsMessages: [
                    {
                        "message": expect.any(String),
                        "field": expect.any(String)
                    },
                    {
                        "message": expect.any(String),
                        "field": expect.any(String)
                    }
                ]
            }
        }

        const result = await TestModules.UpdateElementById(endpoint, idElement, DataToUpdate, inspectData)
    })

    it('shouldn`t update element, Unauthorized, incorrect data, status: 401',async () => {
        inspectData = {
            status: 401,
            headers: {
                basic_auth: "Basic YWRtaW46"
            },
            checkValues: {
                ...inspectData.checkValues
            }
        }

        const result = await TestModules.UpdateElementById(endpoint, idElement, null, inspectData)
    })

    it('shouldn`t delete element, Unauthorized, incorrect data, status: 401',async () => {

        inspectData = {
            ...inspectData,
            headers: {
                basic_auth: "Basic YWRtaW46"
            },
        }

        const result = await TestModules.DeleteElementById(endpoint, idElement, inspectData)
    })

    it('shouldn`t create element, Unauthorized, incorrect data, status: 401',async () => {

        inspectData = {
            ...inspectData,
            headers: {
                basic_auth: "Basic YWRtaW46"
            },
        }

        const result = await TestModules.CreateElement(endpoint, null, inspectData)
    })

    it('shouldn`t create element, blog id not found, status: 404',async () => {

        const DataToSend = {
            title: "some title",
            shortDescription: "some short descriptions",
            content: "Some content",
            blogId: "0"
        }

        inspectData = {
            ...inspectData,
            status: 404,
            headers: {
                basic_auth: "Basic YWRtaW46cXdlcnR5"
            }
        }

        const result = await TestModules.CreateElement(endpoint, DataToSend, inspectData)
    })

    it('shouldn`t update element, blog id not found, status: 404',async () => {

        const DataToUpdate = {
            title: "some title",
            shortDescription: "some short descriptions",
            content: "Some content",
            blogId: "0"
        }

        inspectData = {
            ...inspectData,
            status: 404,
            headers: {
                basic_auth: "Basic YWRtaW46cXdlcnR5"
            }
        }
        const result = await TestModules.CreateElement(endpoint, DataToUpdate, inspectData)
    })

    after(async () => {
        await TestModules.DeleteAllElements()
    })
})
