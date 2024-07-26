import {UserController} from "../features/user/user-controller";
import {UserQueryRepositories} from "../features/user/user-query-repositories";
import {UserRepositories} from "../features/user/user-repositories";
import {UserService} from "../features/user/user-service";
import {UserModel} from "../Domain/User/User";




export const userQueryRepositories = new UserQueryRepositories(UserModel)
export const userRepositories = new UserRepositories(UserModel)
export const userService = new UserService(userRepositories, UserModel)
export const userController = new UserController(userService, userQueryRepositories);
