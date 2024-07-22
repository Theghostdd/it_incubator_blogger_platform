import { PostCreateInputModelType, PostInputModelType, PostViewMongoModelType } from "../../Applications/Types-Models/Post/PostTypes"
import {PostModel} from "../../Domain/Post/Post";



export const PostRepositories = {
    /* 
    * Create a new post.
    * Return of the insertion result.
    * If an error occurs during the insertion, catch the error and throw it as a generic Error.
    */
    async CreatePost (data: PostCreateInputModelType): Promise<PostViewMongoModelType> {
        try {
            return await new PostModel(data).save()
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*     
    * Updating the post by its identifier.
    *   - title.
    *   - short description.
    *   - content.
    * Return the result of the operation.
    * If an error occurs during the update, catch the error and throw it as a generic Error.
    */
    async UpdatePostById (id: string, data: PostInputModelType): Promise<PostViewMongoModelType | null> {
        try {
            return await PostModel.findByIdAndUpdate(id, {
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content
            })
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * Deleting a post by its ID.
    * Return the result of the operation.
    * If an error occurs during the delete operation, catch the error and throw it as a generic Error.
    */
    async DeletePostById (id: string): Promise<PostViewMongoModelType | null> {
        try {   
            return await PostModel.findByIdAndDelete(id)
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Getting a post by its ID.
    * Return the result of the operation.
    * If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async GetPostById (id: string): Promise<PostViewMongoModelType | null> {
        try {   
            return await PostModel.findById(id)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}