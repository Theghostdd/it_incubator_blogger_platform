
import {ResultNotificationEnum, ResultNotificationType} from "../../../typings/basic-types";
import {BlogRepositories} from "../infrastructure/blog-repositories";
import {CreateInputBlogDto, UpdateInputBlogDto} from "../api/input-models/dto";
import {BlogModel} from "../domain/entity";
import {HydratedDocument} from "mongoose";
import {BlogDto} from "../domain/dto";
import {inject, injectable} from "inversify";
import {IBlogInstanceMethod} from "../domain/interfaces";

@injectable()
export class BlogService {
    constructor(
        @inject(BlogRepositories) private blogRepositories: BlogRepositories,
        @inject(BlogModel) private blogModel: typeof BlogModel
    ) {
    }

    async createBlogItem(blogDto: CreateInputBlogDto): Promise<ResultNotificationType<string>> {
        const blog: HydratedDocument<BlogDto, IBlogInstanceMethod> = this.blogModel.createInstance(blogDto)

        await this.blogRepositories.save(blog)
        return {status: ResultNotificationEnum.Success, data: blog._id.toString()}
    }

    async updateBlogById (id: string, updateBlogDto: UpdateInputBlogDto): Promise<ResultNotificationType> {
        try {
            const blog: HydratedDocument<BlogDto, IBlogInstanceMethod> | null = await this.blogRepositories.getBlogById(id)
            if (!blog) return {status: ResultNotificationEnum.NotFound, data: null}

            blog.updateInstance(updateBlogDto)
            await this.blogRepositories.save(blog)
            return  {status: ResultNotificationEnum.Success, data: null}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async deleteBlogById (id: string): Promise<ResultNotificationType> {
        try {
            const blog: HydratedDocument<BlogDto, IBlogInstanceMethod> | null = await this.blogRepositories.getBlogById(id)
            if (!blog) return {status: ResultNotificationEnum.NotFound, data: null}

            await this.blogRepositories.delete(blog)
            return {status: ResultNotificationEnum.Success, data: null}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}