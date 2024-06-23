import { credentialJWT } from "../../Applications/Middleware/auth/UserAuth/jwt"
import { comparePass, genSaltAndHash } from "../../Applications/Middleware/bcrypt/bcrypt"
import { AuthOutputModelType, LoginInputModelType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { UserInputModelType, UserViewMongoModelType } from "../../Applications/Types-Models/User/UserTypes"
import { ResultNotificationType, ResultNotificationEnum, APIErrorsMessageType, CreatedMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { UserRepositories } from "../../Repositories/UserRepostitories/UserRepositories"
import { RegistrationCreateType } from "../../Applications/Types-Models/Registration/RegistrationTypes"
import { RegistrationDefaultValue } from "../../Utils/default-values/Registration/registration-default-value"
import { sendEmail } from "../../Applications/Nodemailer/nodemailer"
import { GenerateUuid } from "../../Utils/generate-uuid/generate-uuid"

import { addDays} from "date-fns";
import { PatternsMail } from "../../Applications/Nodemailer/patterns/patterns"
import { PatternMail } from "../../Applications/Types-Models/PatternsMail/patternsMailTypes"



export const AuthService = {
    /* 
    * 1. Constructs a filter object to find a user document by login or email.
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
                    {login: data.loginOrEmail},
                    {email: data.loginOrEmail}
                ]
            }
            const getUser: UserViewMongoModelType | null = await UserRepositories.GetUserByLoginOrEmailWithOutMap(filter)
            if (!getUser) {
                return {status: ResultNotificationEnum.Unauthorized}
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
    * 1. Constructs a filter object to find a user document by login or email.
    * 2. Queries to db.
    * 3. . Checks if a user document is found:
    *    a. If no user is found, next step.
    *    b. If a user is found, return error not uniq values and return this values.
    * 4. Generate confirm`s code for confirm email user with uuid.
    * 5. Next step is create data object for create new user in db
    *   a. Creating hash password.
    *   b. Creating current date + 1 day to this day for tracking expire data confirm email.
    * 6. Create user, use repositories.
    * 7. Getting email pattern for confirm email.
    * 8. Send email to user.
    * 9. If process has some error throw error in the "catch"
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

            // const createTrackingRegistration = '';
            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    } 
}