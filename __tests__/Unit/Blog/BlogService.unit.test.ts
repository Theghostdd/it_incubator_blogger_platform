
import { MONGO_SETTINGS, ROUTERS_SETTINGS } from "../../../src/settings"
import { BlogService } from "../../../src/Service/BlogService/BlogService"

import { ResultNotificationEnum } from "../../../src/Applications/Types-Models/BasicTypes";
import {BlogDto} from "../../Dto/BlogDto";
import { BlogMock } from "../../Mock/mock";


const BlogCreateService = BlogService.CreateBlogItem;
const BlogUpdateService = BlogService.UpdateBlogById;



describe(ROUTERS_SETTINGS.BLOG.blogs, () => {
    let CreateBlogData: any;
    let UpdateBlogData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        
        CreateBlogData = BlogDto.CreateBlogData
        UpdateBlogData = BlogDto.UpdateBlogData
    })
    it('should create new Blog, status: Success', async () => {
        BlogMock.DefaultBlogValuesMock()
        BlogMock.CreateBlogMock()
        BlogMock.GetBlogByIdWithoutMapMock()
        BlogMock.MapCreatedBlog()
        
        const result = await BlogCreateService(CreateBlogData)
        expect(result.status).toBe(ResultNotificationEnum.Success)
    })

    it('should update Blog item, status: Success', async () => {
        BlogMock.UpdateBlogByIdMockResolve()

        const result = await BlogUpdateService('1', UpdateBlogData)
        expect(result.status).toBe(ResultNotificationEnum.Success)
    })

    it('should not update Blog item, status: Success', async () => {
        BlogMock.UpdateBlogByIdMockRejected()

        const result = await BlogUpdateService('1', UpdateBlogData)
        expect(result.status).toBe(ResultNotificationEnum.NotFound)
    })


})