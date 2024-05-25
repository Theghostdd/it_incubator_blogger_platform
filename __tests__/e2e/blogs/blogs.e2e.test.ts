import { before } from 'node:test';
import { SETTINGS } from '../../../src/settings'
import { TestModules } from '../modules/modules'



export let idBlogForPost: string;
export let nameBlog: string;

describe(SETTINGS.PATH.BLOG, () => {

    const endpoint: string = SETTINGS.PATH.BLOG

    let returnValues: any;
    let inspectData: any;
    let idElement: string;
    let idElementToDell: string;
    
    it('should delete all data', async () => {
        await TestModules.DeleteAllElements()
    })

    it('should create blog`s element, status: 201, and return element', async () => {

        const DataToSend = {
            name: "My first blog",
            description: "This is my first blog :)",
            websiteUrl:	"https://samurai.it-incubator.io/"
        }

        inspectData = {
            status: 201,
            headers: {
                basic_auth: "Basic YWRtaW46cXdlcnR5"
            },
            checkValues: {
                id: expect.any(String),
                name: DataToSend.name,
                description: DataToSend.description,
                websiteUrl: DataToSend.websiteUrl
            }
        }

        const result = await TestModules.CreateElement(endpoint, DataToSend, inspectData)
        returnValues = {...result}
        idElement = result.id     
    })

    it('should create second blog`s element, status: 201, and return element', async () => {

        const DataToSend = {
            name: "My second blog",
            description: "This is my second blog :)",
            websiteUrl:	"https://samurai2.it-incubator.io/"
        }

        inspectData = {
            status: 201,
            headers: {
                basic_auth: "Basic YWRtaW46cXdlcnR5"
            },
            checkValues: {
                id: expect.any(String),
                name: DataToSend.name,
                description: DataToSend.description,
                websiteUrl: DataToSend.websiteUrl
            }
        }

        const result = await TestModules.CreateElement(endpoint, DataToSend, inspectData)
        idElementToDell = result.id
    })

    it('should get created element, status: 200, and return element', async () => {

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
        inspectData = {
            ...inspectData,
            status: 200
        }
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
            "name": "Some name",
            "description": "This is update data",
            "websiteUrl": "https://7oSpp64mhpMHrXqhPGYn.l8T02dRa2ubNczTgs5XwGNTM6QlyUBI5HZV4Ecr3rn_oU7.8nUvx9Kt1_yOl_AHNyzyex6i"
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
            "name": "Some name",
            "description": "This is update data",
            "websiteUrl": "https://7oSpp64mhpMHrXqhPGYn.l8T02dRa2ubNczTgs5XwGNTM6QlyUBI5HZV4Ecr3rn_oU7.8nUvx9Kt1_yOl_AHNyzyex6i"
        }

        const result = await TestModules.UpdateElementById(endpoint, "0", DataToUpdate, inspectData)
    })

    it('shouldn`t delete element, status: 404',async () => {
        const result = await TestModules.DeleteElementById(endpoint, "0", inspectData)
    })

    it('shouldn`t update element, bad request, empty "name", status: 400',async () => {
        const DataToUpdate = {
            "name": "",
            "description": "This is update data",
            "websiteUrl": "https://7oSpp64mhpMHrXqhPGYn.l8T02dRa2ubNczTgs5XwGNTM6QlyUBI5HZV4Ecr3rn_oU7.8nUvx9Kt1_yOl_AHNyzyex6i"
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

    it('shouldn`t update element, bad request, bad URL, status: 400',async () => {
        const DataToUpdate = {
            "name": "Some name",
            "description": "This is update data",
            "websiteUrl": "https7oSpp64mhpMHrXqhPGYn.l8T02dRa2ubNczTgs5XwGNTM6QlyUBI5HZV4Ecr3rn_oU7.8nUvx9Kt1_yOl_AHNyzyex6i"
        }

        const result = await TestModules.UpdateElementById(endpoint, idElement, DataToUpdate, inspectData)
    })

    it('shouldn`t update element, bad request, bad URL and empty name, status: 400',async () => {
        const DataToUpdate = {
            "name": "",
            "description": "This is update data",
            "websiteUrl": "https7oSpp64mhpMHrXqhPGYn.l8T02dRa2ubNczTgs5XwGNTM6QlyUBI5HZV4Ecr3rn_oU7.8nUvx9Kt1_yOl_AHNyzyex6i"
        }

        inspectData = {
            ...inspectData,
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
            ...inspectData,
            status: 401,
            headers: {
                basic_auth: "Basic YWRtaW46"
            }
        }

        const result = await TestModules.UpdateElementById(endpoint, idElement, null, inspectData)
    })

    it('shouldn`t delete element, Unauthorized, incorrect data, status: 401',async () => {
        const result = await TestModules.DeleteElementById(endpoint, idElement, inspectData)
    })

    it('shouldn`t create element, Unauthorized, incorrect data, status: 401',async () => {
        const result = await TestModules.CreateElement(endpoint, null, inspectData)
    })

    it('should create blog`s element for post, status: 201, and return element', async () => {

        const DataToSend = {
            name: "My blog",
            description: "This is my blog :)",
            websiteUrl:	"https://samurai.it-incubator.io/"
        }

        inspectData = {
            status: 201,
            headers: {
                basic_auth: "Basic YWRtaW46cXdlcnR5"
            },
            checkValues: {
                id: expect.any(String),
                name: DataToSend.name,
                description: DataToSend.description,
                websiteUrl: DataToSend.websiteUrl
            }
        }

        const result = await TestModules.CreateElement(endpoint, DataToSend, inspectData)
        idBlogForPost = result.id
        nameBlog = result.name
    })
})

