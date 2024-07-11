import { comparePass, genSaltAndHash } from "../../Applications/Middleware/bcrypt/bcrypt"
import { AuthModelServiceType, ConfirmCodeInputModelType, LoginInputModelType, RefreshAuthOutputModelType, RequestLimiterInputModelViewType, RequestLimiterMongoViewType, SessionsMongoViewType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { UserInputModelType, UserViewMongoModelType } from "../../Applications/Types-Models/User/UserTypes"
import { ResultNotificationType, ResultNotificationEnum, APIErrorsMessageType, CreatedMongoSuccessType, UpdateMongoSuccessType, DeletedMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { UserRepositories } from "../../Repositories/UserRepostitories/UserRepositories"
import { RegistrationCreateType, ResendConfirmCodeInputType } from "../../Applications/Types-Models/Registration/RegistrationTypes"
import { RegistrationDefaultValue } from "../../Utils/default-values/Registration/registration-default-value"
import { sendEmail } from "../../Applications/Nodemailer/nodemailer"
import { GenerateUuid } from "../../Utils/generate-uuid/generate-uuid"
import { addDays, compareAsc, format} from "date-fns";
import { PatternsMail } from "../../Applications/Nodemailer/patterns/patterns"
import { PatternMail } from "../../Applications/Types-Models/PatternsMail/patternsMailTypes"
import { credentialJWT } from "../../Applications/JWT/jwt"
import { AuthRepositories } from "../../Repositories/AuthRepositories/AuthRepositories"



export const AuthService = {
    /*
    * 1. Attempts to authenticate the user with the provided login details (`data`), IP address (`ip`), and user agent (`userAgent`).
    * 2. Constructs a filter to search for the user by email or login.
    * 3. Retrieves the user from the database using the `UserRepositories.GetUserByLoginOrEmailWithOutMap` method:
    *    - If the user is not found, returns a result with status `ResultNotificationEnum.Unauthorized`.
    * 4. Checks if the user's email is confirmed:
    *    - If not, returns a result with status `ResultNotificationEnum.BadRequest` and an appropriate error message.
    * 5. Compares the provided password with the stored password using the `comparePass` function:
    *    - If the password does not match, returns a result with status `ResultNotificationEnum.Unauthorized`.
    * 6. Creates session data including a new device ID, user ID, device name, IP address, and issue time.
    * 7. Attempts to create a session in the database using the `AuthRepositories.CreateSession` method:
    *    - If the session creation fails, returns a result with status `ResultNotificationEnum.InternalError`.
    * 8. If the session is successfully created, generates JWT credentials for the user using `credentialJWT.SignJWT` and returns them with status `ResultNotificationEnum.Success`.
    * 9. Catches any exceptions that occur during the process and throws a new error.
    */
    async AuthUser (data: LoginInputModelType, ip: string, userAgent: string): Promise<ResultNotificationType<AuthModelServiceType>> {
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


            const SessionData = {
                dId: await GenerateUuid.GenerateDeviceId(getUser._id.toString()),
                userId: getUser._id,
                deviceName: userAgent,
                ip: ip,
                issueAt: new Date().toISOString()
            }

            const CreateSession: CreatedMongoSuccessType = await AuthRepositories.CreateSession(SessionData)

            if (!CreateSession.insertedId) {
                return {
                    status: ResultNotificationEnum.InternalError
                }
            }

            return {
                status: ResultNotificationEnum.Success,
                data: {
                    ...await credentialJWT.SignJWT(getUser._id.toString(), SessionData.dId, SessionData.issueAt) 
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
    * 1. Validates the token using `this.JWTRefreshTokenAuth` to ensure it is authorized.
    * 2. Extracts `userId`, `deviceId` from the verified token and `session id` from session data.
    * 3. Retrieves the user session from the database using `AuthRepositories.GetSessionByDeviceIdAndUserId`:
    *    - If the session is not found, returns a result with status `ResultNotificationEnum.Unauthorized`.
    *    - If the session's `issueAt` time does not match the token's `iat` time, returns a result with status `ResultNotificationEnum.Unauthorized`.
    * 4. Generates a new `issueAt` time and updates the session in the database using `AuthRepositories.UpdateSessionById`:
    *    - If the session update fails (no matching session found), returns a result with status `ResultNotificationEnum.Unauthorized`.
    * 5. If the session is successfully updated, generates new JWT credentials for the user using `credentialJWT.SignJWT` and returns them with status `ResultNotificationEnum.Success`.
    * 6. Catches any exceptions that occur during the process and throws a new error.
    */
    async RefreshToken (token: string): Promise<ResultNotificationType<AuthModelServiceType>> {
        try {
            const AuthByJWT: ResultNotificationType<RefreshAuthOutputModelType> = await this.JWTRefreshTokenAuth(token)
            if (AuthByJWT.status !== ResultNotificationEnum.Success) return {status: ResultNotificationEnum.Unauthorized}

            const {userId, deviceId } = AuthByJWT.data!.RefreshJWTPayload
            const { _id: sessionId } = AuthByJWT.data!.SessionData

            const issueAt = new Date().toISOString()
            const UpdateSession: UpdateMongoSuccessType = await AuthRepositories.UpdateSessionById(sessionId.toString(), issueAt)

            if (UpdateSession.matchedCount <= 0) return {status: ResultNotificationEnum.Unauthorized}

            return {
                status: ResultNotificationEnum.Success,
                data: {
                    ...await credentialJWT.SignJWT(userId, deviceId, issueAt)
                }
            }
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Validates the token using `this.JWTRefreshTokenAuth` to ensure it is authorized.
    * 2. Extracts `session id` from the session data.
    * 3. Retrieves the user session from the database using `AuthRepositories.GetSessionByDeviceIdAndUserId`:
    *    - If the session is not found, returns a result with status `ResultNotificationEnum.Unauthorized`.
    *    - If the session's `issueAt` time does not match the token's `iat` time, returns a result with status `ResultNotificationEnum.Unauthorized`.
    * 4. Deletes the session from the database using `AuthRepositories.DeleteSessionById`:
    *    - If the session deletion fails (no matching session found), returns a result with status `ResultNotificationEnum.InternalError`.
    * 5. If the session is successfully deleted, returns a result with status `ResultNotificationEnum.Success`.
    * 6. Catches any exceptions that occur during the process and throws a new error.
    */
    async LogOut (token: string): Promise<ResultNotificationType> {
        try {
            const AuthByJWT: ResultNotificationType<RefreshAuthOutputModelType> = await this.JWTRefreshTokenAuth(token)
            if (AuthByJWT.status !== ResultNotificationEnum.Success) return {status: ResultNotificationEnum.Unauthorized}
        
            const { _id: sessionId } = AuthByJWT.data!.SessionData
    
            const DeleteSessionResult: DeletedMongoSuccessType = await AuthRepositories.DeleteSessionById(sessionId.toString())
            if (DeleteSessionResult.deletedCount <= 0) return {status: ResultNotificationEnum.InternalError}

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
    },
    /*
    * 1. Validates and verifies a refresh token (`token`) using `credentialJWT.VerifyJWTrefresh`.
    * 2. If the token verification fails (`!verifyJWT`), returns an unauthorized status.
    * 3. Retrieves a session from the database (`AuthRepositories.GetSessionByDeviceIdAndUserId`) based on `verifyJWT.deviceId` and `verifyJWT.userId`.
    * 4. If no session is found (`!result`), returns an unauthorized status.
    * 5. Compares the session's `issueAt` timestamp with the `verifyJWT.iat` timestamp to ensure validity.
    * 6. If timestamps do not match, returns an unauthorized status.
    * 7. Returns a `ResultNotificationType` with `Success` status and includes `verifyJWT` and `result` data upon successful verification.
    * 8. Catches any exceptions that occur during the process and throws a new error.
    */
    async JWTRefreshTokenAuth (token: string): Promise<ResultNotificationType<RefreshAuthOutputModelType>> {
        try {
            const verifyJWT: any = await credentialJWT.VerifyJWTrefresh(token)
            if (!verifyJWT) {
                return {status: ResultNotificationEnum.Unauthorized}
            }
            const result: SessionsMongoViewType | null = await AuthRepositories.GetSessionByDeviceIdAndUserId(verifyJWT.deviceId, verifyJWT.userId)
            if (!result) return {status: ResultNotificationEnum.Unauthorized}
            if (result.issueAt != new Date(verifyJWT.iat).toISOString()) return {status: ResultNotificationEnum.Unauthorized}

            return {
                status: ResultNotificationEnum.Success, 
                data: {
                    RefreshJWTPayload: verifyJWT,
                    SessionData: result
                }
            }
        } catch(e: any) {
            throw new Error(e)
        }
    }
}