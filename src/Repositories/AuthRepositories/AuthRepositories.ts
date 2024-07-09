import { db } from "../../Applications/ConnectionDB/Connection"
import { TokenBlackListMongoViewType, TokenInputModelType } from "../../Applications/Types-Models/Auth/AuthTypes"
import { CreatedMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { MONGO_SETTINGS } from "../../settings"


export const AuthRepositories = {
    /*
    * 1. Searches for the provided token in the black list in the database.
    *    - If a matching token is found, returns the token data (`TokenBlackListMongoViewType`).
    *    - If no matching token is found, returns `null`.
    * 3. Catches any exceptions that occur during the database query and rethrows them as errors.
    */
    async GetTokenBlackList (token: string): Promise<TokenBlackListMongoViewType | null> {
        try {
            return await db.collection<TokenBlackListMongoViewType>(MONGO_SETTINGS.COLLECTIONS.token_black_list).findOne({token: token})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * 1. Adds a token to the black list collection in database.
    * 2. The document includes the token and associated details, encapsulated in `TokenInputModelType`.
    * 3. Returns the result of the insertion, typically containing the inserted document's ID (`CreatedMongoSuccessType`).
    * 4. Catches any exceptions that occur during the database insertion and rethrows them as errors.
    */
    async AddTokenToBlackList (data: TokenInputModelType): Promise<CreatedMongoSuccessType> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.token_black_list).insertOne({...data})
        } catch (e: any) {
            throw new Error(e)
        }
    },
}