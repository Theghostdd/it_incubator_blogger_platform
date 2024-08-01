import {LikeStatusEnum, ResultNotificationEnum, ResultNotificationType} from "../../../typings/basic-types";
import {BlogRepositories} from "../../blog/infrastructure/blog-repositories";
import {PostRepositories} from "../infrastructure/post-repositories";
import {CommentCreateType, CommentInputModelType, CommentViewModelType} from "../../comment/comment-types";
import {UserRepositories} from "../../user/user-repositories";
import {UserModel} from "../../../Domain/User/User";
import {CommentModel} from "../../../Domain/Comment/Comment";
import {CommentRepositories} from "../../comment/comment-repositories";
import {commentMap} from "../../../internal/utils/map/commentMap";
import {inject, injectable} from "inversify";
import {PostInputModel, PostUpdateModel} from "../api/input-models/dto";
import {IPostInstanceMethod, PostModel} from "../domain/entity";
import {HydratedDocument} from "mongoose";
import {BlogDto} from "../../blog/domain/dto";
import {IBlogInstanceMethod} from "../../blog/domain/interfaces";
import {PostDto} from "../domain/dto";

@injectable()
export class PostService {
    constructor(
        @inject(PostRepositories) private postRepositories: PostRepositories,
        @inject(BlogRepositories) private blogRepositories: BlogRepositories,
        @inject(PostModel) private postModel: typeof PostModel,
        @inject(UserRepositories) private userRepositories: UserRepositories,
        @inject(CommentModel) private commentModel: typeof CommentModel,
        @inject(CommentRepositories) private commentRepositories: CommentRepositories
    ) {}

    async createPostItemByBlogId(postDto: PostInputModel): Promise<ResultNotificationType<string | null>> {

        const blog: HydratedDocument<BlogDto, IBlogInstanceMethod> | null = await this.blogRepositories.getBlogById(postDto.blogId)
        if (!blog) return {status: ResultNotificationEnum.NotFound, data: null}


        const post: HydratedDocument<PostDto, IPostInstanceMethod> = this.postModel.createInstance(postDto, blog.name)
        await this.postRepositories.save(post)
        return {status: ResultNotificationEnum.Success, data: post._id.toString()}

    }

    async updatePostById(id: string, postUpdateDto: PostUpdateModel): Promise<ResultNotificationType> {

        const post: HydratedDocument<PostDto, IPostInstanceMethod> | null = await this.postRepositories.getPostById(id)
        if (!post) return {status: ResultNotificationEnum.NotFound, data: null}

        post.updateInstance(postUpdateDto)

        await this.postRepositories.save(post)
        return {status: ResultNotificationEnum.Success, data: null}

    }

    async deletePostById(id: string): Promise<ResultNotificationType> {

        const post: HydratedDocument<PostDto, IPostInstanceMethod> | null = await this.postRepositories.getPostById(id)
        if (!post) return {status: ResultNotificationEnum.NotFound, data: null}

        await this.postRepositories.delete(post)
        return {status: ResultNotificationEnum.Success, data: null}
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
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0
                },
                createdAt: new Date().toISOString(),
            }

            const resultCreate: InstanceType<typeof CommentModel> = await this.commentRepositories.save(new this.commentModel(CreateData))

            return {status: ResultNotificationEnum.Success, data: commentMap.mapComment(resultCreate, LikeStatusEnum.None)}
        } catch (e: any) {
            throw new Error(e)
        }
    }
}