import {BlogController} from "../features/blog/blog-controller";
import {BlogRepositories} from "../features/blog/blog-repositories";
import {BlogService} from "../features/blog/blog-service";
import {BlogQueryRepositories} from "../features/blog/blog-query-repositories";
import {BlogModel} from "../Domain/Blog/Blog"
import {postQueryRepositories, postRepositories, postService} from "./post-composition-root";
import {PostService} from "../features/post/post-service";
import {PostModel} from "../Domain/Post/Post";
import {UserRepositories} from "../features/user/user-repositories";
import {UserModel} from "../Domain/User/User";
import {CommentModel} from "../Domain/Comment/Comment";
import {CommentRepositories} from "../features/comment/comment-repositories";


export const blogQueryRepositories =  new BlogQueryRepositories(BlogModel)
export const blogRepositories = new BlogRepositories(BlogModel)
export const blogService = new BlogService(blogRepositories, BlogModel)
export const blogController = new BlogController(blogQueryRepositories, blogService, new PostService(postRepositories, new BlogRepositories(BlogModel), PostModel, new UserRepositories(UserModel), CommentModel, new CommentRepositories(CommentModel)), postQueryRepositories)
