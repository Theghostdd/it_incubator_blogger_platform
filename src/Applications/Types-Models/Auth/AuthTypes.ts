import { JwtType } from "../BasicTypes"

/*
*
*
*       Login Input type
*
*
*/
export type LoginInputModelType = {
    loginOrEmail: string,
    password: string
}
/*
*
*
*       Auth output model
*
*
*/
export type AuthOutputModelType = JwtType
/*
*
*
*       Auth output model
*
*
*/
export type ConfirmCodeInputModelType = {
    code: string
}




