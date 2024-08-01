import {ResultNotificationEnum, ResultNotificationType} from "../../../typings/basic-types";
import {BlogRepositories} from "../../blog/infrastructure/blog-repositories";
import {PostRepositories} from "../infrastructure/post-repositories";
import {UserRepositories} from "../../user/user-repositories";
import {UserModel} from "../../../Domain/User/User";
import {CommentRepositories} from "../../comment/infrastucture/comment-repositories";
import {inject, injectable} from "inversify";
import {PostInputModel, PostUpdateModel} from "../api/input-models/dto";
import {PostModel} from "../domain/entity";
import {HydratedDocument} from "mongoose";
import {BlogDto} from "../../blog/domain/dto";
import {IBlogInstanceMethod} from "../../blog/domain/interfaces";
import {PostDto} from "../domain/dto";
import {CommentCreateInputModelDto} from "../../comment/api/input-models/dto";
import {IPostInstanceMethod} from "../domain/interfaces";
import {CommentModel} from "../../comment/domain/entity";

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


    async createCommentByPostId(commentDto: CommentCreateInputModelDto, postId: string, userId: string): Promise<ResultNotificationType<string | null>> {
        // TODO:
        // const user: InstanceType<typeof UserModel> | null = await this.userRepositories.getUserById(userId)
        if (!user) return {status: ResultNotificationEnum.NotFound, data: null}
        //
        const post: HydratedDocument<PostDto, IPostInstanceMethod> | null = await this.postRepositories.getPostById(postId)
        if (!post) return {status: ResultNotificationEnum.NotFound, data: null}

        const comment = this.commentModel.createInstance(commentDto, user._id.toString(), user.login, post._id.toString(), post.blogId)
        await this.commentRepositories.save(comment)

        return {status: ResultNotificationEnum.Success, data: comment._id.toString()}
    }
}