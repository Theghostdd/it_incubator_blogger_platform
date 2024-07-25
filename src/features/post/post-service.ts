import {PostCreateInputModelType, PostInputModelType, PostViewModelType} from "./post-types";
import {ResultNotificationEnum, ResultNotificationType} from "../../Applications/Types-Models/BasicTypes";
import {BlogRepositories} from "../blog/blog-repositories";
import {BlogModel} from "../../Domain/Blog/Blog";
import {defaultPostValues} from "../../internal/utils/default-values/Post/default-post-value";
import {PostModel} from "../../Domain/Post/Post";
import {postMapper} from "../../internal/utils/map/postMap";
import {PostRepositories} from "./post-repositories";


export class PostService {
    constructor(
        protected postRepositories: PostRepositories,
        protected blogRepositories: BlogRepositories,
        protected postModel: typeof PostModel
    ) {}
    async createPostItemByBlogId (data: PostInputModelType): Promise<ResultNotificationType<PostViewModelType>> {
        try {
            const blog: InstanceType<typeof BlogModel> | null = await this.blogRepositories.getBlogById(data.blogId)
            if (!blog) return {status: ResultNotificationEnum.NotFound}

            const createData: PostCreateInputModelType  = {...data, ...defaultPostValues.defaultCreateValues(blog.name)}

            const result = await this.postRepositories.save(new this.postModel(createData))

            return {status: ResultNotificationEnum.Success, data: postMapper.mapPost(result)}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async updatePostById (id: string, data: PostInputModelType): Promise<ResultNotificationType> {
        try {
            const post: InstanceType<typeof PostModel> | null = await this.postRepositories.getPostById(id)
            if (!post) return {status: ResultNotificationEnum.NotFound}

            post.title = data.title
            post.shortDescription = data.shortDescription
            post.content = data.content

            await this.postRepositories.save(post)
            return  {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async deletePostById (id: string): Promise<ResultNotificationType> {
        try {
            const post: InstanceType<typeof PostModel> | null = await this.postRepositories.getPostById(id)
            if (!post) return {status: ResultNotificationEnum.NotFound}

            await this.postRepositories.delete(post)
            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    // async createCommentByPostId (data: CommentInputModelType, postId: string, userId: string): Promise<ResultNotificationType<CommentViewModelType>> {
    //     try {
    //         const getUser: UserViewMongoType | null = await UserRepositories.GetUserById(userId)
    //         if (!getUser) return {status: ResultNotificationEnum.NotFound}
    //
    //         const getPost: PostViewMongoModelType | null = await PostRepositories.GetPostById(postId)
    //         if (!getPost) return {status: ResultNotificationEnum.NotFound}
    //
    //         const CreateData: CommentCreateType = {
    //             content: data.content,
    //             commentatorInfo: {
    //                 userId: getUser._id.toString(),
    //                 userLogin: getUser.login
    //             },
    //             postInfo: {
    //                 postId: getPost._id.toString()
    //             },
    //             blogInfo: {
    //                 blogId: getPost.blogId,
    //             },
    //             ...await defaultCommentValues.defaultCreateValues()
    //         }
    //
    //         const resultCreate: CommentMongoViewType = await CommentRepositories.CreateComment(CreateData)
    //
    //         return {status: ResultNotificationEnum.Success, data: await CommentsMap.MapComment(resultCreate)}
    //     } catch (e: any) {
    //         throw new Error(e)
    //     }
    // }
}