import {
    APIErrorsMessageType, PatternMailType,
    ResultNotificationEnum,
    ResultNotificationType
} from "../../../typings/basic-types";
import {bcryptService} from "../../../internal/application/bcrypt/bcrypt";
import {addDays, compareAsc} from "date-fns";
import {patternsMailService} from "../../../internal/application/nodlemailer/patterns/patterns";
import {nodemailerService} from "../../../internal/application/nodlemailer/nodemailer";
import {
    RegistrationConfirmCodeType,
    RegistrationCreatType,
    RegistrationInputType,
    RegistrationResendConfirmCodeInputType
} from "./registration-types";
import {UserRepositories} from "../../user/user-repositories";
import {UserModel} from "../../../Domain/User/User";
import {generateUuid} from "../../../internal/utils/generate-uuid/generate-uuid";
import {saveError} from "../../../internal/utils/error-utils/save-error";


export class RegistrationService {
    constructor(
        protected userRepositories: UserRepositories,
        protected userModel: typeof UserModel
    ) {
    }
    async registrationUser(data: RegistrationInputType): Promise<ResultNotificationType> {
        try {
            const user: InstanceType<typeof UserModel> | null = await this.userRepositories.getUserByEmailOrLogin(data.email, data.login)
            if (user) {
                const errors: APIErrorsMessageType = {errorsMessages: []};
                data.login === user.login ? errors.errorsMessages.push({
                    message: 'Not unique login',
                    field: 'login'
                }) : false
                data.email === user.email ? errors.errorsMessages.push({
                    message: 'Not unique email',
                    field: 'email'
                }) : false
                return {status: ResultNotificationEnum.BadRequest, errorField: errors}
            }

            const confirmCode: string = generateUuid.generateConfirmCode()
            const createData: RegistrationCreatType = {
                login: data.login,
                email: data.email,
                password: await bcryptService.genSaltAndHash(data.password),
                userConfirm: {
                    ifConfirm: false,
                    confirmationCode: confirmCode,
                    dataExpire: addDays(new Date(), 1).toISOString()
                },
                createdAt: new Date().toISOString()
            }
            await this.userRepositories.save(new this.userModel(createData))

            const getPatternMail: PatternMailType = await patternsMailService.confirmMail(confirmCode)
            nodemailerService.sendEmail([data.email], getPatternMail.subject, getPatternMail.html)
                .catch((err) => {
                    saveError("Send Email", "SMTP", "Send confirmation code", err)
                })

            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async registrationUserConfirmUserByEmail(data: RegistrationConfirmCodeType): Promise<ResultNotificationType> {
        try {
            const user: InstanceType<typeof UserModel> | null = await this.userRepositories.getUserByConfirmationCode(data.code)
            if (!user) return {
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
            if (user.userConfirm.ifConfirm) return {
                status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages: [
                        {
                            message: 'Email has been confirmed',
                            field: 'code'
                        }
                    ]
                }
            }
            if (compareAsc(new Date(), user.userConfirm.dataExpire) === 1) return {
                status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages: [
                        {
                            message: 'The confirmation code has expired',
                            field: 'code'
                        }
                    ]
                }
            }

            user.userConfirm.ifConfirm = true
            await this.userRepositories.save(user)
            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async registrationResendConfirmCodeToEmail(data: RegistrationResendConfirmCodeInputType): Promise<ResultNotificationType> {
        try {
            const user: InstanceType<typeof UserModel> | null = await this.userRepositories.getUserByEmail(data.email)
            if (!user) return {
                status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages: [
                        {
                            message: 'Email is not found',
                            field: 'email'
                        }
                    ]
                }
            }
            if (user.userConfirm.ifConfirm) return {
                status: ResultNotificationEnum.BadRequest, errorField: {
                    errorsMessages: [
                        {
                            message: 'Email has been confirmed',
                            field: 'email'
                        }
                    ]
                }
            }

            const confirmCode: string = generateUuid.generateConfirmCode()
            user.userConfirm.confirmationCode = confirmCode
            user.userConfirm.dataExpire = addDays(new Date(), 1).toISOString()
            await this.userRepositories.save(user)

            const getPatternMail: PatternMailType = await patternsMailService.confirmMail(confirmCode)
            nodemailerService.sendEmail([data.email], getPatternMail.subject, getPatternMail.html)
                .catch((err) => {
                    saveError("Send Email", "SMTP", "Resend confirmation code", err)
                })

            return {status: ResultNotificationEnum.Success}
        } catch (e: any) {
            throw new Error(e)
        }
    }

}