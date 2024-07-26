
import {ResultNotificationEnum, ResultNotificationType} from "../../typings/basic-types";
import {BlogRepositories} from "./blog-repositories";
import {defaultBlogValues} from "../../internal/utils/default-values/blog/default-blog-value";
import {BlogModel} from "../../Domain/Blog/Blog";
import {blogMapper} from "../../internal/utils/map/blogMap";
import {BlogCreateInputModelType, BlogInputModelType, BlogViewModelType, BlogViewMongoType} from "./blog-types";


export class BlogService {
    constructor(
        protected blogRepositories: BlogRepositories,
        protected blogModel: typeof BlogModel
    ) {
    }
    async createBlogItem (data: BlogInputModelType): Promise<ResultNotificationType<BlogViewModelType>> {
        try {
            const createData: BlogCreateInputModelType = {...data, ...await defaultBlogValues.defaultCreateValues()}
            const createdResult: BlogViewMongoType = await this.blogRepositories.save(new this.blogModel(createData))

            return {status: ResultNotificationEnum.Success, data: blogMapper.mapBlog(createdResult)}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async updateBlogById (id: string, data: BlogInputModelType): Promise<ResultNotificationType> {
        try {
            const blog: InstanceType<typeof BlogModel> | null = await this.blogRepositories.getBlogById(id)
            if (!blog) return {status: ResultNotificationEnum.NotFound}

            blog.name = data.name
            blog.description = data.description
            blog.websiteUrl = data.websiteUrl

            await this.blogRepositories.save(blog)
            return  {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async deleteBlogById (id: string): Promise<ResultNotificationType> {
        try {
            const blog: InstanceType<typeof BlogModel> | null = await this.blogRepositories.getBlogById(id)
            if (!blog) return {status: ResultNotificationEnum.NotFound}

            await this.blogRepositories.delete(blog)
            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}