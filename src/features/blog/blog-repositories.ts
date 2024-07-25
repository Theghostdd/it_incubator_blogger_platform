
import {BlogModel} from "../../Domain/Blog/Blog";
import {BlogViewMongoType} from "./blog-types";
import {DeleteResult} from "mongodb";


export class BlogRepositories {

    constructor(
        protected blogModel: typeof BlogModel
    ) {
    }

    async save (blog: InstanceType<typeof BlogModel>): Promise<BlogViewMongoType> {
        try {
            return blog.save()
        } catch (e: any) {
            throw new Error(e)
        }
    }


    async delete (data: InstanceType<typeof BlogModel>): Promise<DeleteResult> {
        try {
            return await data.deleteOne()
        } catch (e: any) {
            throw new Error(e)
        }
    }


    async getBlogById (id: string): Promise<InstanceType<typeof BlogModel> | null> {
        try {
            return await this.blogModel.findById(id)
        } catch (e: any) {
            throw new Error(e)
        }
    }



}