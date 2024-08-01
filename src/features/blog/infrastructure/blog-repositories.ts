import {HydratedDocument} from "mongoose";
import {BlogModel, } from "../domain/entity";
import {DeleteResult} from "mongodb";
import {BlogDto} from "../domain/dto";
import {inject, injectable} from "inversify";
import {IBlogInstanceMethod} from "../domain/interfaces";

@injectable()
export class BlogRepositories {

    constructor(
        @inject(BlogModel) private blogModel: typeof BlogModel
    ) {}

    async save(blog: HydratedDocument<BlogDto, IBlogInstanceMethod>): Promise<void> {
        await blog.save()
    }

    async delete (data: HydratedDocument<BlogDto, IBlogInstanceMethod>): Promise<void> {
        const result: DeleteResult = await data.deleteOne()
        if (result.deletedCount < 1) {
            throw new Error('Something went wrong')
        }
    }

    async getBlogById(id: string): Promise<HydratedDocument<BlogDto, IBlogInstanceMethod> | null> {
        return this.blogModel.findById(id)
    }
}