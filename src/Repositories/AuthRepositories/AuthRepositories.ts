import { db } from "../../Applications/ConnectionDB/Connection"
import { TokenBlackListMongoViewType, TokenInputModelType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { CreatedMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { MONGO_SETTINGS } from "../../settings"


export const AuthRepositories = {
    async GetTokenBlackList (token: string): Promise<TokenBlackListMongoViewType | null> {
        try {
            return await db.collection<TokenBlackListMongoViewType>(MONGO_SETTINGS.COLLECTIONS.token_black_list).findOne({token: token})
        } catch (e: any) {
            throw new Error(e)
        }
    },

    async AddTokenToBlackList (data: TokenInputModelType): Promise<CreatedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.token_black_list).insertOne({...data})
        } catch (e: any) {
            throw new Error(e)
        }
    },
}