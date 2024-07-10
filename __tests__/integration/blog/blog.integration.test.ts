import { MONGO_SETTINGS, ROUTERS_SETTINGS } from "../../../src/settings"
import { BlogService } from "../../../src/Service/BlogService/BlogService"
import { dropCollections } from "../modules/modules";
import { ResultNotificationEnum } from "../../../src/Applications/Types-Models/BasicTypes";
import { BlogDto } from "../../Dto/BlogDto";


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
        const result = await BlogCreateService(CreateBlogData)
        expect(result).toEqual({
            status: ResultNotificationEnum.Success,
            data: {
                id: expect.any(String),
                name: CreateBlogData.name,
                description: CreateBlogData.description,
                websiteUrl: CreateBlogData.websiteUrl,
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
            }
        })
    })
})