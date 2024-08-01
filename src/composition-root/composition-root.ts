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
import {UserRepositories} from "../features/user/infrastructure/user-repositories";
import {CommentRepositories} from "../features/comment/infrastucture/comment-repositories";
import {CommentQueryRepositories} from "../features/comment/api/comment-query-repositories";
import {
    RecoveryPasswordSessionRepository
} from "../features/auth-registration/infrastructure/recovery-password-session-repositories";
import {BcryptService} from "../internal/application/bcrypt/bcrypt";
import {Uuid} from "../internal/application/uuiid/uuid";
import {JWTService} from "../internal/application/jwt/application/jwt";
import {AuthMailService} from "../features/auth-registration/application/mail-service";
import {NodemailerService} from "../internal/application/nodlemailer/nodemailer/nodemailer";
import {PatternsMailService} from "../internal/application/nodlemailer/patterns/application/patterns-service";
import {UserService} from "../features/user/application/user-service";
import {UserQueryRepositories} from "../features/user/api/user-query-repositories";
import {RegistrationService} from "../features/auth-registration/application/registration-service";
import {RequestLimiterService} from "../features/request-limiter/application/request-limiter-service";
import {RequestLimiterRepository} from "../features/request-limiter/infrastructure/request-limiter-repositories";
import {CommentService} from "../features/comment/application/comment-service";
import {LikesRepositories} from "../features/likes/infrastructure/likes-repositories";
import {SecurityDeviceService} from "../features/security-device/application/security-device-service";
import {SecurityDeviceQueryRepositories} from "../features/security-device/api/security-device-query-repositories";


export const container: Container = new Container();
container.bind<BlogController>(BlogController).toSelf()
container.bind<PostController>(PostController).toSelf()
container.bind<TestController>(TestController).toSelf()
container.bind<AuthController>(AuthController).toSelf()
container.bind<PostService>(PostService).toSelf()
container.bind<TestService>(TestService).toSelf()
container.bind<BlogService>(BlogService).toSelf()
container.bind<AuthService>(AuthService).toSelf()
container.bind<BcryptService>(BcryptService).toSelf()
container.bind<Uuid>(Uuid).toSelf()
container.bind<JWTService>(JWTService).toSelf()
container.bind<AuthMailService>(AuthMailService).toSelf()
container.bind<NodemailerService>(NodemailerService).toSelf()
container.bind<PatternsMailService>(PatternsMailService).toSelf()
container.bind<UserService>(UserService).toSelf()
container.bind<RegistrationService>(RegistrationService).toSelf()
container.bind<RequestLimiterService>(RequestLimiterService).toSelf()
container.bind<CommentService>(CommentService).toSelf()
container.bind<SecurityDeviceService>(SecurityDeviceService).toSelf()
container.bind<UserQueryRepositories>(UserQueryRepositories).toSelf()
container.bind<UserRepositories>(UserRepositories).toSelf()
container.bind<BlogRepositories>(BlogRepositories).toSelf()
container.bind<PostRepositories>(PostRepositories).toSelf()
container.bind<TestRepositories>(TestRepositories).toSelf()
container.bind<BlogQueryRepositories>(BlogQueryRepositories).toSelf()
container.bind<PostQueryRepository>(PostQueryRepository).toSelf()
container.bind<AuthRepositories>(AuthRepositories).toSelf()
container.bind<CommentRepositories>(CommentRepositories).toSelf()
container.bind<RequestLimiterRepository>(RequestLimiterRepository).toSelf()
container.bind<CommentQueryRepositories>(CommentQueryRepositories).toSelf()
container.bind<RecoveryPasswordSessionRepository>(RecoveryPasswordSessionRepository).toSelf()
container.bind<LikesRepositories>(LikesRepositories).toSelf()
container.bind<SecurityDeviceQueryRepositories>(SecurityDeviceQueryRepositories).toSelf()
container.bind<typeof BlogModel>(BlogModel).toConstantValue(BlogModel)
container.bind<typeof PostModel>(PostModel).toConstantValue(PostModel)
container.bind<typeof UserModel>(UserModel).toConstantValue(UserModel)
container.bind<typeof CommentModel>(CommentModel).toConstantValue(CommentModel)
container.bind<typeof AuthSessionModel>(AuthSessionModel).toConstantValue(AuthSessionModel)
container.bind<typeof RequestLimiterModel>(RequestLimiterModel).toConstantValue(RequestLimiterModel)
container.bind<typeof RecoveryPasswordSessionModel>(RecoveryPasswordSessionModel).toConstantValue(RecoveryPasswordSessionModel)
container.bind<typeof LikeModel>(LikeModel).toConstantValue(LikeModel)


