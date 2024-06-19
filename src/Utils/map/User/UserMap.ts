import { CreatePaginationType, CreatedMongoSuccessType, PayloadJwtToken } from "../../../Applications/Types-Models/BasicTypes"
import { UserCreateInputModelType, UserMeModelViewType, UserViewModelType, UserViewMongoModelType, UsersViewModelType } from "../../../Applications/Types-Models/User/UserTypes"




export const UserMap = {

    async UserMapperAuthByAccessToken (data: UserViewMongoModelType): Promise<PayloadJwtToken> {
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







    









    async GetUserMap (data: UserViewMongoModelType ): Promise<UserViewModelType> {
        return {
            id: data._id.toString(),
            login: data.login,
            email: data.email,
            createdAt: data.createdAt
        }
    },

    async mapUsers (data: UserViewMongoModelType[], pagination: CreatePaginationType): Promise<UsersViewModelType> {
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

    async mapUser (data: UserCreateInputModelType | UserViewMongoModelType , mongoSuc: CreatedMongoSuccessType | null): Promise<UserViewModelType> {
        return {
            id: mongoSuc ? mongoSuc.insertedId.toString() : ('_id' in data ? data._id.toString() : (() => { throw new Error('ID Not transmitted') })()),
            login: data.login,
            email: data.email,
            createdAt: data.createdAt
        }
    },
}