import {UserConfirmationViewType} from "../../user/user-types";

export type RegistrationInputType = {
    login: string,
    password: string
    email: string
}

export type RegistrationCreatType = RegistrationInputType & {
    userConfirm: UserConfirmationViewType,
    createdAt: string
}

export type RegistrationConfirmCodeType = {
    code: string
}

export type RegistrationResendConfirmCodeInputType = {
    email: string
}