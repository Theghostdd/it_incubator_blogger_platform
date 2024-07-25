import {
    CreatePaginationType,
    QueryParamsType,
    ResultDataWithPaginationType
} from "../../Applications/Types-Models/BasicTypes"
import { CreateUserPagination } from "../../utils/pagination/UserPagination"
import { UserMap } from "../../utils/map/User/UserMap"
import {
    UserMeModelViewType,
    UserQueryParamsType,
    UserViewModelType
} from "../../Applications/Types-Models/User/UserTypes";
import {UserModel} from "../../Domain/User/User";


export const UserQueryRepositories = {
    /*
    * Building a sorting filter.
    * Building a filter to search for data.
    * Creating pagination in accordance with the specified filter and pagination data obtained from the query.
    * Search for all users by a given filter, sorting and pagination.
    * Return of the corresponding user model with pagination.
    * Catch some errors and return new Error
    */
    async GetAllUsers (query: QueryParamsType<UserQueryParamsType>): Promise<ResultDataWithPaginationType<UserViewModelType[]>> {
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
            const result = await UserModel
                .find(filter)
                .sort(sort)
                .skip(pagination.skip)
                .limit(pagination.pageSize)

            return await UserMap.UsersMapperView(result, pagination)
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Search for a user by their ID.
    * If the user was found, the return of his stored data, if the user was not found, is null.
    * Catch some errors and return new Error
    */
    async GetUserByIdAuthMe (id: string): Promise<UserMeModelViewType | null> {
        try {
            const result = await UserModel.findById(id)
            return result ? await UserMap.UserMapperAuthMeView(result) : null
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * Getting the total number of user records by filter.
    * If an error occurs during the database query, throw an error with the details.
    */
    async GetCountElements (filter: any): Promise<number> {
        try {
            return await UserModel.countDocuments(filter)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}