import { genSaltAndHash } from "../Applications/Encrypted /encrypted";
import { PaginationType, errorsApiFieldsType } from "../Applications/Types/Types";
import { UserInputModel, UserOutputType } from "../Applications/Types/UserTypes/UserTypes";
import { UserOutputMap } from "../Applications/Utils/map/UserMap";
import { UserQueryRepo } from "../Repositories/UserRepo/UserQueryRepo";
import { UserRepo } from "../Repositories/UserRepo/UserRepo";
import { SETTINGS } from "../settings";
import { SaveError } from "./ErrorService/ErrorService";
import { Response } from  '../Applications/Utils/Response'



export const UserService = {
    async CreateUser (data: UserInputModel): Promise<UserOutputType> {
        try {
            const checkUserEmailAndLogin = await UserQueryRepo.GetUserByLoginOrEmail(data.login, data.email)
            const errors: errorsApiFieldsType = {errorsMessages: []};            
            if (checkUserEmailAndLogin) {
                data.login === checkUserEmailAndLogin.login ? errors.errorsMessages.push({message: 'Not unique login', field: 'login'}) : false
                data.email === checkUserEmailAndLogin.email ? errors.errorsMessages.push({message: 'Not unique email', field: 'email'}) : false
                return {
                    status: 400,
                    data: errors
                }
            }

            const genPass = await genSaltAndHash(data.password)
            const CreateData = {...data, password: genPass, createdAt: new Date().toISOString()}
            const result = await UserRepo.CreateUser(CreateData)
            return {
                status: 200,
                data: await UserOutputMap(CreateData, result.insertedId)    
            }
        } catch (e: any) {
            SaveError(SETTINGS.PATH.USER, 'POST', 'Creating a user', e)
            return Response.E500New
        }
    },

    async DeleteUser (id: string): Promise<UserOutputType>  {
        try {
            const result = await UserRepo.DeleteUser(id)
            return result.deletedCount > 0 ? Response.S204New : Response.E404New
        } catch (e) {
            SaveError(SETTINGS.PATH.USER, 'DELETE', 'Deleting a user', e)
            return Response.E500New
        }
    },

    async CreatePagination (page: number, pageSize: number, filter: Object): Promise<PaginationType> {
        try {
            const getTotalCount = await UserQueryRepo.GetCountUsers(filter)
            const totalCount = +getTotalCount 
            const pagesCount = Math.ceil(totalCount / pageSize)
            const skip = (page - 1) * pageSize
            return {
                totalCount: totalCount,
                pagesCount: +pagesCount,
                skip: +skip,
                pageSize: +pageSize,
                page: +page
            }
        } catch (e: any) {
            throw new Error (e)
        }
    }
}