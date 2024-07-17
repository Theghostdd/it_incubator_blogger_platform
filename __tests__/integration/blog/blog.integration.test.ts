import { MONGO_SETTINGS, ROUTERS_SETTINGS } from "../../../src/settings"
import { BlogService } from "../../../src/Service/BlogService/BlogService"
import { ResultNotificationEnum } from "../../../src/Applications/Types-Models/BasicTypes";
import { BlogDto, BlogInsert } from "../../Dto/BlogDto";
import { DropCollections, InsertOneDataModule } from "../../Modules/Body.Modules";


const BlogCreateService = BlogService.CreateBlogItem;
const BlogUpdateService = BlogService.UpdateBlogById;
const BlogDeleteService = BlogService.DeleteBlogById;

const collectionBlog = MONGO_SETTINGS.COLLECTIONS.blogs

describe(BlogCreateService, () => {
    let CreateBlogData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await DropCollections.DropBlogCollection()
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

describe(BlogUpdateService, () => {
    let UpdateBlogData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await DropCollections.DropBlogCollection()
        UpdateBlogData = BlogDto.UpdateBlogData
    })

    it('should update blog by id, status: Success', async () => {
        const InsertBlog = await InsertOneDataModule(BlogInsert.BlogInsertData, collectionBlog)
        const result = await BlogUpdateService(InsertBlog.insertedId.toString(), UpdateBlogData)
        expect(result.status).toBe(ResultNotificationEnum.Success)
    })

    it('should not update blog by id, status: NotFound', async () => {
        const result = await BlogUpdateService('6697b3bb206b31770075051b', UpdateBlogData)
        expect(result.status).toBe(ResultNotificationEnum.NotFound)
    })
})

describe(BlogDeleteService, () => {
    beforeEach( async () => {
        jest.clearAllMocks()
        await DropCollections.DropBlogCollection()
    })

    it('should delete blog by id, status: Success', async () => {
        const InsertBlog = await InsertOneDataModule(BlogInsert.BlogInsertData, collectionBlog)
        const result = await BlogDeleteService(InsertBlog.insertedId.toString())
        expect(result.status).toBe(ResultNotificationEnum.Success)
    })

    it('should not delete blog by id, status: NotFound', async () => {
        const result = await BlogDeleteService('6697b3bb206b31770075051b')
        expect(result.status).toBe(ResultNotificationEnum.NotFound)
    })
})