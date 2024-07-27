import {PostController} from "../features/post/post-controller";
import {PostRepositories} from "../features/post/post-repositories";
import {PostService} from "../features/post/post-service";
import {PostModel} from "../Domain/Post/Post";
import {PostQueryRepository} from "../features/post/post-query-repositories";

import {CommentModel, LikeModel} from "../Domain/Comment/Comment";
import {BlogRepositories} from "../features/blog/blog-repositories";
import {BlogModel} from "../Domain/Blog/Blog";
import {UserRepositories} from "../features/user/user-repositories";
import {UserModel} from "../Domain/User/User";
import {CommentRepositories} from "../features/comment/comment-repositories";
import {CommentQueryRepositories} from "../features/comment/comment-query-repositories";



export const postRepositories = new PostRepositories(PostModel)
export const postQueryRepositories = new PostQueryRepository(PostModel)
export const postService = new PostService(postRepositories, new BlogRepositories(BlogModel), PostModel, new UserRepositories(UserModel), CommentModel, new CommentRepositories(CommentModel, LikeModel))
export const postController = new PostController(postService, postQueryRepositories, new CommentQueryRepositories(CommentModel, LikeModel));

