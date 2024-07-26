import {AuthController} from "../features/auth-registration/auth-controller";
import {userQueryRepositories, userRepositories} from "./user-composition-root";
import {RegistrationService} from "../features/auth-registration/registartion/registration-service";
import {UserModel} from "../Domain/User/User";
import {AuthService} from "../features/auth-registration/auth/auth-service";
import {RecoveryPasswordSessionModel} from "../Domain/RecoveryPasswordSession/RecoveryPasswordSession";
import {
    RecoveryPasswordSessionRepository
} from "../features/auth-registration/auth/recovery-password-session-repositories";
import {AuthRepositories} from "../features/auth-registration/auth/auth-repositories";
import {AuthSessionModel} from "../Domain/Auth/Auth";
import {AuthUserMiddleware} from "../internal/middleware/auth/UserAuth/auth-user";
export const authRepositories = new AuthRepositories(AuthSessionModel)
export const recoveryPasswordSessionRepository = new RecoveryPasswordSessionRepository(RecoveryPasswordSessionModel)
export const registrationService = new RegistrationService(userRepositories, UserModel)
export const authService = new AuthService(userRepositories, recoveryPasswordSessionRepository, authRepositories, AuthSessionModel, UserModel, RecoveryPasswordSessionModel);
export const authRegistrationController = new AuthController(authService, registrationService, userQueryRepositories)
export const authUserMiddleware = new AuthUserMiddleware(authService)
