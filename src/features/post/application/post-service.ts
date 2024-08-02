import {LikeStatusEnum, ResultNotificationEnum, ResultNotificationType} from "../../../typings/basic-types";
import {BlogRepositories} from "../../blog/infrastructure/blog-repositories";
import {PostRepositories} from "../infrastructure/post-repositories";
import {UserRepositories} from "../../user/infrastructure/user-repositories";
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
import {UserDto} from "../../auth-registration/domain/dto";
import {IUserInstanceMethods} from "../../auth-registration/domain/interfaces";
import {LikeInputModelDto} from "../../likes/api/input-models/dto";
import {LikeChangeCount, LikeDto} from "../../likes/domain/dto";
import {ILikesInstanceMethods} from "../../likes/domain/interfaces";
import {LikesRepositories} from "../../likes/infrastructure/likes-repositories";
import { LikeModel } from "../../likes/domain/entity";

@injectable()
export class PostService {
    constructor(
        @inject(PostRepositories) private postRepositories: PostRepositories,
        @inject(BlogRepositories) private blogRepositories: BlogRepositories,
        @inject(PostModel) private postModel: typeof PostModel,
        @inject(UserRepositories) private userRepositories: UserRepositories,
        @inject(CommentModel) private commentModel: typeof CommentModel,
        @inject(CommentRepositories) private commentRepositories: CommentRepositories,
        @inject(LikesRepositories) private likesRepositories: LikesRepositories,
        @inject(LikeModel) private likeModel: typeof LikeModel
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
        const user: HydratedDocument<UserDto, IUserInstanceMethods> | null = await this.userRepositories.getUserById(userId)
        if (!user) return {status: ResultNotificationEnum.NotFound, data: null}
        //
        const post: HydratedDocument<PostDto, IPostInstanceMethod> | null = await this.postRepositories.getPostById(postId)
        if (!post) return {status: ResultNotificationEnum.NotFound, data: null}

        const comment = this.commentModel.createInstance(commentDto, user._id.toString(), user.login, post._id.toString(), post.blogId)
        await this.commentRepositories.save(comment)

        return {status: ResultNotificationEnum.Success, data: comment._id.toString()}
    }

    async updatePostLikeStatusById(likeInputDto: LikeInputModelDto, postId: string, userId: string): Promise<ResultNotificationType> {
        const post: HydratedDocument<PostDto, IPostInstanceMethod> | null = await this.postRepositories.getPostById(postId)
        if (!post) return {status: ResultNotificationEnum.NotFound, data: null}

        const like: HydratedDocument<LikeDto, ILikesInstanceMethods> | null = await this.likesRepositories.getLikeByParentIdAndUserId(userId, postId)
        if (!like) {
            const like: HydratedDocument<LikeDto, ILikesInstanceMethods> = this.likeModel.createInstance(likeInputDto, postId, userId)

            post.updateLikesCount(0, 0, likeInputDto.likeStatus as LikeStatusEnum)

            await Promise.all([
                this.likesRepositories.save(like),
                this.postRepositories.save(post)
            ])

            return {status: ResultNotificationEnum.Success, data: null}
        }

        const changeCountLike: LikeChangeCount = like.changeCountLike(likeInputDto.likeStatus as LikeStatusEnum, like.status)
        like.updateLikeStatus(changeCountLike.newStatus)
        post.updateLikesCount(changeCountLike.newLikesCount, changeCountLike.newDislikesCount)

        await Promise.all([
            this.likesRepositories.save(like),
            this.postRepositories.save(post)
        ])

        return {status: ResultNotificationEnum.Success, data: null}
    }

}