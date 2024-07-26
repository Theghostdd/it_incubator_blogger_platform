import {PostCreateInputModelType, PostInputModelType, PostViewModelType} from "./post-types";
import {ResultNotificationEnum, ResultNotificationType} from "../../typings/basic-types";
import {BlogRepositories} from "../blog/blog-repositories";
import {BlogModel} from "../../Domain/Blog/Blog";
import {defaultPostValues} from "../../internal/utils/default-values/post/default-post-value";
import {PostModel} from "../../Domain/Post/Post";
import {postMapper} from "../../internal/utils/map/postMap";
import {PostRepositories} from "./post-repositories";
import {CommentCreateType, CommentInputModelType, CommentViewModelType} from "../comment/comment-types";
import {UserRepositories} from "../user/user-repositories";
import {UserModel} from "../../Domain/User/User";
import {CommentModel} from "../../Domain/Comment/Comment";
import {CommentRepositories} from "../comment/comment-repositories";
import {commentMap} from "../../internal/utils/map/commentMap";


export class PostService {
    constructor(
        protected postRepositories: PostRepositories,
        protected blogRepositories: BlogRepositories,
        protected postModel: typeof PostModel,
        protected userRepositories: UserRepositories,
        protected commentModel: typeof CommentModel,
        protected commentRepositories: CommentRepositories
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

    async createCommentByPostId (data: CommentInputModelType, postId: string, userId: string): Promise<ResultNotificationType<CommentViewModelType>> {
        try {
            const user: InstanceType<typeof UserModel> | null = await this.userRepositories.getUserById(userId)
            if (!user) return {status: ResultNotificationEnum.NotFound}

            const post: InstanceType<typeof PostModel> | null = await this.postRepositories.getPostById(postId)
            if (!post) return {status: ResultNotificationEnum.NotFound}

            const CreateData: CommentCreateType = {
                content: data.content,
                commentatorInfo: {
                    userId: user._id.toString(),
                    userLogin: user.login
                },
                postInfo: {
                    postId: post._id.toString()
                },
                blogInfo: {
                    blogId: post.blogId,
                },
                createdAt: new Date().toISOString(),
            }

            const resultCreate: InstanceType<typeof CommentModel> = await this.commentRepositories.save(new this.commentModel(CreateData))

            return {status: ResultNotificationEnum.Success, data: await commentMap.mapComment(resultCreate)}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}