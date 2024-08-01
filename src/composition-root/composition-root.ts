import "reflect-metadata";
import {Container} from "inversify";

import {BlogQueryRepositories} from "../features/blog/api/blog-query-repositories";
import {BlogService} from "../features/blog/application/blog-service";
import {BlogController} from "../features/blog/api/blog-controller";
import {BlogModel} from "../features/blog/domain/entity";
import {BlogRepositories} from "../features/blog/infrastructure/blog-repositories";
import {TestController} from "../features/test/test-controller";
import {TestService} from "../features/test/test-service";
import {TestRepositories} from "../features/test/test-repositories";
import {PostService} from "../features/post/application/post-service";
import {PostController} from "../features/post/api/post-controller";
import {PostRepositories} from "../features/post/infrastructure/post-repositories";
import {PostQueryRepository} from "../features/post/api/post-query-repositories";
import {PostModel} from "../features/post/domain/entity";
import {AuthService} from "../features/auth-registration/application/auth-service";
import {CommentModel} from "../features/comment/domain/entity";
import {LikeModel} from "../features/likes/domain/entity";
import {AuthController} from "../features/auth-registration/api/auth-controller";
import {AuthRepositories} from "../features/auth-registration/infrastructure/auth-repositories";
import {UserModel} from "../features/auth-registration/domain/user-entity";
import {AuthSessionModel} from "../features/auth-registration/domain/session-entity";
import {RequestLimiterModel} from "../features/request-limiter/domain/entity";
import {RecoveryPasswordSessionModel} from "../features/auth-registration/domain/recovery-password-entity";






export const container: Container = new Container();
container.bind<BlogController>(BlogController).toSelf()
container.bind<PostController>(PostController).toSelf()
container.bind<TestController>(TestController).toSelf()
container.bind<AuthController>(AuthController).toSelf()


container.bind<PostService>(PostService).toSelf()
container.bind<TestService>(TestService).toSelf()
container.bind<BlogService>(BlogService).toSelf()
container.bind<AuthService>(AuthService).toSelf()


container.bind<BlogRepositories>(BlogRepositories).toSelf()
container.bind<PostRepositories>(PostRepositories).toSelf()
container.bind<TestRepositories>(TestRepositories).toSelf()
container.bind<BlogQueryRepositories>(BlogQueryRepositories).toSelf()
container.bind<PostQueryRepository>(PostQueryRepository).toSelf()
container.bind<AuthRepositories>(AuthRepositories).toSelf()


container.bind<typeof BlogModel>(BlogModel).toConstantValue(BlogModel)
container.bind<typeof PostModel>(PostModel).toConstantValue(PostModel)
container.bind<typeof UserModel>(UserModel).toConstantValue(UserModel)
container.bind<typeof CommentModel>(CommentModel).toConstantValue(CommentModel)
container.bind<typeof AuthSessionModel>(AuthSessionModel).toConstantValue(AuthSessionModel)
container.bind<typeof RequestLimiterModel>(RequestLimiterModel).toConstantValue(RequestLimiterModel)
container.bind<typeof RecoveryPasswordSessionModel>(RecoveryPasswordSessionModel).toConstantValue(RecoveryPasswordSessionModel)
container.bind<typeof LikeModel>(LikeModel).toConstantValue(LikeModel)


