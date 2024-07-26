import {PostController} from "../features/post/post-controller";
import {blogRepositories} from "./blog-composition-root";
import {PostRepositories} from "../features/post/post-repositories";
import {PostService} from "../features/post/post-service";
import {PostModel} from "../Domain/Post/Post";
import {PostQueryRepository} from "../features/post/post-query-repositories";
import {commentQueryRepositories, commentRepositories} from "./comment-composition-root";
import {userRepositories} from "./user-composition-root";
import {CommentModel} from "../Domain/Comment/Comment";



export const postRepositories = new PostRepositories(PostModel)
export const postQueryRepositories = new PostQueryRepository(PostModel)
export const postService = new PostService(postRepositories, blogRepositories, PostModel, userRepositories, CommentModel, commentRepositories)
export const postController = new PostController(postService, postQueryRepositories, commentQueryRepositories);

