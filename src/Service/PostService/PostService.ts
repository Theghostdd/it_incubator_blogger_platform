import { CreatedMongoSuccessType, DeletedMongoSuccessType, ResultNotificationEnum, ResultNotificationType, UpdateMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { BlogViewMongoModelType } from "../../Applications/Types-Models/Blog/BlogTypes"
import { CommentCreateType, CommentInputModelType, CommentMongoViewType, CommentViewModelType } from "../../Applications/Types-Models/Comment/CommentTypes"
import { PostCreateInputModelType, PostInputModelType, PostViewModelType, PostViewMongoModelType } from "../../Applications/Types-Models/Post/PostTypes"
import { UserViewMongoModelType } from "../../Applications/Types-Models/User/UserTypes"
import { BlogRepositories } from "../../Repositories/BlogRepositories/BlogRepositories"
import { CommentRepositories } from "../../Repositories/CommentRepositories/CommentRepositories"
import { PostRepositories } from "../../Repositories/PostRepositories/PostRepositories"
import { UserRepositories } from "../../Repositories/UserRepostitories/UserRepositories"
import { CreateDefaultValueDate } from "../../Utils/default-values/Date/CreateDefaultDate"
import { defaultPostValues } from "../../Utils/default-values/Post/default-post-value"
import { CommentsMap } from "../../Utils/map/Comments/CommentsMap"
import { PostMapper } from "../../Utils/map/Post/PostMap"





export const PostService = {
    /*
    * 1. Fetch the blog associated with `data.blogId` 
    *    - If the blog is not found, return a `NotFound` status.
    * 2. If the blog exists, merge the input  with default post values based on the blog's name
    * 3. Create a new post in the database with the merged data
    * 4. Retrieve the newly created post from the database using its ID obtained from the creation result.
    *    - If the post cannot be retrieved, return a `NotFound` status.
    * 5. Map the created post to the appropriate view model
    * 6. Return a success status along with the mapped post data.
    */
    async CreatePostItemByBlogId (data: PostInputModelType): Promise<ResultNotificationType<PostViewModelType>> {
        try {
            const getBlogById: BlogViewMongoModelType | null = await BlogRepositories.GetBlogByIdWithoutMap(data.blogId)
            if (!getBlogById) {
                return {status: ResultNotificationEnum.NotFound}
            }

            const CreateData: PostCreateInputModelType  = {...data, ...await defaultPostValues.defaultCreateValues(getBlogById.name)}
            const result: CreatedMongoSuccessType= await PostRepositories.CreatePost(CreateData)

            const getCreatedPost: PostViewMongoModelType | null = await PostRepositories.GetPostByIdWithoutMap(result.insertedId.toString())

            if (!getCreatedPost) {
                return {status: ResultNotificationEnum.NotFound}
            }
            return {status: ResultNotificationEnum.Success, data: await PostMapper.MapCreatePost(getCreatedPost)}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * 1. Update the post item by post ID
    * 2. Return HTTP status 
    *   - If the item updated status: 204 "No content",
    *   - If the item not found status: 404 "Not found"
    */
    async UpdatePostById (id: string, data: PostInputModelType): Promise<ResultNotificationType> { 
        try {
            const result: UpdateMongoSuccessType = await PostRepositories.UpdatePostById(id, data)
            return result.matchedCount > 0 ? {status: ResultNotificationEnum.Success} : {status: ResultNotificationEnum.NotFound}
        } catch (e: any) {
            throw new Error(e)
        }   
    },
        /* 
    * 1. Delete the post item by post ID
    * 2. Return HTTP status 
    *   - If the item deleted status: 204 "No content",
    *   - If the item not found status: 404 "Not found"
    */
    async DeletePostById (id: string): Promise<ResultNotificationType> {
        try {
            const result: DeletedMongoSuccessType = await PostRepositories.DeletePostById(id)
            return result.deletedCount > 0 ? {status: ResultNotificationEnum.Success} : {status: ResultNotificationEnum.NotFound}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Fetch the user associated with `userId` 
    *    - If the user is not found, return a `NotFound` status.
    * 2. Fetch the post associated with `postId`
    *    - If the post is not found, return a `NotFound` status.
    * 3. Create a comment data object `CreateData` with the provided content and additional information
    *    such as the user's ID and login, the post's ID, and the blog's ID and name.
    * 4. Set the comment's creation date
    * 5. Create the comment in the database
    * 6. Retrieve the newly created comment from the database using its ID obtained from the creation result.
    *    - If the comment cannot be retrieved, return a `NotFound` status.
    * 7. Map the created comment to the appropriate view model 
    * 8. Return a success status along with the mapped comment data.
    */
    async CreateCommentByPostId (data: CommentInputModelType, postId: string, userId: string): Promise<ResultNotificationType<CommentViewModelType>> {
        try {

            const getUser: UserViewMongoModelType | null = await UserRepositories.GetUserByIdWithoutMap(userId)
            if (!getUser) {
                return {status: ResultNotificationEnum.NotFound}
            }

            const getPost: PostViewMongoModelType | null = await PostRepositories.GetPostByIdWithoutMap(postId)
            if (!getPost) {
                return {status: ResultNotificationEnum.NotFound} 
            }

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
                    blogName: getPost.blogName
                },
                createdAt: await CreateDefaultValueDate.DefaultNowDate()
            }

            const resultCreate: CreatedMongoSuccessType = await CommentRepositories.CreateComment(CreateData)

            const getCreatedComment: CommentMongoViewType | null = await CommentRepositories.GetCommentByIdWithoutMap(resultCreate.insertedId.toString())
            if (!getCreatedComment) {
                return {status: ResultNotificationEnum.NotFound}
            }

            return {status: ResultNotificationEnum.Success, data: await CommentsMap.CommentCreateMap(getCreatedComment)}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}