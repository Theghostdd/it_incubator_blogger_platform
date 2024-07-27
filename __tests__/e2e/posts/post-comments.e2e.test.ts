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
import {CommentDto} from "../../Dto/CommentDto";



describe(ROUTERS_SETTINGS.POST.post + '/:id' + ROUTERS_SETTINGS.POST.comments, () => {

    const endpointPost: string = ROUTERS_SETTINGS.POST.post
    const endpointComments: string =ROUTERS_SETTINGS.POST.comments
    const endpointComment: string = ROUTERS_SETTINGS.COMMENTS.comments
    const endpointCommentsLikeStatus: string = ROUTERS_SETTINGS.COMMENTS.like_status

    let endpointPostComments: string
    let idPost: string
    let AuthData: any = {}
    let CreateDataComment: any = {}
    let CreateDataBlog: any = {}
    let likeStatus: any;

    let CreatedUserData: any = {}
    let userId: string
    let InsertBlogData: any;
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

        InsertBlogData = structuredClone(BlogInsert.CreateManyData)
        for (let i in InsertBlogData) {
            InsertBlogData[i].blogInfo.blogId = idBlog
            InsertBlogData[i].commentatorInfo.userId = userId
            InsertBlogData[i].postInfo.postId = idPost
        }

        likeStatus = structuredClone(CommentDto.updateLikeStatusForComment)

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
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
                myStatus: "None",
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

        await CreateManyDataUniversal(InsertBlogData, CommentModel)
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

    it('POST => GET | should get all comment without access token, like must be None', async () => {
        // Create many data
        await CreateManyDataUniversal(InsertBlogData, CommentModel)
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
        GetAllElements.body.items.forEach((item: any) => expect(item.likesInfo.myStatus).toBe("None"))
    })

    it('POST => GET | should add like and dislike to comments, and get all comments with info about like and about like current user', async () => {
        // Create many data
        const createMany = await CreateManyDataUniversal(InsertBlogData, CommentModel)

        const elementIdFirst = createMany[0]._id.toString()
        const elementIdSecond = createMany[1]._id.toString()

        // This simulates a scenario where client want to send like for comment 1
        await GetRequest()
            .put(`${endpointComment}/${elementIdFirst}${endpointCommentsLikeStatus}`)
            .set(AuthData)
            .send(likeStatus)
            .expect(204)
        // This simulates a scenario where client want to send like for comment 2
        await GetRequest()
            .put(`${endpointComment}/${elementIdSecond}${endpointCommentsLikeStatus}`)
            .set(AuthData)
            .send(likeStatus)
            .expect(204)
        // This simulates a scenario where client want to get all comment without access token
        let getAllComments = await GetRequest()
            .get(endpointPostComments)
            .expect(200)
        getAllComments.body.items.forEach((item: any) => expect(item.likesInfo.myStatus).toBe("None"))
        // This simulates a scenario where client want to get all comment witch access token
        getAllComments = await GetRequest()
            .get(endpointPostComments)
            .set(AuthData)
            .expect(200)
        getAllComments.body.items.forEach((item: any) => {
            if (item.id === elementIdFirst || item.id === elementIdSecond) {
                expect(item.likesInfo.myStatus).toBe("Like")
            } else {
                expect(item.likesInfo.myStatus).toBe("None")
            }
        })

        // This simulates a scenario where client want to send "Like" again to first element, logic repeat
        await GetRequest()
            .put(`${endpointComment}/${elementIdFirst}${endpointCommentsLikeStatus}`)
            .set(AuthData)
            .send(likeStatus)
            .expect(204)

        getAllComments = await GetRequest()
            .get(endpointPostComments)
            .expect(200)
        getAllComments.body.items.forEach((item: any) => expect(item.likesInfo.myStatus).toBe("None"))

        getAllComments = await GetRequest()
            .get(endpointPostComments)
            .set(AuthData)
            .expect(200)
        getAllComments.body.items.forEach((item: any) => {
            if (item.id === elementIdFirst || item.id === elementIdSecond) {
                expect(item.likesInfo.myStatus).toBe("Like")
            } else {
                expect(item.likesInfo.myStatus).toBe("None")
            }
        })


        // This simulates a scenario where client want to send "Dislike" to comment clint sent "like"
        likeStatus.likeStatus = "Dislike"
        await GetRequest()
            .put(`${endpointComment}/${elementIdFirst}${endpointCommentsLikeStatus}`)
            .set(AuthData)
            .send(likeStatus)
            .expect(204)

        getAllComments = await GetRequest()
            .get(endpointPostComments)
            .expect(200)
        getAllComments.body.items.forEach((item: any) => expect(item.likesInfo.myStatus).toBe("None"))

        getAllComments = await GetRequest()
            .get(endpointPostComments)
            .set(AuthData)
            .expect(200)
        getAllComments.body.items.forEach((item: any) => {
            if (item.id === elementIdFirst) {
                expect(item.likesInfo.myStatus).toBe("Dislike")
            } else if (item.id === elementIdSecond) {
                expect(item.likesInfo.myStatus).toBe("Like")
            } else {
                expect(item.likesInfo.myStatus).toBe("None")
            }
        })

        // This simulates a scenario where client want to send "None" to comments clint sent "like" and "dislike"
        likeStatus.likeStatus = "None"
        await GetRequest()
            .put(`${endpointComment}/${elementIdFirst}${endpointCommentsLikeStatus}`)
            .set(AuthData)
            .send(likeStatus)
            .expect(204)
        await GetRequest()
            .put(`${endpointComment}/${elementIdSecond}${endpointCommentsLikeStatus}`)
            .set(AuthData)
            .send(likeStatus)
            .expect(204)

        getAllComments = await GetRequest()
            .get(endpointPostComments)
            .expect(200)
        getAllComments.body.items.forEach((item: any) => expect(item.likesInfo.myStatus).toBe("None"))

        getAllComments = await GetRequest()
            .get(endpointPostComments)
            .set(AuthData)
            .expect(200)
        getAllComments.body.items.forEach((item: any) => {
            expect(item.likesInfo.myStatus).toBe("None")
        })


    })

    it('POST | should not update status like, bad data and Unauthorized', async () => {
        // Create many data

        // This simulates a scenario where client want to send like without access token
        await GetRequest()
            .put(`${endpointComment}/1${endpointCommentsLikeStatus}`)
            .send(likeStatus)
            .expect(401)

        // This simulates a scenario where client want to send bad value for like
        const result = await GetRequest()
            .put(`${endpointComment}/1${endpointCommentsLikeStatus}`)
            .set(AuthData)
            .send(likeStatus.likeStatus = "DISLIKET")
            .expect(400)
        expect(result.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'likeStatus',
                }
            ]
        })



    })

})
