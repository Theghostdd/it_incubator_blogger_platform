import { bcryptService} from "../../internal/application/bcrypt/bcrypt"
import {
    AuthModelServiceType, ChangePasswordInputViewType, PasswordRecoveryInputViewType, PasswordRecoveryMongoViewType,
    RefreshAuthOutputModelType,
    RequestLimiterInputModelViewType,
    RequestLimiterMongoViewType,
    SessionsInputViewType,
    SessionsMongoViewType, UserLoginInputViewType
} from "../../Applications/Types-Models/Auth/AuthTypes"
import {
    UserViewMongoType
} from "../../Applications/Types-Models/User/UserTypes"
import {
    ResultNotificationType,
    ResultNotificationEnum,
    APIErrorsMessageType,
    JWTRefreshPayloadType, JWTAccessTokenType
} from "../../typings/basic-types"
import {UserRepositories} from "../../Repositories/UserRepostitories/UserRepositories"
import {
    RegistrationConfirmCodeType,
    RegistrationCreatType, RegistrationInputType, RegistrationResendConfirmCodeInputType,
} from "../../Applications/Types-Models/registration/RegistrationTypes"
import {RegistrationDefaultValue} from "../../utils/default-values/registration/registration-default-value"
import {NodemailerService} from "../../internal/application/nodlemailer/nodemailer"
import {GenerateUuid} from "../../utils/generate-uuid/generate-uuid"
import {addDays, addMinutes, compareAsc} from "date-fns";
import {PatternsMail} from "../../internal/application/nodlemailer/patterns/patterns"
import {PatternMail} from "../../Applications/Types-Models/PatternsMail/patternsMailTypes"
import {credentialJWT} from "../../internal/application/jwt/jwt"
import {AuthRepositories} from "../../Repositories/AuthRepositories/AuthRepositories"
import {SaveError} from "../../utils/error-utils/save-error";


export const AuthService = {
    /*
    * Get the user by login or email.
    *   - If the user not found return Unauthorized status.
    * Checking the send status of a user with saved statuses.
    *   - If the passwords do not match, return Unauthorized status.
    * Check confirm email status.
    *   - If the status not confirmed, then return Bad Request status.
    * Generating device id for user session.
    * Creating access and refresh token for user.
    * Get iat and exp date from the refresh token for session iatAt and expAt.
    * Create object for user`s session into DB, and send this object to repositories.
    * Catches any exceptions that occur during the process and throws a new error.
    */
    async AuthUser(data: UserLoginInputViewType, ip: string, userAgent: string): Promise<ResultNotificationType<AuthModelServiceType>> {
        try {
            const getUser: UserViewMongoType | null = await UserRepositories.GetUserByEmailOrLogin('', '', data.loginOrEmail)
            if (!getUser) return {status: ResultNotificationEnum.Unauthorized}
            if (!await bcryptService.comparePass(data.password, getUser.password)) return {status: ResultNotificationEnum.Unauthorized}
            if (!getUser.userConfirm.ifConfirm) return {
                status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages: [
                        {
                            message: 'Email has been confirmed',
                            field: 'code'
                        }
                    ]
                }
            }


            const dId: string = GenerateUuid.GenerateDeviceId(getUser._id.toString())
            const getTokens: AuthModelServiceType = await credentialJWT.SignJWT(getUser._id.toString(), dId)
            const {iat, exp} = await credentialJWT.VerifyJWTrefresh(getTokens.refreshToken) as JWTRefreshPayloadType

            const SessionData: SessionsInputViewType = {
                dId: dId,
                userId: getUser._id.toString(),
                deviceName: userAgent,
                ip: ip,
                issueAt: new Date(iat * 1000).toISOString(),
                expAt: new Date(exp * 1000).toISOString()
            }
            await AuthRepositories.CreateSession(SessionData)
            return {status: ResultNotificationEnum.Success, data: {...getTokens}}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Checking the existence of email and login in the system.
    *   - If an email or login has been found in the system, we will throw an error stating that this is not unique data.
    * Create a unique confirmation code by email.
    * Creating a user object for later saving this object in the database.
    * Saving a new user in the database.
    * Sending an email to confirm the user.
    * Catches any exceptions that occur during the process and throws a new error.
    */
    async RegistrationUser(data: RegistrationInputType): Promise<ResultNotificationType> {
        try {
            const checkLoginAndEmail: UserViewMongoType | null = await UserRepositories.GetUserByEmailOrLogin(data.email, data.login)
            if (checkLoginAndEmail) {
                const errors: APIErrorsMessageType = {errorsMessages: []};
                data.login === checkLoginAndEmail.login ? errors.errorsMessages.push({
                    message: 'Not unique login',
                    field: 'login'
                }) : false
                data.email === checkLoginAndEmail.email ? errors.errorsMessages.push({
                    message: 'Not unique email',
                    field: 'email'
                }) : false
                return {status: ResultNotificationEnum.BadRequest, errorField: errors}
            }

            const generateConfirmCode: string = await GenerateUuid.GenerateCodeForConfirmEmail()
            const dataCreate: RegistrationCreatType = {
                login: data.login,
                email: data.email,
                password: await bcryptService.genSaltAndHash(data.password),
                userConfirm: {
                    ifConfirm: false,
                    confirmationCode: generateConfirmCode,
                    dataExpire: addDays(new Date(), 1).toISOString()
                },
                ...await RegistrationDefaultValue.RegistrationDefaultCreateValue()
            }
            await UserRepositories.CreateUser(dataCreate)

            const getPatternMail: PatternMail = await PatternsMail.ConfirmMail(generateConfirmCode)
            NodemailerService.sendEmail([data.email], getPatternMail.subject, getPatternMail.html)
                .catch((err) => {
                    SaveError("Send Email", "SMTP", "Send confirmation code", err)
                })

            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Search for a user by confirmation code.
    *   - If a user with such a code is not found, we will return an error.
    *   - If the user's email has already been confirmed, we will return the error.
    *   - If the user missed the end date of confirmation of the letter, we will return the error.
    * Update the user's confirmation status.
    * Catches any exceptions that occur during the process and throws a new error.
    */
    async RegistrationUserConfirmUserByEmail(data: RegistrationConfirmCodeType): Promise<ResultNotificationType> {
        try {
            const checkConfirmCode: UserViewMongoType | null = await UserRepositories.GetUserByConfirmationCode(data.code)
            if (!checkConfirmCode) return {
                status: ResultNotificationEnum.BadRequest,
                errorField: {
                    errorsMessages: [
                        {
                            message: 'Code not found',
                            field: 'code'
                        }
                    ]
                }
            }
            if (checkConfirmCode.userConfirm.ifConfirm) return {
                status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages: [
                        {
                            message: 'Email has been confirmed',
                            field: 'code'
                        }
                    ]
                }
            }
            if (compareAsc(new Date(), checkConfirmCode.userConfirm.dataExpire) === 1) return {
                status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages: [
                        {
                            message: 'The confirmation code has expired',
                            field: 'code'
                        }
                    ]
                }
            }

            await UserRepositories.UpdateUserConfirmationStatusById(checkConfirmCode._id.toString(), true)
            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Search for a user by email.
    *   - If the crawler was not found, we will return a request error.
    *   - If the user has been confirmed, we will return the error.
    * Creating a new unique code to confirm the mail.
    * Update the unique user code by user ID, as well as send a new date when the new code will be invalid.
    * Sending an email to the user.
    * Catches any exceptions that occur during the process and throws a new error.
    */
    async RegistrationResendConfirmCodeToEmail(data: RegistrationResendConfirmCodeInputType): Promise<ResultNotificationType> {
        try {
            const checkUserByEmail: UserViewMongoType | null = await UserRepositories.GetUserByEmail(data.email)
            if (!checkUserByEmail) return {
                status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages: [
                        {
                            message: 'Email is not found',
                            field: 'email'
                        }
                    ]
                }
            }
            if (checkUserByEmail.userConfirm.ifConfirm) return {
                status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages: [
                        {
                            message: 'Email has been confirmed',
                            field: 'email'
                        }
                    ]
                }
            }

            const generateConfirmCode: string = await GenerateUuid.GenerateCodeForConfirmEmail()
            await UserRepositories.UpdateUserConfirmationCodeAndDateById(
                checkUserByEmail._id.toString(),
                generateConfirmCode,
                addDays(new Date(), 1).toISOString()
            )

            const getPatternMail: PatternMail = await PatternsMail.ConfirmMail(generateConfirmCode)
            NodemailerService.sendEmail([data.email], getPatternMail.subject, getPatternMail.html)
                .catch((err) => {
                    SaveError("Send Email", "SMTP", "Resend confirmation code", err)
                })

            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Validation of the current refresh token.
    *   - If validation failed, we will return an authorization error.
    * Receive a new pair of tokens.
    * Get the expiration date and creation date from the refresh token.
    * Update the expiration date and the date of creation of a new token in the session by its identifier.
    * Catches any exceptions that occur during the process and throws a new error.
    */
    async RefreshToken(token: string): Promise<ResultNotificationType<AuthModelServiceType>> {
        try {
            const AuthByJWT: ResultNotificationType<RefreshAuthOutputModelType> = await this.JWTRefreshTokenAuth(token)
            if (AuthByJWT.status !== ResultNotificationEnum.Success) return {status: ResultNotificationEnum.Unauthorized}

            const {userId, deviceId} = AuthByJWT.data!.RefreshJWTPayload
            const {_id: sessionId} = AuthByJWT.data!.SessionData

            const getNewPairTokens: AuthModelServiceType = await credentialJWT.SignJWT(userId.toString(), deviceId)
            const {iat, exp} = await credentialJWT.VerifyJWTrefresh(getNewPairTokens.refreshToken) as JWTRefreshPayloadType

            await AuthRepositories.UpdateSessionTimeById(
                sessionId.toString(),
                new Date(iat * 1000).toISOString(),
                new Date(exp * 1000).toISOString()
            )

            return {status: ResultNotificationEnum.Success, data: {...getNewPairTokens}}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Refresh token verification.
    *   - If verification is failed, an authorization error is returned.
    * Deleting a session by its ID.
    * Catches any exceptions that occur during the process and throws a new error.
    */
    async LogOut(token: string): Promise<ResultNotificationType> {
        try {
            const AuthByJWT: ResultNotificationType<RefreshAuthOutputModelType> = await this.JWTRefreshTokenAuth(token)
            if (AuthByJWT.status !== ResultNotificationEnum.Success) return {status: ResultNotificationEnum.Unauthorized}
            const { _id: sessionId } = AuthByJWT.data!.SessionData

            await AuthRepositories.DeleteSessionById(sessionId.toString())
            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Checking for the existence of a request at the current URL and with the current IP address.
    *   - If the request was not found, create a record of the current request and return a successful result.
    * If the query was found, check that the end date (in the database) does not exceed the current date and the number of attempts is no more than 5.
    *   - If the check failed, the error is returned.
    * Next, the same error, but if the number of attempts is less than 5.
    *   - Update +1 number of attempts.
    * If the dates have been expired (New requests are allowed), then update attempts to 1 and update the request date to the current one.
    * Catches any exceptions that occur during the logout process and rethrows them as errors.
    */
    async RequestLimiter(data: RequestLimiterInputModelViewType): Promise<ResultNotificationType> {
        try {
            const checkRequest: RequestLimiterMongoViewType | null = await AuthRepositories.GetUsersRequestByIpAndUrl(data.ip, data.url)
            if (!checkRequest) {
                await AuthRepositories.AddUserRequest(data)
                return {status: ResultNotificationEnum.Success}
            }
            const {date, _id: requestId} = checkRequest
            let { quantity} = checkRequest
            if (compareAsc(new Date(date), new Date()) === 1 && checkRequest.quantity >= 5) {
                return {status: ResultNotificationEnum.BadRequest}
            }

            if (compareAsc(new Date(date), new Date()) === 1 && checkRequest.quantity >= 1) {
                await AuthRepositories.UpdateUserRequestQuantityAndDateById(requestId.toString(), ++quantity, date)
                return {status: ResultNotificationEnum.Success}
            }

            await AuthRepositories.UpdateUserRequestQuantityAndDateById(requestId.toString(), 1, data.date)
            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Receiving all overdue requests.
    * If the requests were found, then convert to a new array of all found identifiers and start the deletion process.
    * Catches any exceptions that occur during the logout process and rethrows them as errors.
    */
    async ClearRequestLimitCollection(subSecond: string): Promise<ResultNotificationType> {
        try {
            const getElements: RequestLimiterMongoViewType[] | null = await AuthRepositories.GetAllExpUserRequest(subSecond)
            if (getElements && getElements.length > 0) {
                await AuthRepositories.ClearAllExpUserRequest(
                    getElements.map((items) => items._id)
                )
            }
            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Intermediate layer for refresh token verification.
    * Refresh token verification, if the token is not a valid authorization error return.
    * Getting a session by its ID.
    *   - If the session is not found, an authorization error is returned.
    * If the date of issue of the transferred token does not correspond to the date of issue from the session, an authorization error is returned.
    * Catches any exceptions that occur during the process and throws a new error.
    */
    async JWTRefreshTokenAuth(token: string): Promise<ResultNotificationType<RefreshAuthOutputModelType>> {
        try {
            const verifyJWT: any = await credentialJWT.VerifyJWTrefresh(token)
            if (!verifyJWT) return {status: ResultNotificationEnum.Unauthorized}
            const { iat, deviceId } = verifyJWT

            const result: SessionsMongoViewType | null = await AuthRepositories.GetSessionByDeviceId(deviceId)
            if (!result) return {status: ResultNotificationEnum.Unauthorized}
            if (result.issueAt != new Date(iat * 1000).toISOString()) return {status: ResultNotificationEnum.Unauthorized}

            return {status: ResultNotificationEnum.Success, data: {RefreshJWTPayload: verifyJWT, SessionData: result}}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Intermediate layer for access token verification.
    * Access token verification, if the token is not a valid authorization error return.
    * Getting a user by its ID.
    *   - If the user is not found, an authorization error is returned.
    * Catches any exceptions that occur during the process and throws a new error.
    */
    async JWTAccessTokenAuth(token: string): Promise<ResultNotificationType<JWTAccessTokenType>> {
        try {
            const verifyJWT = await credentialJWT.VerifyJWT(token) as JWTAccessTokenType
            if (!verifyJWT) return {status: ResultNotificationEnum.Unauthorized}
            const { userId } = verifyJWT

            const getUser: UserViewMongoType | null = await UserRepositories.GetUserById(userId)
            if (!getUser) return {status: ResultNotificationEnum.Unauthorized}

            return {status: ResultNotificationEnum.Success, data: verifyJWT}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Checking if such an email exists
    * Generation of a password recovery code.
    * Creating a document object for password recovery.
    * If the user has been found, we will create a password recovery session.
    * Getting the email template to send.
    * Sending a letter.
    * Catches any exceptions that occur during the process and throws a new error.
    */
    async PasswordRecovery (data: PasswordRecoveryInputViewType): Promise<ResultNotificationType> {
        try {
            const checkEmail: UserViewMongoType | null = await UserRepositories.GetUserByEmail(data.email)

            const generateConfirmCode: string = await GenerateUuid.GenerateCodeForConfirmEmail()
            const recoverCreateData = {
                email: data.email,
                code: generateConfirmCode,
                expAt: addMinutes(new Date(), 20).toISOString()
            }
            if (checkEmail) await AuthRepositories.CreateRecoveryPasswordSession(recoverCreateData)

            const getPatternMail: PatternMail = await PatternsMail.RecoveryMail(generateConfirmCode)
            NodemailerService.sendEmail([data.email], getPatternMail.subject, getPatternMail.html)
                .catch((err) => {
                    SaveError("Send Email", "SMTP", "Send link for password recovery", err)
                })

            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Receiving a password recovery session using the password recovery code.
    * If the session is not found, return an error.
    * If a session is found, check if it is a valid session.
    * If the session is overdue, return an error.
    * If the session is not expired, we will find the user by email.
    * If the user has been found, we will generate a new password hash and update it and delete recovery session.
    * If the user is not found, throw the error.
    * Catches any exceptions that occur during the process and throws a new error.
    */
    async ChangeUserPassword (data: ChangePasswordInputViewType): Promise<ResultNotificationType<APIErrorsMessageType>> {
        try {
            const GetCode: PasswordRecoveryMongoViewType | null = await AuthRepositories.GetRecoveryPasswordSessionByCode(data.recoveryCode)
            if (!GetCode) return {status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages:[{message: "Bad code", field: 'recoveryCode'}]
            }}
            const { expAt, email, _id: sessionId } = GetCode

            if (compareAsc(new Date(), expAt) === 1) return {status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages:[{message: "Bad code", field: 'recoveryCode'}]
            }}

            const GetUser: UserViewMongoType | null = await UserRepositories.GetUserByEmail(email)
            if (!GetUser) return {status: ResultNotificationEnum.BadRequest}

            await UserRepositories.UpdateUserPasswordById(GetUser._id.toString(), await bcryptService.genSaltAndHash(data.newPassword))
            await AuthRepositories.DeleteRecoveryPasswordSessionById(sessionId.toString())

            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    },
}