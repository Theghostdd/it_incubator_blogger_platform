import { ObjectId } from "mongodb"
import { db } from "../../Applications/ConnectionDB/Connection"
import { CreatePaginationType } from "../../Applications/Types-Models/BasicTypes"
import { UserMeModelViewType, UserQueryParamsType, UserViewMongoModelType, UsersViewModelType } from "../../Applications/Types-Models/User/UserTypes"
import { CreateUserPagination } from "../../Utils/pagination/UserPagination"
import { MONGO_SETTINGS } from "../../settings"
import { UserMap } from "../../Utils/map/User/UserMap"


export const UserQueryRepositories = {
    /*
    * 1. Constructs filter criteria to search for users by their login or email using regular expressions.
    *    - The `$or` operator allows matching either the `login` or `email` fields based on the provided search terms.
    * 2. Constructs a sort object to determine the order of the returned users.
    * 3. Calculates pagination details such as the number of documents to skip and the page size.
    * 4. Queries the collection in the database using the constructed filter and sort criteria.
    *    - The `find` method retrieves documents matching the filter.
    *    - The `sort` method orders the documents based on the specified sorting criteria.
    *    - The `skip` method skips a specified number of documents for pagination.
    *    - The `limit` method restricts the number of returned documents to the page size.
    * 5. Maps the retrieved user documents to a view model format.
    * 6. Returns the mapped user view model along with pagination details.
    * 7. Catch some errors and return new Error
    */
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

            return await UserMap.UsersMapperView(result, pagination)
        } catch (e: any) { 
            throw new Error(e)
        }
    },
    /* 
    * 1. Queries the MongoDB collection to find a user document by its ID.
    * 2. Maps the retrieved user document to a structured.
    * 3. Returns the mapped user information if a user document is found, otherwise returns `null`.
    * * 4. If an error occurs during the database query, throw an error with the details.
    */
    async GetUserByIdAuthMe (id: string): Promise<UserMeModelViewType | null> {
        try {
            const result = await db.collection<UserViewMongoModelType>(MONGO_SETTINGS.COLLECTIONS.users).findOne({_id: new ObjectId(id)})
            return result ? await UserMap.UserMapperAuthMeView(result) : null
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /* 
    * 1. Queries the MongoDB collection.
    * 2. Uses the `countDocuments` method to count the number of documents that match the given filter.
    * 3. Returns the count of documents as a number.
    * 4. If an error occurs during the database query, throw an error with the details.
    */
    async GetCountElements (filter: Object): Promise<number> {
        try {
            return await db.collection(MONGO_SETTINGS.COLLECTIONS.users).countDocuments(filter)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}