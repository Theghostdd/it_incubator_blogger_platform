import {
    QueryParamsType,
    ResultDataWithPaginationType, UserQueryParamsType
} from "../../../typings/basic-types";
import {defaultQueryValues} from "../../../internal/utils/default-values/default-query-values";
import {HydratedDocument} from "mongoose";
import {UserDto} from "../../auth-registration/domain/dto";
import {IUserInstanceMethods} from "../../auth-registration/domain/interfaces";
import {UserMeViewModelDto, UserViewModelDto} from "./view-models/dto";
import {UserModel} from "../../auth-registration/domain/user-entity";
import {inject, injectable} from "inversify";

@injectable()
export class UserQueryRepositories {
    constructor(
        @inject(UserModel) private userModel: typeof UserModel
    ) {
    }
    async getAllUsers (query: QueryParamsType<UserQueryParamsType>): Promise<ResultDataWithPaginationType<UserViewModelDto[] | []>> {
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
            const totalCount: number = +getTotalDocument
            const pagesCount: number = Math.ceil(totalCount / pageSize!)
            const skip: number = (pageNumber! - 1) * pageSize!

            const result: HydratedDocument<UserDto, IUserInstanceMethods>[] | [] = await this.userModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(pageSize!)

        return {
            pagesCount: +pagesCount,
            page: +pageNumber!,
            pageSize: +pageSize!,
            totalCount: +totalCount,
            items: result.map((item: HydratedDocument<UserDto, IUserInstanceMethods>) => {
                return {
                    id: item._id.toString(),
                    login: item.login,
                    email: item.email,
                    createdAt: item.createdAt
                }
            })
        }
    }

    async getUserByIdAuthMe (id: string): Promise<UserMeViewModelDto | null> {
        const result: HydratedDocument<UserDto, IUserInstanceMethods> | null = await this.userModel.findById(id)
        return result ? {
            login: result.login,
            email: result.email,
            userId: result._id.toString()
        } : null

    }

    async getUserById (id: string): Promise<UserViewModelDto | null> {
        const result: HydratedDocument<UserDto, IUserInstanceMethods> | null = await this.userModel.findById(id)
        return result ? {
            id: result._id.toString(),
            login: result.login,
            email: result.email,
            createdAt: result.createdAt
        } : null
    }
}