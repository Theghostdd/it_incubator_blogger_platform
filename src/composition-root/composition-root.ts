import "reflect-metadata";
import {Container} from "inversify";

import {BlogQueryRepositories} from "../features/blog/api/blog-query-repositories";
import {BlogService} from "../features/blog/application/blog-service";
import {BlogController} from "../features/blog/api/blog-controller";
import {BlogModel} from "../features/blog/domain/entity";
import {BlogRepositories} from "../features/blog/infrastructure/blog-repositories";
import {UserModel} from "../Domain/User/User";
import {CommentModel, LikeModel} from "../Domain/Comment/Comment";
import {AuthSessionModel, RequestLimiterModel} from "../Domain/Auth/Auth";
import {RecoveryPasswordSessionModel} from "../Domain/RecoveryPasswordSession/RecoveryPasswordSession";
import {TestController} from "../features/test/test-controller";
import {TestService} from "../features/test/test-service";
import {TestRepositories} from "../features/test/test-repositories";
import {PostService} from "../features/post/application/post-service";
import {PostController} from "../features/post/api/post-controller";
import {PostRepositories} from "../features/post/infrastructure/post-repositories";
import {PostQueryRepository} from "../features/post/api/post-query-repositories";
import {PostModel} from "../features/post/domain/entity";






export const container: Container = new Container();
container.bind<BlogController>(BlogController).toSelf()
container.bind<PostController>(PostController).toSelf()
container.bind<TestController>(TestController).toSelf()




container.bind<PostService>(PostService).toSelf()
container.bind<TestService>(TestService).toSelf()
container.bind<BlogService>(BlogService).toSelf()



container.bind<BlogRepositories>(BlogRepositories).toSelf()
container.bind<PostRepositories>(PostRepositories).toSelf()
container.bind<TestRepositories>(TestRepositories).toSelf()
container.bind<BlogQueryRepositories>(BlogQueryRepositories).toSelf()
container.bind<PostQueryRepository>(PostQueryRepository).toSelf()



container.bind<typeof BlogModel>(BlogModel).toConstantValue(BlogModel)
container.bind<typeof PostModel>(PostModel).toConstantValue(PostModel)
container.bind<typeof UserModel>(UserModel).toConstantValue(UserModel)
container.bind<typeof CommentModel>(CommentModel).toConstantValue(CommentModel)
container.bind<typeof AuthSessionModel>(AuthSessionModel).toConstantValue(AuthSessionModel)
container.bind<typeof RequestLimiterModel>(RequestLimiterModel).toConstantValue(RequestLimiterModel)
container.bind<typeof RecoveryPasswordSessionModel>(RecoveryPasswordSessionModel).toConstantValue(RecoveryPasswordSessionModel)
container.bind<typeof LikeModel>(LikeModel).toConstantValue(LikeModel)


