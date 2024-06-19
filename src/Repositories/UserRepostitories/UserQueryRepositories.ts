import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { LoginInputModelType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { CreatePaginationType, PayloadJwtToken } from "../../Applications/Types-Models/BasicTypes"
import { UserInputModelType, UserMeModelViewType, UserQueryParamsType, UserViewModelType, UserViewMongoModelType, UsersViewModelType } from "../../Applications/Types-Models/User/UserTypes"
import { CreateUserPagination } from "../../Utils/pagination/UserPagination"
import { MONGO_SETTINGS } from "../../settings"
import { UserMap } from "../../Utils/map/User/UserMap"


export const UserQueryRepositories = {
    async GetAllUsers (query: UserQueryParamsType): Promise<UsersViewModelType> {
        try {
            const sort = {
                [query.sortBy!]: query.sortDirection!
            }
            const filter = {
                $or: [
                    {login: {$regex: query.searchLoginTerm, $options: 'i'}},
                    {email: {$regex: query.searchEmailTerm, $options: 'i'}}
                ]
            }

            const pagination: CreatePaginationType = await CreateUserPagination(query.pageNumber!, query.pageSize!, filter)

            const result = await db.collection<UserViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.users)
                .find(filter)
                .sort(sort)
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray()

            return await UserMap.mapUsers(result, pagination)
        } catch (e: any) { 
            throw new Error(e)
        }
    },

    async GetUserByLoginOrEmail (data: UserInputModelType): Promise<UserViewModelType | null> {
        try {
            const filter = {
                $or: [
                    {login: data.login},
                    {email: data.email}
                ]
            }
            const result = await db.collection<UserViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.users).findOne(filter)
            return result ? await UserMap.mapUser(result, null) : null
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async GetUserByLoginOrEmailWithOutMap (data: LoginInputModelType): Promise<UserViewMongoModelType | null> {
        try {
            const filter = {
                $or: [
                    {login: data.loginOrEmail},
                    {email: data.loginOrEmail}
                ]
            }
            const result = await db.collection<UserViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.users).findOne(filter)
            return result ? result : null
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async GetUserByIdAuthByJwtToken (id: string): Promise<PayloadJwtToken | null> {
        try {
            const result = await db.collection<UserViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.users).findOne({_id: new ObjectId(id)})
            return result ? await UserMap.UserMapperAuthByAccessToken(result) :  null
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async GetUserByIdAuthMe (id: string): Promise<UserMeModelViewType | null> {
        try {
            const result = await db.collection<UserViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.users).findOne({_id: new ObjectId(id)})
            return result ? await UserMap.UserMapperAuthMeView(result) : null
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async GetCountElements (filter: Object): Promise<number> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.users).countDocuments(filter)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}