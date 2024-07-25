import {BlogController} from "../features/blog/blog-controller";
import {BlogRepositories} from "../features/blog/blog-repositories";
import {BlogService} from "../features/blog/blog-service";
import {BlogQueryRepositories} from "../features/blog/blog-query-repositories";
import {BlogModel} from "../Domain/Blog/Blog"
import {postQueryRepositories, postService} from "./post-composition-root";


export const blogQueryRepositories =  new BlogQueryRepositories(BlogModel)
export const blogRepositories = new BlogRepositories(BlogModel)
export const blogService = new BlogService(blogRepositories, BlogModel)
export const blogController = new BlogController(blogQueryRepositories, blogService, postService, postQueryRepositories)
