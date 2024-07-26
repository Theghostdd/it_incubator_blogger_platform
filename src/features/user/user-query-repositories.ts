import {
    QueryParamsType,
    ResultDataWithPaginationType
} from "../../typings/basic-types";
import {UserModel} from "../../Domain/User/User";
import {defaultQueryValues} from "../../internal/utils/default-values/default-query-values";
import {UserMeModelViewType, UserQueryParamsType, UserViewModelType, UserViewMongoType} from "./user-types";
import {userMap} from "../../internal/utils/map/userMap";


export class UserQueryRepositories {
    constructor(
        protected userModel: typeof UserModel
    ) {
    }
    async getAllUsers (query: QueryParamsType<UserQueryParamsType>): Promise<ResultDataWithPaginationType<UserViewModelType[] | []>> {
        try {

            const {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm}: QueryParamsType<UserQueryParamsType> = defaultQueryValues.defaultQueryUserValues(query)

            const sort = {
                [sortBy!]: sortDirection!
            }
            const filter = {
                $or: [
                    {login: {$regex: searchLoginTerm, $options: 'i'}},
                    {email: {$regex: searchEmailTerm, $options: 'i'}}
                ]
            }

            const getTotalDocument: number = await this.userModel.countDocuments(filter)
            const totalCount = +getTotalDocument
            const pagesCount = Math.ceil(totalCount / pageSize!)
            const skip = (pageNumber! - 1) * pageSize!

            const result: UserViewMongoType[] | [] = await this.userModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(pageSize!)
                .lean()

            return userMap.usersMapperView(result, pagesCount, pageNumber!, pageSize!, totalCount)
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async getUserByIdAuthMe (id: string): Promise<UserMeModelViewType | null> {
        try {
            const result: UserViewMongoType | null = await this.userModel.findById(id).lean()
            return result ? userMap.userMapperAuthMeView(result) : null
        } catch (e: any) {
            throw new Error(e)
        }
    }
}