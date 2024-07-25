import {TestController} from "../features/test/test-controller";
import {TestService} from "../features/test/test-service";
import {TestRepositories} from "../features/test/test-repositories";
import {BlogModel} from "../Domain/Blog/Blog";
import {PostModel} from "../Domain/Post/Post";
import {UserModel} from "../Domain/User/User";
import {CommentModel} from "../Domain/Comment/Comment";
import {AuthSessionModel, RequestLimiterModel} from "../Domain/Auth/Auth";
import {RecoveryPasswordSessionModel} from "../Domain/RecoveryPasswordSession/RecoveryPasswordSession";
import {iTestController, iTestRepositories, iTestService} from "../features/test/test-interface";

export const testRepositories: iTestRepositories = new TestRepositories(BlogModel, PostModel, UserModel, CommentModel, AuthSessionModel, RequestLimiterModel, RecoveryPasswordSessionModel)
export const testService: iTestService = new TestService(testRepositories)
export const testController: iTestController = new TestController(testService)
