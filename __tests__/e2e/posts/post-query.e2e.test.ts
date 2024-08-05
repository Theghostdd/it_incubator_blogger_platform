import { ROUTERS_SETTINGS } from "../../../src/settings"
import { AuthDto, RegistrationDto } from "../../Dto/AuthDto"
import { BlogDto } from "../../Dto/BlogDto"
import { PostDto } from "../../Dto/PostDto"
import { CreateBlog, CreateUser, CreatedPost, DropAll, GetRequest, LoginUser, likePost } from "../modules/modules"


const delay = () => {
    return new Promise((res, rej) => setTimeout(() => {
        Promise.resolve()
    }, 1000))
}
describe("Test query repositories", () => {

    const endpointPost: string = ROUTERS_SETTINGS.POST.post
    const endpointLikePost: string = ROUTERS_SETTINGS.POST.like_status

    let postData: any;
    let registrationData: any;
    let authData: any;
    beforeEach(async () => {
        await DropAll()

        registrationData = structuredClone(RegistrationDto.RegistrationUserData)
        authData = structuredClone(AuthDto.AuthUserData)
        const blogData = structuredClone(BlogDto.CreateBlogData)
        postData = structuredClone(PostDto.CreatePostData)

        const blog  = await CreateBlog(blogData)
        postData.blogId = blog.id
    })
        

    it('Should get post item with info like, authorized user', async () => {
        const user = await CreateUser(registrationData)
        const auth = await LoginUser(authData)
        const accessToken = auth.accessToken
        const post1 = await CreatedPost(postData)
        const post2 = await CreatedPost(postData)
        const post3 = await CreatedPost(postData)
        const post4 = await CreatedPost(postData)

        await likePost(post1.id, "Like", accessToken)
        await likePost(post2.id, "Dislike", accessToken)
        await likePost(post3.id, "Like", accessToken)


        const result = await GetRequest()
            .get(endpointPost)
            .set({Authorization: `Bearer ${accessToken}`})
            .expect(200)

        expect(result.body.totalCount).toBe(4)
        expect(result.body.items.length).toBe(4)
        expect(result.body.items[0].extendedLikesInfo).toEqual({
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "None",
            newestLikes: expect.any(Array)
        })    
        expect(result.body.items[1].extendedLikesInfo).toEqual({
            likesCount: 1,
            dislikesCount: 0,
            myStatus: "Like",
            newestLikes: expect.any(Array)
        })
        expect(result.body.items[2].extendedLikesInfo).toEqual({
            likesCount: 0,
            dislikesCount: 1,
            myStatus: "Dislike",
            newestLikes: expect.any(Array)
        })
        expect(result.body.items[3].extendedLikesInfo).toEqual({
            likesCount: 1,
            dislikesCount: 0,
            myStatus: "Like",
            newestLikes: expect.any(Array)
        })
    })

    it('Should get post item with info like, with 4 user', async () => {
        await CreateUser(registrationData)
        const user2RegData = {
            login: "SomeLogin1",
            email: "Some1@mail.ru"
        }
        registrationData.login = user2RegData.login
        registrationData.email = user2RegData.email
        await CreateUser(registrationData)
        const user3RegData = {
            login: "SomeLogin2",
            email: "Some2@mail.ru"
        }
        registrationData.login = user3RegData.login
        registrationData.email = user3RegData.email
        await CreateUser(registrationData)
        const user4RegData = {
            login: "SomeLogin3",
            email: "Some3@mail.ru"
        }
        registrationData.login = user4RegData.login
        registrationData.email = user4RegData.email
        await CreateUser(registrationData)

        const auth1 = await LoginUser(authData)
        authData.loginOrEmail = user2RegData.login
        const auth2 = await LoginUser(authData)
        authData.loginOrEmail = user3RegData.login
        const auth3 = await LoginUser(authData)
        authData.loginOrEmail = user4RegData.login
        const auth4 = await LoginUser(authData)


        const accessToken1 = auth1.accessToken
        const accessToken2 = auth2.accessToken
        const accessToken3 = auth3.accessToken
        const accessToken4 = auth4.accessToken

        const post1 = await CreatedPost(postData)
        const post2 = await CreatedPost(postData)
        const post3 = await CreatedPost(postData)
        const post4 = await CreatedPost(postData)


        await likePost(post4.id, "Like", accessToken1)
        await likePost(post4.id, "Dislike", accessToken2)
        await likePost(post4.id, "Like", accessToken3)
        await likePost(post4.id, "Like", accessToken4)

        const result = await GetRequest()
            .get(endpointPost)
            .set({Authorization: `Bearer ${accessToken2}`})
            .expect(200)

        expect(result.body.totalCount).toBe(4)
        expect(result.body.items.length).toBe(4)
        expect(result.body.items[0].extendedLikesInfo).toEqual({
            likesCount: 3,
            dislikesCount: 1,
            myStatus: "Dislike",
            newestLikes: expect.any(Array)
        })    
        expect(result.body.items[1].extendedLikesInfo).toEqual({
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "None",
            newestLikes: expect.any(Array)
        })
        expect(result.body.items[2].extendedLikesInfo).toEqual({
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "None",
            newestLikes: expect.any(Array)
        })
        expect(result.body.items[3].extendedLikesInfo).toEqual({
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "None",
            newestLikes: expect.any(Array)
        })
    })


    it('Should get post item with info like, and correct info about 3 last likes', async () => {
        const user1 = await CreateUser(registrationData)
        const user2RegData = {
            login: "SomeLogin1",
            email: "Some1@mail.ru"
        }
        registrationData.login = user2RegData.login
        registrationData.email = user2RegData.email
        const user2 = await CreateUser(registrationData)
        const user3RegData = {
            login: "SomeLogin2",
            email: "Some2@mail.ru"
        }
        registrationData.login = user3RegData.login
        registrationData.email = user3RegData.email
        const user3 = await CreateUser(registrationData)
        const user4RegData = {
            login: "SomeLogin3",
            email: "Some3@mail.ru"
        }
        registrationData.login = user4RegData.login
        registrationData.email = user4RegData.email
        const user4 = await CreateUser(registrationData)
        const user5RegData = {
            login: "SomeLogin5",
            email: "Some5@mail.ru"
        }
        registrationData.login = user5RegData.login
        registrationData.email = user5RegData.email
        const user5 = await CreateUser(registrationData)

        const auth1 = await LoginUser(authData)
        authData.loginOrEmail = user2RegData.login
        const auth2 = await LoginUser(authData)
        authData.loginOrEmail = user3RegData.login
        const auth3 = await LoginUser(authData)
        authData.loginOrEmail = user4RegData.login
        const auth4 = await LoginUser(authData)
        authData.loginOrEmail = user5RegData.login
        const auth5 = await LoginUser(authData)


        const accessToken1 = auth1.accessToken
        const accessToken2 = auth2.accessToken
        const accessToken3 = auth3.accessToken
        const accessToken4 = auth4.accessToken
        const accessToken5 = auth5.accessToken


        const post1 = await CreatedPost(postData)
        const post2 = await CreatedPost(postData)
        const post3 = await CreatedPost(postData)
        const post4 = await CreatedPost(postData)


        await likePost(post4.id, "Like", accessToken1)
        await likePost(post4.id, "Dislike", accessToken2)
        await likePost(post4.id, "Like", accessToken3)
        await likePost(post4.id, "Like", accessToken4)
        await likePost(post4.id, "Like", accessToken5)



        await likePost(post3.id, "Like", accessToken4)

        const result = await GetRequest()
            .get(endpointPost)
            .set({Authorization: `Bearer ${accessToken2}`})
            .expect(200)

        expect(result.body.totalCount).toBe(4)
        expect(result.body.items.length).toBe(4)

        expect(result.body.items[0].extendedLikesInfo.newestLikes.length).toBe(3)
        expect(result.body.items[0].extendedLikesInfo).toEqual({
            likesCount: 4,
            dislikesCount: 1,
            myStatus: "Dislike",
            newestLikes: [
                {
                    addedAt: expect.any(String),
                    userId: user5.id,
                    login: user5.login
                },
                {
                    addedAt: expect.any(String),
                    userId: user4.id,
                    login: user4.login
                },
                {
                    addedAt: expect.any(String),
                    userId: user3.id,
                    login: user3.login
                },
            ]
        })    

        expect(result.body.items[1].extendedLikesInfo.newestLikes.length).toBe(1)
        expect(result.body.items[1].extendedLikesInfo).toEqual({
            likesCount: 1,
            dislikesCount: 0,
            myStatus: "None",
            newestLikes: [
                {
                    addedAt: expect.any(String),
                    userId: user4.id,
                    login: user4.login
                }
            ]
        })    

        expect(result.body.items[2].extendedLikesInfo.newestLikes.length).toBe(0)
        expect(result.body.items[2].extendedLikesInfo).toEqual({
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "None",
            newestLikes: []
        })  

        expect(result.body.items[3].extendedLikesInfo.newestLikes.length).toBe(0)
        expect(result.body.items[3].extendedLikesInfo).toEqual({
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "None",
            newestLikes: []
        })  

    
    })
})





