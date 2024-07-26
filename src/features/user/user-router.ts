import {Router} from "express";
import {authValidation} from "../../internal/middleware/auth/AdminAuth/AdminAuth";
import {userController} from "../../composition-root/user-composition-root";
import {inputValidation, ruleBodyValidations} from "../../internal/middleware/input-validation/input-validation";


export const userRouter = Router()

userRouter.get('/', authValidation, userController.getUsers.bind(userController))

userRouter.post('/',
    authValidation,
    ruleBodyValidations.validationBodyLogin,
    ruleBodyValidations.validationBodyPassword,
    ruleBodyValidations.validationBodyEmail,
    inputValidation,
    userController.createUser.bind(userController)
)

userRouter.delete('/:id', authValidation, userController.deleteUserById.bind(userController))