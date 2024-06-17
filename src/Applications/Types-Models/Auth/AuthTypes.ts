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

export type AuthOutputType = JwtType

