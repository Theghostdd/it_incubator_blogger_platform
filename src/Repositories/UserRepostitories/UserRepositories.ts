import {UserViewMongoType} from "../../Applications/Types-Models/User/UserTypes"
import {RegistrationCreatType} from "../../Applications/Types-Models/Registration/RegistrationTypes"
import {UserModel} from "../../Domain/User/User";






export const UserRepositories = {
    /*
    * Create the user data into the DB.
    * Returns the result of the insertion operation.
    * If an error occurs during the insertion, the method throws an error to be handled by the calling code.
    */ 
    async CreateUser (data: RegistrationCreatType): Promise<UserViewMongoType> {
        try {
            return await new UserModel(data).save()
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Get user from the DB by id.
    * Returns the found document, or null if no document matches the filter.
    * Catch some error and return new error if process has some error.
    */
    async GetUserById (id: string): Promise<UserViewMongoType | null> {
        try {
            return await UserModel.findById(id)
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Get user from the DB by email or login.
    * Returns the found document, or null if no document matches the filter.
    * Catch some error and return new error if process has some error.
    */
    async GetUserByEmailOrLogin (email: string, login: string, emailOrLogin?: string): Promise<UserViewMongoType | null> {
        try {
            const filter = {
                $or: [
                    {email: emailOrLogin ? emailOrLogin : email},
                    {login: emailOrLogin ? emailOrLogin : login},
                ]
            }

            return await UserModel.findOne(filter)
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Get user from the DB by email.
    * Returns the found document, or null if no document matches the filter.
    * Catch some error and return new error if process has some error.
    */
    async GetUserByEmail (email: string): Promise<UserViewMongoType | null> {
        try {
            return await UserModel.findOne({email: email})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Get user from the DB by confirmation code.
    * Returns the found document, or null if no document matches the filter.
    * Catch some error and return new error if process has some error.
    */
    async GetUserByConfirmationCode (code: string): Promise<UserViewMongoType | null> {
        try {
            return await UserModel.findOne({'userConfirm.confirmationCode': code})
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Update confirmation user`s code and date expire code by userId in the DB.
    * Returns the result of operation.
    * Catch some error and return new error if process has some error.
    */
    async UpdateUserConfirmationCodeAndDateById(id: string, code: string, expAt: string): Promise<UserViewMongoType | null> {
        try {
            const User = new UserModel(await this.GetUserById(id))
            User.userConfirm.confirmationCode = code
            User.userConfirm.dataExpire = expAt
            return await User.save()
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Update confirmation user`s status by userId in the DB.
    * Returns the result of operation.
    * Catch some error and return new error if process has some error.
    */
    async UpdateUserConfirmationStatusById(id: string, status: boolean): Promise<UserViewMongoType | null> {
        try {
            const User = new UserModel(await this.GetUserById(id))
            User.userConfirm.ifConfirm = status
            return await User.save()
        } catch (e: any) {
            throw new Error(e)
        }
    },
    /*
    * Search and delete a user by ID.
    * Returns the result of operation.
    * Catch some error and return new error if process has some error.
    */
    async DeleteUserById(id: string): Promise<UserViewMongoType | null> {
        try {
            return await UserModel.findByIdAndDelete(id)
        } catch (e: any) {
            throw new Error(e)
        }
    }
}