import { Sort } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { UserMongoOutputType, UserQueryParamsType, UsersOutputType } from "../../Applications/Types/UserTypes/UserTypes"
import { SETTINGS } from "../../settings"
import { UserService } from "../../Service/UserService"
import { UsersOutputMap } from "../../Applications/Utils/map/UserMap"
import { Response } from "../../Applications/Utils/Response"
import { PaginationType } from "../../Applications/Types/Types"
import { SaveError } from "../../Service/ErrorService/ErrorService"




export const UserQueryRepo = {
    async GetUserByLoginOrEmail (login: string, email: string): Promise<UserMongoOutputType | null> {
        try {
            const result = await db.collection<UserMongoOutputType>(SETTINGS.MONGO.COLLECTIONS.users).findOne({$or: [{login: login}, {email: email}]})
            return result
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async GetAllUsers (query: UserQueryParamsType):Promise<UsersOutputType> {
        try {
            const sortBy = query.sortBy
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1
            const sort: Sort = sortBy ? { [sortBy]: sortDirection } : {};

            const filter = {
                $and: [
                    { login: { $regex: query.searchLoginTerm ? query.searchLoginTerm : '', $options: 'i' } },
                    { email: { $regex: query.searchEmailTerm ? query.searchEmailTerm : '', $options: 'i' } }
                ]
            }

            const createPagination: PaginationType = await UserService.CreatePagination(query.pageNumber!, query.pageSize!, filter)
            const result = await db.collection<UserMongoOutputType>(SETTINGS.MONGO.COLLECTIONS.users)
                .find(filter)
                .sort(sort)
                .skip(createPagination.skip)
                .limit(createPagination.pageSize)
                .toArray()
            if (result.length > 0) {
                return {
                    status: 200,
                    data: {
                        pagesCount: createPagination.pagesCount,
                        page: createPagination.page,
                        pageSize: createPagination.pageSize,
                        totalCount: createPagination.totalCount,
                        items: await UsersOutputMap(result)
                    }
                }
            }
            return Response.E404New
        } catch (e: any) {
            SaveError(SETTINGS.PATH.USER, 'GET', 'Getting all the user items', e)
            return Response.E500New
        }
    },

    async GetCountUsers (filter: Object): Promise<number> {
        try {
            return await db.collection(SETTINGS.MONGO.COLLECTIONS.users).countDocuments(filter)
        } catch (e: any) {
            throw new Error(e)
        }
    } 
}