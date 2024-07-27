import {SecurityDeviceController} from "../features/security-device/security-device-controller";
import {SecurityDeviceService} from "../features/security-device/security-device-service";
import {SecurityDeviceQueryRepositories} from "../features/security-device/security-device-query-repositories";
import {AuthSessionModel} from "../Domain/Auth/Auth";
import {authRepositories, recoveryPasswordSessionRepository} from "./auth-registration-composition-root";
import {AuthRepositories} from "../features/auth-registration/auth/auth-repositories";
import {AuthService} from "../features/auth-registration/auth/auth-service";
import {UserRepositories} from "../features/user/user-repositories";
import {UserModel} from "../Domain/User/User";
import {RecoveryPasswordSessionModel} from "../Domain/RecoveryPasswordSession/RecoveryPasswordSession";



export const securityDeviceQueryRepositories = new SecurityDeviceQueryRepositories(AuthSessionModel)
export const securityDeviceService = new SecurityDeviceService(new AuthRepositories(AuthSessionModel), new AuthService(new UserRepositories(UserModel), recoveryPasswordSessionRepository, authRepositories, AuthSessionModel, UserModel, RecoveryPasswordSessionModel))
export const securityDeviceController = new SecurityDeviceController(securityDeviceService, new AuthService(new UserRepositories(UserModel), recoveryPasswordSessionRepository, authRepositories, AuthSessionModel, UserModel, RecoveryPasswordSessionModel), securityDeviceQueryRepositories)