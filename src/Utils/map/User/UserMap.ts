import { CreatePaginationType, PayloadJwtTokenType } from "../../../Applications/Types-Models/BasicTypes"
import { UserMeModelViewType, UserViewModelType, UserViewMongoModelType, UsersViewModelType } from "../../../Applications/Types-Models/User/UserTypes"




export const UserMap = {
    /* 
    * 1. Takes user data.
    * 2. Maps the user`s model view type to JWT Access Token.
    * 3. Returns a structured JWT payload object.
    */
    async UserMapperAuthByAccessToken (data: UserViewMongoModelType): Promise<PayloadJwtTokenType> {
        return {
            userId: data._id.toString()
        }
    },
    /* 
    * 1. Takes user data.
    * 2. Maps the user`s model view for endpoint '/auth/me'.
    * 3. Returns a structured object.
    */
    async UserMapperAuthMeView (data: UserViewMongoModelType): Promise<UserMeModelViewType> {
        return {
            login: data.login,
            email: data.email,
            userId: data._id.toString()
        }
    },
    /* 
    * 1. Takes user data.
    * 2. Maps the user`s model view for service when creating new user.
    * 3. Returns a structured object.
    */
    async UserMapperCreateView (data: UserViewMongoModelType): Promise<UserViewModelType> {
        return {
            id: data._id.toString(),
            login: data.login,
            email: data.email,
            createdAt: data.createdAt
        }
    },
    /* 
    * 1. Takes users and pagination data.
    * 2. Maps the user`s models view for query repositories to return all users data with pagination.
    * 3. If users data have empty array then 'items' must be empty array.
    * 4. Returns a structured object.
    */
    async UsersMapperView (data: UserViewMongoModelType[], pagination: CreatePaginationType): Promise<UsersViewModelType> {
        return {
            pagesCount: pagination.pagesCount,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalCount: pagination.totalCount,
            items: data.map((item) => {
                return {
                    id: item._id.toString(),
                    login: item.login,
                    email: item.email,
                    createdAt: item.createdAt
                }
            })

        }
    },
}