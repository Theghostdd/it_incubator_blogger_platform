import {
    BlogCreateInputModelType,
    BlogInputModelType,
    BlogViewMongoType
} from "../../Applications/Types-Models/Blog/BlogTypes"
import {BlogModel} from "../../Domain/Blog/Blog";


export const BlogRepositories = {
    /* 
    * Create a new blog and return the document.
    * If an error occurs during the insertion process, it throws a new Error with the caught exception.
    */    
    async CreateBlog (data: BlogCreateInputModelType): Promise<BlogViewMongoType> {
        try {
            return await new BlogModel(data).save()
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Search for a blog by ID, if the blog was not found, return null
    * If an error occurs during the update process, it throws a new Error with the caught exception.
    */
    async GetBlogById (id: string): Promise<BlogViewMongoType | null> {
        try {
            return await BlogModel.findById(id)
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * Updating blog data:
    * - Description,
    * - The name.
    * - Website.
    * * Return an updated document, if the document was not found, return an empty object.
    * If an error occurs during the update process, it throws a new Error with the caught exception.
    */ 
    async UpdateBlogById (id: string, data: BlogInputModelType): Promise<BlogViewMongoType | null> {
        try {
            return await BlogModel.findByIdAndUpdate(id,  {
                description: data.description,
                websiteUrl: data.websiteUrl,
                name: data.name
            })
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Deleting a blog by its ID.
    * If the blog was found to return the deleted item, otherwise the return is null.
    * If an error occurs during the deletion process, it throws a new Error with the caught exception.
    */ 
    async DeleteBlogById (id: string): Promise<BlogViewMongoType | null> {
        try {
            return await BlogModel.findByIdAndDelete(id)
        } catch (e: any) {
            throw new Error(e)
        }
    },
}