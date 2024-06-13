import { db } from "../../Applications/ConnectionDB/Connection"
import { LoginInputModelType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { CreatePaginationType } from "../../Applications/Types-Models/BasicTypes"
import { UserInputModelType, UserQueryParamsType, UserViewModelType, UserViewMongoModelType, UsersViewModelType } from "../../Applications/Types-Models/User/UserTypes"
import { UserService } from "../../Service/UserService/UserService"
import { map } from "../../Utils/map/map"
import { MONGO_SETTINGS } from "../../settings"


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

            const pagination: CreatePaginationType = await UserService.CreatePagination(query.pageNumber!, query.pageSize!, filter)

            const result = await db.collection<UserViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.users)
                .find(filter)
                .sort(sort)
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray()

            return await map.mapUsers(result, pagination)
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
            return result ? await map.mapUser(result, null) : null
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

    async GetCountElements (filter: Object): Promise<number> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.users).countDocuments(filter)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}