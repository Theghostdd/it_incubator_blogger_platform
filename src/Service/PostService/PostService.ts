import { ResultNotificationEnum, ResultNotificationType } from "../../Applications/Types-Models/BasicTypes"
import { CommentCreateType, CommentInputModelType, CommentMongoViewType, CommentViewModelType } from "../../Applications/Types-Models/Comment/CommentTypes"
import { PostCreateInputModelType, PostInputModelType, PostViewModelType, PostViewMongoModelType } from "../../Applications/Types-Models/Post/PostTypes"
import { BlogRepositories } from "../../Repositories/BlogRepositories/BlogRepositories"
import { CommentRepositories } from "../../Repositories/CommentRepositories/CommentRepositories"
import { PostRepositories } from "../../Repositories/PostRepositories/PostRepositories"
import { UserRepositories } from "../../Repositories/UserRepostitories/UserRepositories"
import { defaultCommentValues } from "../../utils/default-values/Comment/default-comment-value"
import { defaultPostValues } from "../../utils/default-values/Post/default-post-value"
import { CommentsMap } from "../../utils/map/Comments/CommentsMap"
import { PostMapper } from "../../utils/map/Post/PostMap"
import {BlogViewMongoType} from "../../Applications/Types-Models/Blog/BlogTypes";
import {UserViewMongoType} from "../../Applications/Types-Models/User/UserTypes";





export const PostService = {
    /*
    * Checking the existence of the blog.
    * If the blog does not exist, throw out the error.
    * If a blog exists, create a post object to insert data into the database.
    * Creation of a long-term contract.
    * Returning success and mapping the returned object to return the post model.
    * If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async CreatePostItemByBlogId (data: PostInputModelType): Promise<ResultNotificationType<PostViewModelType>> {
        try {
            const getBlogById: BlogViewMongoType | null = await BlogRepositories.GetBlogById(data.blogId)
            if (!getBlogById) return {status: ResultNotificationEnum.NotFound}

            const CreateData: PostCreateInputModelType  = {...data, ...await defaultPostValues.defaultCreateValues(getBlogById.name)}
            const result: PostViewMongoModelType= await PostRepositories.CreatePost(CreateData)

            return {status: ResultNotificationEnum.Success, data: await PostMapper.MapPost(result)}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Updating a post by its ID.
    * If the post was not found, the error was returned.
    * If the post has been found and updated, the return is successful.
    * If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async UpdatePostById (id: string, data: PostInputModelType): Promise<ResultNotificationType> { 
        try {
            const result: PostViewMongoModelType | null = await PostRepositories.UpdatePostById(id, data)
            return result ? {status: ResultNotificationEnum.Success} : {status: ResultNotificationEnum.NotFound}
        } catch (e: any) {
            throw new Error(e)
        }   
    },
    /*
    * Deleting a post by its ID.
    * If the error was not returned when deleting the post.
    * If the post was successfully found and deleted, a success return.
    * If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async DeletePostById (id: string): Promise<ResultNotificationType> {
        try {
            const result: PostViewMongoModelType | null = await PostRepositories.DeletePostById(id)
            return result ? {status: ResultNotificationEnum.Success} : {status: ResultNotificationEnum.NotFound}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Checking that the user exists before creating a post.
    * If the user does not exist, the error is returned.
    * * If the user exists, check the existence of the post.
    * If the post does not exist, the error is returned.
    * If the post exists, create a data object to create a comment document.
    * Create a comment on the post.
    * Return of the post model for the client.
    * If an error occurs during the retrieval process, catch the error and throw it as a generic Error.
    */
    async CreateCommentByPostId (data: CommentInputModelType, postId: string, userId: string): Promise<ResultNotificationType<CommentViewModelType>> {
        try {

            const getUser: UserViewMongoType | null = await UserRepositories.GetUserById(userId)
            if (!getUser) return {status: ResultNotificationEnum.NotFound}

            const getPost: PostViewMongoModelType | null = await PostRepositories.GetPostById(postId)
            if (!getPost) return {status: ResultNotificationEnum.NotFound}

            const CreateData: CommentCreateType = {
                content: data.content,
                commentatorInfo: {
                    userId: getUser._id.toString(),
                    userLogin: getUser.login
                },
                postInfo: {
                    postId: getPost._id.toString()
                },
                blogInfo: {
                    blogId: getPost.blogId,
                },
                ...await defaultCommentValues.defaultCreateValues()
            }

            const resultCreate: CommentMongoViewType = await CommentRepositories.CreateComment(CreateData)

            return {status: ResultNotificationEnum.Success, data: await CommentsMap.MapComment(resultCreate)}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}