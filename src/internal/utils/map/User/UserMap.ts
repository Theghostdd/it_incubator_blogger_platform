import {
    CreatePaginationType,
    ResultDataWithPaginationType
} from "../../../Applications/Types-Models/BasicTypes"
import {
    UserMeModelViewType,
    UserViewModelType,
    UserViewMongoType
} from "../../../Applications/Types-Models/User/UserTypes"


export const UserMap = {
    /* 
    * Maps the user`s model view for about current user.
    */
    async UserMapperAuthMeView (data: UserViewMongoType): Promise<UserMeModelViewType> {
        return {
            login: data.login,
            email: data.email,
            userId: data._id.toString()
        }
    },
    /* 
    * Maps the user`s model view for service when creating new user.
    */
    async UserMapperCreateView (data: UserViewMongoType): Promise<UserViewModelType> {
        return {
            id: data._id.toString(),
            login: data.login,
            email: data.email,
            createdAt: data.createdAt
        }
    },
    /* 
    * Data mapping and user model return.
    */
    async UsersMapperView (data: UserViewMongoType[], pagination: CreatePaginationType): Promise<ResultDataWithPaginationType<UserViewModelType[]>> {
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