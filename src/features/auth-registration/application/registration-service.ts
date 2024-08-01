import {
    APIErrorsMessageType,
    ResultNotificationEnum,
    ResultNotificationType
} from "../../../typings/basic-types";
import {BcryptService} from "../../../internal/application/bcrypt/bcrypt";
import {compareAsc} from "date-fns";
import {UserRepositories} from "../../user/infrastructure/user-repositories";
import {UserModel} from "../domain/user-entity";
import {inject, injectable} from "inversify";
import {
    UserRegisterInputDto,
    UserRegistrationConfirmCodeInputDto,
    UserRegistrationResendConfirmCodeInputDto
} from "../api/input-models/dto";
import {HydratedDocument} from "mongoose";
import {UserDto} from "../domain/dto";
import {IUserInstanceMethods} from "../domain/interfaces";
import {Uuid} from "../../../internal/application/uuiid/uuid";
import {AuthMailService} from "./mail-service";

@injectable()
export class RegistrationService {
    constructor(
        @inject(UserRepositories) private userRepositories: UserRepositories,
        @inject(UserModel) private userModel: typeof UserModel,
        @inject(BcryptService) private bcryptService: BcryptService,
        @inject(Uuid) private uuid: Uuid,
        @inject(AuthMailService) private authMailService: AuthMailService
    ) {}

    async registrationUser(registerInputDto: UserRegisterInputDto): Promise<ResultNotificationType> {
        const user: HydratedDocument<UserDto, IUserInstanceMethods> | null = await this.userRepositories.getUserByEmailOrLogin(registerInputDto.email, registerInputDto.login)
        if (user) {
            const errors: APIErrorsMessageType = {errorsMessages: []};
            registerInputDto.login === user.login ? errors.errorsMessages.push({
                message: 'Not unique login',
                field: 'login'
            }) : false
            registerInputDto.email === user.email ? errors.errorsMessages.push({
                message: 'Not unique email',
                field: 'email'
            }) : false
            return {status: ResultNotificationEnum.BadRequest, errorField: errors, data: null}
        }

        const hashPass: string = await this.bcryptService.genSaltAndHash(registerInputDto.password)
        const confirmCode: string = this.uuid.generateConfirmCode()

        const newUser: HydratedDocument<UserDto, IUserInstanceMethods> = this.userModel.createInstance(registerInputDto, hashPass, confirmCode)
        await this.userRepositories.save(newUser)

        this.authMailService.sendRegistrationMail([registerInputDto.email], confirmCode)
        return {status: ResultNotificationEnum.Success, data: null}
    }

    async registrationUserConfirmUserByEmail(userConfirmRegistrationDto: UserRegistrationConfirmCodeInputDto): Promise<ResultNotificationType> {
        const user: HydratedDocument<UserDto, IUserInstanceMethods> | null = await this.userRepositories.getUserByConfirmationCode(userConfirmRegistrationDto.code)
        if (!user) return {
            status: ResultNotificationEnum.BadRequest,
            errorField: {errorsMessages: [{message: 'Code not found', field: 'code'}]},
            data: null
        }
        if (user.userConfirm.ifConfirm) return {
            status: ResultNotificationEnum.BadRequest,
            errorField: {errorsMessages: [{message: 'Email has been confirmed', field: 'code'}]},
            data: null
        }
        if (compareAsc(new Date(), user.userConfirm.dataExpire) === 1) return {
            status: ResultNotificationEnum.BadRequest,
            errorField: {errorsMessages: [{message: 'The confirmation code has expired', field: 'code'}]},
            data: null
        }

        user.confirmEmail()

        await this.userRepositories.save(user)
        return {status: ResultNotificationEnum.Success, data: null}
    }

    async registrationResendConfirmCodeToEmail(userResendRegistrationConfirmCodeDto: UserRegistrationResendConfirmCodeInputDto): Promise<ResultNotificationType> {
        const user: HydratedDocument<UserDto, IUserInstanceMethods> | null = await this.userRepositories.getUserByEmail(userResendRegistrationConfirmCodeDto.email)
        if (!user) return {
            status: ResultNotificationEnum.BadRequest,
            errorField: {errorsMessages: [{message: 'Email is not found', field: 'email'}]},
            data: null
        }
        if (user.userConfirm.ifConfirm) return {
            status: ResultNotificationEnum.BadRequest,
            errorField: {errorsMessages: [{message: 'Email has been confirmed', field: 'email'}]},
            data: null
        }

        const confirmCode: string = this.uuid.generateConfirmCode()

        user.updateConfirmCode(confirmCode)
        await this.userRepositories.save(user)

        this.authMailService.sendRegistrationMail([userResendRegistrationConfirmCodeDto.email], confirmCode)

        return {status: ResultNotificationEnum.Success, data: null}
    }

}