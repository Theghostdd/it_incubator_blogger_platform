import { UserCreateInputModelType } from "../User/UserTypes"













export type RegistrationCreateType = UserCreateInputModelType & {
    userConfirm: RegistrationConfirm
} 



export type RegistrationConfirm = {
    ifConfirm: boolean,
    confirmationCode: string,
    dataExpire: string
}