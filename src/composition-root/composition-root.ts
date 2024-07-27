import {UserRepositories} from "../features/user/user-repositories";
import {UserModel} from "../Domain/User/User";
import {BlogModel} from "../Domain/Blog/Blog";
import {PostModel} from "../Domain/Post/Post";
import {TestRepositories} from "../features/test/test-repositories";
import {CommentModel, LikeModel} from "../Domain/Comment/Comment";
import {AuthSessionModel, RequestLimiterModel} from "../Domain/Auth/Auth";
import {RecoveryPasswordSessionModel} from "../Domain/RecoveryPasswordSession/RecoveryPasswordSession";
import {RequestLimiterRepository} from "../features/request-limiter/request-limiter-repositories";
import {PostRepositories} from "../features/post/post-repositories";
import {CommentRepositories} from "../features/comment/comment-repositories";
import {BlogRepositories} from "../features/blog/blog-repositories";
import {AuthRepositories} from "../features/auth-registration/auth/auth-repositories";
import {
    RecoveryPasswordSessionRepository
} from "../features/auth-registration/auth/recovery-password-session-repositories";
import {BlogQueryRepositories} from "../features/blog/blog-query-repositories";
import {UserQueryRepositories} from "../features/user/user-query-repositories";
import {SecurityDeviceQueryRepositories} from "../features/security-device/security-device-query-repositories";
import {PostQueryRepository} from "../features/post/post-query-repositories";
import {CommentQueryRepositories} from "../features/comment/comment-query-repositories";
import {RegistrationService} from "../features/auth-registration/registartion/registration-service";
import {AuthService} from "../features/auth-registration/auth/auth-service";
import {BlogService} from "../features/blog/blog-service";
import {CommentService} from "../features/comment/comment-service";
import {PostService} from "../features/post/post-service";
import {RequestLimiterService} from "../features/request-limiter/request-limiter-service";
import {SecurityDeviceService} from "../features/security-device/security-device-service";
import {iTestController, iTestService} from "../features/test/test-interface";
import {TestService} from "../features/test/test-service";
import {UserService} from "../features/user/user-service";
import {UserController} from "../features/user/user-controller";
import {BlogController} from "../features/blog/blog-controller";
import {TestController} from "../features/test/test-controller";
import {SecurityDeviceController} from "../features/security-device/security-device-controller";
import {PostController} from "../features/post/post-controller";
import {CommentController} from "../features/comment/comment-controller";
import {AuthController} from "../features/auth-registration/auth-controller";
import {RequestLimiter} from "../internal/middleware/request-limit/request-limit";
import {AuthUserMiddleware} from "../internal/middleware/auth/UserAuth/auth-user";

export const userRepositories = new UserRepositories(UserModel)
export const testRepositories = new TestRepositories(BlogModel, PostModel, UserModel, CommentModel, AuthSessionModel, RequestLimiterModel, RecoveryPasswordSessionModel)
export const requestLimiterRepository = new RequestLimiterRepository(RequestLimiterModel)
export const postRepositories = new PostRepositories(PostModel)
export const commentRepositories = new CommentRepositories(CommentModel, LikeModel)
export const blogRepositories = new BlogRepositories(BlogModel)
export const authRepositories = new AuthRepositories(AuthSessionModel)
export const recoveryPasswordSessionRepository = new RecoveryPasswordSessionRepository(RecoveryPasswordSessionModel)

export const blogQueryRepositories =  new BlogQueryRepositories(BlogModel)
export const userQueryRepositories = new UserQueryRepositories(UserModel)
export const securityDeviceQueryRepositories = new SecurityDeviceQueryRepositories(AuthSessionModel)
export const postQueryRepositories = new PostQueryRepository(PostModel)
export const commentQueryRepositories = new CommentQueryRepositories(CommentModel, LikeModel)


export const registrationService = new RegistrationService(userRepositories, UserModel)
export const authService = new AuthService(userRepositories, recoveryPasswordSessionRepository, authRepositories, AuthSessionModel, UserModel, RecoveryPasswordSessionModel);
export const blogService = new BlogService(blogRepositories, BlogModel)
export const commentService = new CommentService(commentRepositories, LikeModel);
export const postService = new PostService(postRepositories, blogRepositories, PostModel, userRepositories, CommentModel, commentRepositories)
export const requestLimiterService = new RequestLimiterService(requestLimiterRepository, RequestLimiterModel)
export const securityDeviceService = new SecurityDeviceService(authRepositories, authService)
export const testService: iTestService = new TestService(testRepositories)
export const userService = new UserService(userRepositories, UserModel)
export const userController = new UserController(userService, userQueryRepositories);
export const blogController = new BlogController(blogQueryRepositories, blogService, postService, postQueryRepositories)
export const testController: iTestController = new TestController(testService)
export const securityDeviceController = new SecurityDeviceController(securityDeviceService, authService, securityDeviceQueryRepositories)
export const postController = new PostController(postService, postQueryRepositories, commentQueryRepositories);
export const commentController = new CommentController(commentService, commentQueryRepositories);
export const authRegistrationController = new AuthController(authService, registrationService, userQueryRepositories)
export const requestLimiter = new RequestLimiter(requestLimiterService)
export const authUserMiddleware = new AuthUserMiddleware(authService)
