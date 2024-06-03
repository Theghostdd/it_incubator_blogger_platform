import { BlogViewType, BlogsViewType } from "../../Repositories/BlogRepo/BlogTypes"
import { PostViewType, PostsViewType } from "../../Repositories/PostRepo/PostTypes"
/*
*
*   Tests 
*
*/
export type InspectType = {
    status: number,
    headers: InspectHeadersType,
    checkValues: Object
}

type InspectHeadersType = {
    basic_auth: string
}
/*
*
*   Request 
*
*/
export type RequestParamsType = {
    id: string
}
/*
*
*   Response 
*
*/
export type GetResponse = BlogViewType | PostViewType

export type GetAllResponse = BlogsViewType | PostsViewType

export type StatusResponse = {
    status: number
}

