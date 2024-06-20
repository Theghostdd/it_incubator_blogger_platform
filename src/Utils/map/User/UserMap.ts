import { CreatePaginationType, PayloadJwtTokenType } from "../../../Applications/Types-Models/BasicTypes"
import { UserMeModelViewType, UserViewModelType, UserViewMongoModelType, UsersViewModelType } from "../../../Applications/Types-Models/User/UserTypes"




export const UserMap = {

    async UserMapperAuthByAccessToken (data: UserViewMongoModelType): Promise<PayloadJwtTokenType> {
        return {
            userId: data._id.toString()
        }
    },

    async UserMapperAuthMeView (data: UserViewMongoModelType): Promise<UserMeModelViewType> {
        return {
            login: data.login,
            email: data.email,
            userId: data._id.toString()
        }
    },

    async UserMapperCreateView (data: UserViewMongoModelType): Promise<UserViewModelType> {
        return {
            id: data._id.toString(),
            login: data.login,
            email: data.email,
            createdAt: data.createdAt
        }
    },


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