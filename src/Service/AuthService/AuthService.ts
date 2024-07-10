import { comparePass, genSaltAndHash } from "../../Applications/Middleware/bcrypt/bcrypt"
import { AuthModelServiceType, AuthOutputModelType, ConfirmCodeInputModelType, LoginInputModelType, RequestLimiterInputModelViewType, RequestLimiterMongoViewType, TokenBlackListMongoViewType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { UserInputModelType, UserViewMongoModelType } from "../../Applications/Types-Models/User/UserTypes"
import { ResultNotificationType, ResultNotificationEnum, APIErrorsMessageType, CreatedMongoSuccessType, UpdateMongoSuccessType, DeletedMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { UserRepositories } from "../../Repositories/UserRepostitories/UserRepositories"
import { RegistrationCreateType, ResendConfirmCodeInputType } from "../../Applications/Types-Models/Registration/RegistrationTypes"
import { RegistrationDefaultValue } from "../../Utils/default-values/Registration/registration-default-value"
import { sendEmail } from "../../Applications/Nodemailer/nodemailer"
import { GenerateUuid } from "../../Utils/generate-uuid/generate-uuid"
import { addDays, compareAsc} from "date-fns";
import { PatternsMail } from "../../Applications/Nodemailer/patterns/patterns"
import { PatternMail } from "../../Applications/Types-Models/PatternsMail/patternsMailTypes"
import { credentialJWT } from "../../Applications/JWT/jwt"
import { AuthRepositories } from "../../Repositories/AuthRepositories/AuthRepositories"



export const AuthService = {
    /*
    * 1. Creates a filter to search for a user in the database using either the provided email or login from the input data.
    * 2. Calls repositories to retrieve the user from the database matching the filter.
    *    - If no matching user is found, returns a result with status Unauthorized.
    * 3. Checks if the user's email is confirmed (`getUser.userConfirm.ifConfirm`).
    *    - If the email is not confirmed, returns a result with status badRequest and includes an error message indicating the email confirmation issue.
    * 4. Verifies the provided password against the stored hashed password using `comparePass`.
    *    - If the password verification fails, returns a result with status Unauthorized.
    * 5. Generates new JWT tokens using JWT`s util with the user's ID.
    *    - If successful, returns a result with status Success and includes the new tokens in the `data` property.
    * 6. Catches any exceptions that occur during the authentication process and rethrows them as errors.
    */
    async AuthUser (data: LoginInputModelType): Promise<ResultNotificationType<AuthModelServiceType>> {
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
                    ...await credentialJWT.SignJWT({userId: getUser._id}) 
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
    /*
    * 1. Verifies the provided refresh token using JWT`s util.
    *    - If the token verification fails, returns a result with status Unauthorized.
    * 2. Extracts `userId` and `exp` (expiration time) from the verified token.
    * 3. Checks if the refresh token is in the blacklist using auth repositories.
    *    - If the token is found in the blacklist, returns a result with status Unauthorized.
    * 4. Adds the refresh token to the blacklist using auth repositories to prevent future reuse.
    * 5. Generates new JWT tokens using JWT`s util with the user's ID.
    *    - If successful, returns a result with status Success and includes the new tokens in the `data` property.
    * 6. Catches any exceptions that occur during the refresh token process and rethrows them as errors.
    */
    async RefreshToken (token: string): Promise<ResultNotificationType<AuthModelServiceType>> {
        try {
            const verifyJWT: any = await credentialJWT.VerifyJWTrefresh(token)
            if (!verifyJWT) {
                return {status: ResultNotificationEnum.Unauthorized}
            }

            const {userId, exp} = verifyJWT

            const checkToken: TokenBlackListMongoViewType | null = await AuthRepositories.GetTokenBlackList(token)
            if (checkToken) {
                return {status: ResultNotificationEnum.Unauthorized}
            }

            await AuthRepositories.AddTokenToBlackList({userId: userId, token: token, exp: exp})

            return {
                status: ResultNotificationEnum.Success,
                data: {
                    ...await credentialJWT.SignJWT({userId: userId})
                }
            }
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Verifies the provided refresh token using JWT`s util.
    *    - If the token verification fails, returns a result with status Unauthorized.
    * 2. Extracts `userId` and `exp` (expiration time) from the verified token.
    * 3. Checks if the refresh token is in the blacklist using auth repositories.
    *    - If the token is found in the blacklist, returns a result with status Unauthorized.
    * 4. Adds the refresh token to the blacklist using auth repositories to ensure the token is invalidated.
    * 5. Returns a result with status Success, indicating that the logout process was completed successfully.
    * 6. Catches any exceptions that occur during the logout process and rethrows them as errors.
    */
    async LogOut (token: string): Promise<ResultNotificationType> {
        try {
            const verifyJWT: any = await credentialJWT.VerifyJWTrefresh(token)
            if (!verifyJWT) {
                return {status: ResultNotificationEnum.Unauthorized}
            }

            const {userId, exp} = verifyJWT

            const checkToken: TokenBlackListMongoViewType | null = await AuthRepositories.GetTokenBlackList(token)
            if (checkToken) {
                return {status: ResultNotificationEnum.Unauthorized}
            }

            await AuthRepositories.AddTokenToBlackList({userId: userId, token: token, exp: exp})

            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Checks if there is a request record matching the IP address and URL in the database.
    *    a. Retrieves the request record using repositories.
    *    b. If no matching record is found (`checkRequest` is null):
    *       i. Adds a new request record using repositories.
    *       ii. Returns `Success`.
    * 2. If a matching record is found:
    *    a. Compares the timestamp of the existing request (`checkRequest.date`) with the current timestamp.
    *    b. If the existing request's timestamp is greater than the current timestamp and `quantity` is 5 or more:
    *       i. Returns `BadRequest`.
    *    c. If the existing request's timestamp is greater than the current timestamp and `quantity` is less than 5:
    *       i. Increments the `quantity` of the request.
    *       ii. Updates the request record using repositories.
    *       iii. Returns `Success`.
    *    d. If the existing request's timestamp is less than the current timestamp:
    *       i. Updates the request's `quantity` and `date` using repositories.
    *       ii. Returns `Success`.
    * 6. Catches any exceptions that occur during the logout process and rethrows them as errors.
    */
    async RequestLimiter (data: RequestLimiterInputModelViewType): Promise<ResultNotificationType> {
        try {
            const checkRequest: RequestLimiterMongoViewType | null = await AuthRepositories.GetUsersRequestByIpAndUrl(data.ip, data.url)

            if (!checkRequest) {
                await AuthRepositories.AddRequest(data)
                return {status: ResultNotificationEnum.Success}
            }

            if (compareAsc(checkRequest.date, new Date().toISOString()) === 1 && checkRequest.quantity >= 5) {
                return {status: ResultNotificationEnum.BadRequest}
            } 
            if (compareAsc(checkRequest.date, new Date().toISOString()) === 1 && checkRequest.quantity >= 1) {
                await AuthRepositories.UpdateRequestById(checkRequest._id.toString(), ++checkRequest.quantity,checkRequest.date)
                return {status: ResultNotificationEnum.Success}
            } 
            
            await AuthRepositories.UpdateRequestById(checkRequest._id.toString(), data.quantity, data.date)
            return {status: ResultNotificationEnum.Success}

        } catch(e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Attempts to clear expired requests from the request limit collection based on a provided timestamp.
    *    a. Retrieves all expired request elements using repositories with `subSecond`.
    *    b. If there are elements (elements is not null and has length > 0):
    *       i. Extracts IDs of the expired requests using `map`.
    *       ii. Clears the expired requests from the collection using repositories with `mapId`.
    *    c. Returns success.
    * 2. Catches any exceptions that occur during the logout process and rethrows them as errors.
    */
    async ClearRequestLimitCollection (subSecond: Date): Promise<ResultNotificationType> {
        try {
            const getElements: RequestLimiterMongoViewType[] | null = await AuthRepositories.GetAllExpRequest(subSecond)
            if (getElements && getElements.length > 0) {
                const mapId = getElements.map((items) => items._id)
                const clearCollection: DeletedMongoSuccessType = await AuthRepositories.ClearExpRequest(mapId)
            }
            return {status: ResultNotificationEnum.Success}
        } catch(e: any) {
            throw new Error(e)
        }
    }
}