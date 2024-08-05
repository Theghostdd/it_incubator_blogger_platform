import { MONGO_SETTINGS, } from "../../../src/settings"
import { BlogService } from "../../../src/Service/BlogService/BlogService"
import { ResultNotificationEnum } from "../../../src/typings/basic-types";
import { BlogDto, BlogInsert } from "../../Dto/BlogDto";
import {BlogModule, Drop} from "../modules/modules";
import mongoose from "mongoose";

beforeAll(async () => {
    await mongoose.connect(MONGO_SETTINGS.URL, {dbName: MONGO_SETTINGS.DB_NAME})
})
afterAll(async () => {
    await mongoose.disconnect();
})

const BlogCreateService = BlogService.CreateBlogItem;
const BlogUpdateService = BlogService.UpdateBlogById;
const BlogDeleteService = BlogService.DeleteBlogById;

describe(BlogCreateService, () => {
    let CreateBlogData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()
        CreateBlogData = structuredClone(BlogDto.CreateBlogData)
    })

    it('should create new blog, and return blog item, status: Success', async () => {
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
    let BlogInsertData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()
        UpdateBlogData = structuredClone(BlogDto.UpdateBlogData)
        BlogInsertData = structuredClone(BlogInsert.BlogInsertData)
    })

    it('should update blog by id, status: Success', async () => {
        const InsertBlog = await BlogModule.CreateBlogModule(BlogInsertData)
        const result = await BlogUpdateService(InsertBlog!._id.toString(), UpdateBlogData)
        expect(result.status).toBe(ResultNotificationEnum.Success)
    })

    it('should not update blog by id, status: NotFound', async () => {
        const result = await BlogUpdateService('6697b3bb206b31770075052b', UpdateBlogData)
        expect(result.status).toBe(ResultNotificationEnum.NotFound)
    })
})

describe(BlogDeleteService, () => {
    let BlogInsertData: any;
    beforeEach( async () => {
        jest.clearAllMocks()
        await Drop.DropAll()
        BlogInsertData = structuredClone(BlogInsert.BlogInsertData)
    })

    it('should delete blog by id, status: Success', async () => {
        const InsertBlog = await BlogModule.CreateBlogModule(BlogInsertData)
        const result = await BlogDeleteService(InsertBlog!._id.toString())
        expect(result.status).toBe(ResultNotificationEnum.Success)
    })

    it('should not delete blog by id, status: NotFound', async () => {
        const result = await BlogDeleteService('6697b3bb206b31770075051b')
        expect(result.status).toBe(ResultNotificationEnum.NotFound)
    })
})