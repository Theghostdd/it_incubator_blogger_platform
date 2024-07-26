import { ROUTERS_SETTINGS } from '../../../src/settings'
import {
    CreateBlog,
    GetRequest,
    AdminAuth,
    CreatedPost,
    CreateUser,
    LoginUser,
    DropAll,
    CreateManyDataUniversal
} from '../modules/modules';
import {CommentModel} from "../../../src/Domain/Comment/Comment";
import {BlogInsert} from "../../Dto/BlogDto";



describe(ROUTERS_SETTINGS.POST.post + '/:id' + ROUTERS_SETTINGS.POST.comments, () => {

    const endpointPost: string = ROUTERS_SETTINGS.POST.post
    const endpointComments: string =ROUTERS_SETTINGS.POST.comments

    let endpointPostComments: string
    let idPost: string
    let AuthData: any = {}
    let CreateDataComment: any = {}
    let CreateDataBlog: any = {}

    let CreatedUserData: any = {}
    let userId: string
    let InsertPostData: any;
    beforeEach(async () => {
        await DropAll()

        CreateDataBlog = {
            name: "IT-Incubator",
            description: "The blog is about IT-Incubator",
            websiteUrl:	"https://samurai.it-incubator.io/"
        }
        const CreatedBlog = await CreateBlog(CreateDataBlog)
        const idBlog = CreatedBlog.id

        const CreateDataPost = {
            title: 'Some Title post',
            shortDescription: "Some short description",
            content: "Some content",
            blogId: idBlog
        }
        const CreatePost = await CreatedPost(CreateDataPost)
        idPost = CreatePost.id
        endpointPostComments = endpointPost + '/' + idPost + ROUTERS_SETTINGS.POST.comments

        CreatedUserData = {
            login: 'TestLogin',
            password: "somePass",
            email: "example@mail.ru"
        }
        const CreatedUserResult = await CreateUser(CreatedUserData)
        userId = CreatedUserResult.id

        const LoginData = {
            loginOrEmail: CreatedUserData.login,
            password: CreatedUserData.password,
        }
        const LoginUserResult = await LoginUser(LoginData)
        
        AuthData = {
            Authorization: 'Bearer ' + LoginUserResult.accessToken
        }

        CreateDataComment = {
            content: "some content some content some content some content"
        }

        InsertPostData = structuredClone(BlogInsert.CreateManyData)
        for (let i in InsertPostData) {
            InsertPostData[i].blogInfo.blogId = idBlog
            InsertPostData[i].commentatorInfo.userId = userId
            InsertPostData[i].postInfo.postId = idPost
        }

    })

    it('POST => GET | should create the comment item, status: 201, return the item and get all items by post id, status: 200, and status: 404 if element not found', async () => {
        // This simulates a scenario where the user creating the comment by post id
        const CreateElementResult = await GetRequest()
            .post(endpointPostComments)
            .set(AuthData)
            .send(CreateDataComment)
            .expect(201)
        expect(CreateElementResult.body).toEqual({
            id: expect.any(String),
            content: CreateDataComment.content,
            commentatorInfo: {
                userId: userId,
                userLogin: CreatedUserData.login
            },
            createdAt: expect.any(String)
          })
        // This simulates a scenario where the user getting all comments item to post by post ID 
        let GetElementResult = await GetRequest()
            .get(endpointPostComments)
            .expect(200)
        expect(GetElementResult.body.items).toEqual([CreateElementResult.body])
        // This simulates a scenario we don`t get created item, because this id not found
        await GetRequest()
            .get(`${endpointPost}/66632889ba80092799c0ed81${endpointComments}`)
            .expect(404)
    })

    it('POST | should`t create the comment item, status: 400, bad data', async () => {
        // This simulates a scenario where the user should not do creating the comment because bad content data
        CreateDataComment.content = 'some'
        const CreateElementResult = await GetRequest()
            .post(endpointPostComments)
            .set(AuthData)
            .send(CreateDataComment)
            .expect(400)
        expect(CreateElementResult.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'content'
                }
            ]
        })
    })

    it('POST | should`t create the comment item, status: 401, Unauthorized', async () => {
        // This simulates a scenario where the user should not do creating the comment because the user Unauthorized
        CreateDataComment.content = 'some'
        await GetRequest()
            .post(endpointPostComments)
            .set({Authorization: ""})
            .expect(401)
    })

    it('POST | should`t create the comment item, status: 404, post id not found', async () => {
        // This simulates a scenario where the user should not do creating the comment because post id not found
        CreateDataComment.content = 'some'
        await GetRequest()
            .post(`${endpointPost}/66632889ba80092799c0ed81/${endpointComments}`)
            .set(AuthData)
            .send(CreateDataComment)
            .expect(404)
    })

    it('POST => GET | should get all post elements with pagination and filters by blog ID, status: 200', async () => {
        // Create many data

        await CreateManyDataUniversal(InsertPostData, CommentModel)
        // This simulates a scenario where user want to get all comments without query params
        let GetAllElements = await GetRequest()
            .get(endpointPostComments)
            .expect(200)
        expect(GetAllElements.body).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 10,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.body.items).toHaveLength(10)
        // This simulates a scenario where user want to get all comments with query params: pageNumber
        GetAllElements = await GetRequest()
            .get(endpointPostComments)
            .query({pageNumber: 2})
            .set(AdminAuth)
            .expect(200)
        expect(GetAllElements.body).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 10,
            totalCount: 11,
            items: expect.any(Array)
        }) 
        expect(GetAllElements.body.items).toHaveLength(1)
        // This simulates a scenario where user want to get all user with query params: pageSize
        GetAllElements = await GetRequest()
            .get(endpointPostComments)
            .query({pageSize: 11})
            .set(AdminAuth)
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
})
