import { MONGO_SETTINGS, ROUTERS_SETTINGS } from "../../../src/settings"
import { BlogService } from "../../../src/Service/BlogService/BlogService"
import { dropCollections } from "../modules/modules";
import { BlogDto } from "../modules/dto";


const BlogCreateService = BlogService.CreateBlogItem;
const BlogUpdateService = BlogService.UpdateBlogById;
const BlogDeleteService = BlogService.DeleteBlogById;



describe(ROUTERS_SETTINGS.BLOG.blogs, () => {
    let CreateBlogData: any;
    beforeEach( async () => {
        jest.clearAllMocks()

        await dropCollections.dropBlogCollection()
        CreateBlogData = BlogDto.CreateBlogData
    })

    it('should create new Blog, and return blog item, status: Success', async () => {
        const result = await RegistrationService(RegistrationUserData)
        expect(result.status).toBe(ResultNotificationEnum.Success)

        const getCreatedUser = await db.collection(collectionUser)
            .findOne({login: RegistrationUserData.login});
        expect(getCreatedUser).not.toBeNull()
        expect(getCreatedUser).toEqual({
            _id: expect.any(ObjectId),
            login: RegistrationUserData.login,
            email: RegistrationUserData.email,
            password: expect.any(String),
            userConfirm: {
                ifConfirm: false,
                confirmationCode: expect.any(String),
                dataExpire: expect.any(String)
            },
            createdAt: expect.any(String)
        })
    })
})