import {Router} from "express";
import {ROUTERS_SETTINGS} from "../../../settings";

import {inputValidation, ruleBodyValidations} from "../../../internal/middleware/input-validation/input-validation";
import {container} from "../../../composition-root/composition-root";
import {RequestLimiter} from "../../../internal/middleware/request-limit/request-limit";
import {AuthController} from "./auth-controller";
import {AuthUserMiddleware} from "../../../internal/middleware/auth/UserAuth/auth-user";

export const authRouter = Router()
const authController = container.resolve(AuthController)
const requestLimiter = container.resolve(RequestLimiter)
const authUserMiddleware = container.resolve(AuthUserMiddleware);

authRouter.post(`${ROUTERS_SETTINGS.AUTH.login}`,
    requestLimiter.requestLimiter.bind(requestLimiter),
    ruleBodyValidations.validationBodyLoginOrEmail,
    ruleBodyValidations.validationBodyPassword,
    inputValidation,
    authController.login.bind(authController)
    )

authRouter.get(`${ROUTERS_SETTINGS.AUTH.me}`, authUserMiddleware.authUserByAccessToken.bind(authUserMiddleware), authController.getInfoAboutCurrentUserByAccessToken.bind(authController))

authRouter.post(`${ROUTERS_SETTINGS.AUTH.registration}`,
    requestLimiter.requestLimiter.bind(requestLimiter),
    ruleBodyValidations.validationBodyLogin,
    ruleBodyValidations.validationBodyEmail,
    ruleBodyValidations.validationBodyPassword,
    inputValidation,
    authController.registrationUser.bind(authController)
)

authRouter.post(`${ROUTERS_SETTINGS.AUTH.registration_confirmation}`,
    requestLimiter.requestLimiter.bind(requestLimiter),
    ruleBodyValidations.validationBodyConfirmCode,
    inputValidation,
    authController.registrationUserConfirm.bind(authController)
)

authRouter.post(`${ROUTERS_SETTINGS.AUTH.registration_email_resending}`,
    requestLimiter.requestLimiter.bind(requestLimiter),
    ruleBodyValidations.validationBodyEmail,
    inputValidation,
    authController.registrationUserResendConfirmationCode.bind(authController)
)


authRouter.post(`${ROUTERS_SETTINGS.AUTH.refresh_token}`, authController.refreshToken.bind(authController))

authRouter.post(`${ROUTERS_SETTINGS.AUTH.logout}`, authController.logout.bind(authController))

authRouter.post(`${ROUTERS_SETTINGS.AUTH.password_recovery}`,
    requestLimiter.requestLimiter.bind(requestLimiter),
    ruleBodyValidations.validationBodyEmail,
    inputValidation,
    authController.passwordRecovery.bind(authController)
)

authRouter.post(`${ROUTERS_SETTINGS.AUTH.new_password}`,
    requestLimiter.requestLimiter.bind(requestLimiter),
    ruleBodyValidations.validationBodyNewPassword,
    ruleBodyValidations.validationBodyRecoveryCode,
    inputValidation,
    authController.changePassword.bind(authController)
)
