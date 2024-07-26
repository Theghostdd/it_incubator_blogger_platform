import {
    ResultDataWithPaginationType
} from "../../../typings/basic-types"
import {UserMeModelViewType, UserViewModelType, UserViewMongoType} from "../../../features/user/user-types";
import {UserModel} from "../../../Domain/User/User";


export const userMap = {

    userMapperAuthMeView (data: UserViewMongoType): UserMeModelViewType {
        return {
            login: data.login,
            email: data.email,
            userId: data._id.toString()
        }
    },

    userMapperView (data: UserViewMongoType): UserViewModelType {
        return {
            id: data._id.toString(),
            login: data.login,
            email: data.email,
            createdAt: data.createdAt
        }
    },

    usersMapperView (data: UserViewMongoType[], pagesCount: number, page: number, pageSize: number, totalCount: number ): ResultDataWithPaginationType<UserViewModelType[] | []> {
        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: pageSize,
            totalCount: totalCount,
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