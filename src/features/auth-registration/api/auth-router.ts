import {Router} from "express";
import {ROUTERS_SETTINGS} from "../../../settings";

import {inputValidation, ruleBodyValidations} from "../../../internal/middleware/input-validation/input-validation";
import {container} from "../../../composition-root/composition-root";
import {RequestLimiter} from "../../../internal/middleware/request-limit/request-limit";

export const authRouter = Router()
const requestLimiter = container.resolve(RequestLimiter)
authRouter.post(`${ROUTERS_SETTINGS.AUTH.login}`,
    requestLimiter.requestLimiter.bind(requestLimiter),
    ruleBodyValidations.validationBodyLoginOrEmail,
    ruleBodyValidations.validationBodyPassword,
    inputValidation,
    authRegistrationController.login.bind(authRegistrationController)
    )

authRouter.get(`${ROUTERS_SETTINGS.AUTH.me}`, authUserMiddleware.authUserByAccessToken.bind(authUserMiddleware), authRegistrationController.getInfoAboutCurrentUserByAccessToken.bind(authRegistrationController))

authRouter.post(`${ROUTERS_SETTINGS.AUTH.registration}`,
    requestLimiter.requestLimiter.bind(requestLimiter),
    ruleBodyValidations.validationBodyLogin,
    ruleBodyValidations.validationBodyEmail,
    ruleBodyValidations.validationBodyPassword,
    inputValidation,
    authRegistrationController.registrationUser.bind(authRegistrationController)
)

authRouter.post(`${ROUTERS_SETTINGS.AUTH.registration_confirmation}`,
    requestLimiter.requestLimiter.bind(requestLimiter),
    ruleBodyValidations.validationBodyConfirmCode,
    inputValidation,
    authRegistrationController.registrationUserConfirm.bind(authRegistrationController)
)

authRouter.post(`${ROUTERS_SETTINGS.AUTH.registration_email_resending}`,
    requestLimiter.requestLimiter.bind(requestLimiter),
    ruleBodyValidations.validationBodyEmail,
    inputValidation,
    authRegistrationController.registrationUserResendConfirmationCode.bind(authRegistrationController)
)


authRouter.post(`${ROUTERS_SETTINGS.AUTH.refresh_token}`, authRegistrationController.refreshToken.bind(authRegistrationController))

authRouter.post(`${ROUTERS_SETTINGS.AUTH.logout}`, authRegistrationController.logout.bind(authRegistrationController))

authRouter.post(`${ROUTERS_SETTINGS.AUTH.password_recovery}`,
    requestLimiter.requestLimiter.bind(requestLimiter),
    ruleBodyValidations.validationBodyEmail,
    inputValidation,
    authRegistrationController.passwordRecovery.bind(authRegistrationController)
)

authRouter.post(`${ROUTERS_SETTINGS.AUTH.new_password}`,
    requestLimiter.requestLimiter.bind(requestLimiter),
    ruleBodyValidations.validationBodyNewPassword,
    ruleBodyValidations.validationBodyRecoveryCode,
    inputValidation,
    authRegistrationController.changePassword.bind(authRegistrationController)
)
