import { credentialJWT } from "../../Applications/Middleware/auth/UserAuth/jwt"
import { comparePass, genSaltAndHash } from "../../Applications/Middleware/bcrypt/bcrypt"
import { AuthOutputModelType, ConfirmCodeInputModelType, LoginInputModelType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { UserInputModelType, UserViewMongoModelType } from "../../Applications/Types-Models/User/UserTypes"
import { ResultNotificationType, ResultNotificationEnum, APIErrorsMessageType, CreatedMongoSuccessType, UpdateMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { UserRepositories } from "../../Repositories/UserRepostitories/UserRepositories"
import { RegistrationCreateType, ResendConfirmCodeInputType } from "../../Applications/Types-Models/Registration/RegistrationTypes"
import { RegistrationDefaultValue } from "../../Utils/default-values/Registration/registration-default-value"
import { sendEmail } from "../../Applications/Nodemailer/nodemailer"
import { GenerateUuid } from "../../Utils/generate-uuid/generate-uuid"
import { addDays, compareAsc} from "date-fns";
import { PatternsMail } from "../../Applications/Nodemailer/patterns/patterns"
import { PatternMail } from "../../Applications/Types-Models/PatternsMail/patternsMailTypes"



export const AuthService = {
    /* 
    * 1. Check user.
    * 2. Queries the MongoDB collection.
    * 3. Checks if a user document is found:
    *    a. If no user is found, returns a failure status (Unauthorized).
    *    b. If a user is found, verifies the provided password against the stored password using bcrypt.
    *       - If the password doesn't match, returns a failure status (Unauthorized).
    */
    async AuthUser (data: LoginInputModelType): Promise<ResultNotificationType<AuthOutputModelType>> {
        try {
            const filter = {
                $or: [
                    {email: data.loginOrEmail},
                    {login: data.loginOrEmail}
                ]
            }
            const getUser: UserViewMongoModelType | null = await UserRepositories.GetUserByLoginOrEmailWithOutMap(filter)
            if (!getUser) {
                return {status: ResultNotificationEnum.Unauthorized}
            }

            if (!getUser.userConfirm.ifConfirm) {
                return {status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages: [
                        {
                            message: 'Email has been confirmed',
                            field: 'code'
                        }
                    ]}
                }
            }

            if (!await comparePass(data.password, getUser.password)) {
                return {status: ResultNotificationEnum.Unauthorized}
            }


            return {
                status: ResultNotificationEnum.Success,
                data: {
                    accessToken: await credentialJWT.SignJWT({userId: getUser._id})
                }
            }
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. . Checks if a user document is found:
    *    a. If no user is found, next step.
    *    b. If a user is found, return error not uniq values and return this values.
    * 2. Generate confirm`s code for confirm email user with uuid.
    * 3. Next step is create data object for create new user in db
    *   a. Creating hash password.
    *   b. Creating current date + 1 day to this day for tracking expire data confirm email.
    * 4. Create user, use repositories.
    * 5. Getting email pattern for confirm email.
    * 6. Send email to user.
    * 7. If process has some error throw error in the "catch"
    */
    async RegistrationUser (data: UserInputModelType): Promise<ResultNotificationType> {
        try {
            const filter = {
                $or: [
                    {email: data.email},
                    {login: data.login}
                ]
            }

            const checkLoginAndEmail: UserViewMongoModelType | null = await UserRepositories.GetUserByLoginOrEmailWithOutMap(filter)
            if (checkLoginAndEmail) {
                const errors: APIErrorsMessageType = {errorsMessages: []};  
                data.login === checkLoginAndEmail.login ? errors.errorsMessages.push({message: 'Not unique login', field: 'login'}) : false
                data.email === checkLoginAndEmail.email ? errors.errorsMessages.push({message: 'Not unique email', field: 'email'}) : false
                return {status: ResultNotificationEnum.BadRequest, errorField: errors}
            }
            const generateConfirmCode = await GenerateUuid.GenerateCodeForConfirmEmail()

            const dataCreate: RegistrationCreateType = {
                login: data.login,
                email: data.email,
                password: await genSaltAndHash(data.password),
                userConfirm: {
                    ifConfirm: false,
                    confirmationCode: generateConfirmCode,
                    dataExpire: addDays(new Date(), 1).toISOString()
                },
                ...await RegistrationDefaultValue.RegistrationDefaultCreateValue()
            }
            const createUser: CreatedMongoSuccessType = await UserRepositories.CreateUser(dataCreate)
            const getPatternMail: PatternMail = await PatternsMail.ConfirmMail(generateConfirmCode)
            const send = await sendEmail([data.email], getPatternMail.subject, getPatternMail.html)

            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Checks if a user document is found by confirmation code:
    *    a. If no user is found, next step return error invalid code.
    *    b. If a user is found, next step.
    * 2. Check that email has been confirmed.
    *    a. If email has been confirmed return error.
    *    b. If email doesn`t confirmed next step. 
    * 3. Check that the current date and time is less than the code expiration date    
    *   a. If date and time is less, next step.
    *   b. If date and time is more, send error.
    * 4. Send id and data update object to repositories for update.
    * 5. Check that 'matchedCount' is less than 0.
    *   a. If 'matchedCount' is more than 0 than return success.
    *   b. If 'matchedCount' is less 0, than return error not found.
    * 6. If process has some error throw error in the "catch"
    */
    async RegistrationUserConfirmUserByEmail (data: ConfirmCodeInputModelType): Promise<ResultNotificationType> {
        try {
            const checkConfirmCode: UserViewMongoModelType | null = await UserRepositories.GetUserByConfirmationCode(data.code)
            if (!checkConfirmCode) {
                const errors: APIErrorsMessageType = {errorsMessages: [
                    {
                        message: 'Code not found',
                        field: 'code'
                    }
                ]};  
                return {status: ResultNotificationEnum.BadRequest, errorField: errors}
            }


            if (checkConfirmCode.userConfirm.ifConfirm) {
                return {status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages: [
                        {
                            message: 'Email has been confirmed',
                            field: 'code'
                        }
                    ]}
                }
            }
    
            if (compareAsc(new Date(), checkConfirmCode.userConfirm.dataExpire) === 1) {
                return {status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages: [
                        {
                            message: 'The confirmation code has expired',
                            field: 'code'
                        }
                    ]}
                }
            }

            const dataUpdate = {$set: {'userConfirm.ifConfirm': true}}
            const ConfirmUser: UpdateMongoSuccessType = await UserRepositories.UpdateUserById(checkConfirmCode._id.toString(), dataUpdate)

            return ConfirmUser.matchedCount > 0 ? {status: ResultNotificationEnum.Success} : {status: ResultNotificationEnum.NotFound}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Checks if a user document is found by email:
    *    a. If no user is found, next step return error invalid code.
    *    b. If a user is found, next step.
    * 2. Check that email has been confirmed.
    *    a. If email has been confirmed return error.
    *    b. If email doesn`t confirmed next step. 
    * 3. Generate new confirmation code.
    * 4. Create object for update field.
    * 5. Get mail patter for send to user`s email.
    * 6. Send email to user`s email.
    * 7. Update user`s field by user`s id into collection.
    * 8. If process has some error throw error in the "catch"
    */
    async RegistrationResendConfirmCodeToEmail (data: ResendConfirmCodeInputType): Promise<ResultNotificationType> {
        try {
            const filter = {
                $or: [
                    {email: data.email}
                ]
            }
            const checkUserByEmail: UserViewMongoModelType | null = await UserRepositories.GetUserByLoginOrEmailWithOutMap(filter)
            if (!checkUserByEmail) {
                return {status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages: [
                        {
                            message: 'Email is not found',
                            field: 'email'
                        }
                    ]}
                }
            }


            if (checkUserByEmail.userConfirm.ifConfirm) {
                return {status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages: [
                        {
                            message: 'Email has been confirmed',
                            field: 'email'
                        }
                    ]}
                }
            }

            const generateConfirmCode = await GenerateUuid.GenerateCodeForConfirmEmail()
            const dataUpdate = {$set: {'userConfirm.confirmationCode': generateConfirmCode, 'userConfirm.dataExpire': addDays(new Date(), 1).toISOString()}}
            const getPatternMail: PatternMail = await PatternsMail.ConfirmMail(generateConfirmCode)
            const send = await sendEmail([data.email], getPatternMail.subject, getPatternMail.html)
            const UpdateUser: UpdateMongoSuccessType = await UserRepositories.UpdateUserById(checkUserByEmail._id.toString(), dataUpdate)
        
            return UpdateUser.matchedCount > 0 ? {status: ResultNotificationEnum.Success} : {status: ResultNotificationEnum.NotFound}
        } catch (e: any) {
            throw new Error(e)
        }
    },
}