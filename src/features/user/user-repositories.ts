import {UserModel} from "../../Domain/User/User";
import {DeleteResult} from "mongodb";


export class UserRepositories {
    constructor(
        protected userModel: typeof UserModel
    ) {
    }
    async getUserById (id: string): Promise<InstanceType<typeof UserModel> | null> {
        try {
            return await this.userModel.findById(id)
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async gtUserByEmail (email: string): Promise<InstanceType<typeof UserModel> | null> {
        try {
            return await this.userModel.findOne({email: email})
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async getUserByEmailOrLogin (email: string, login: string, emailOrLogin?: string): Promise<InstanceType<typeof UserModel> | null> {
        try {
            const filter = {
                $or: [
                    {email: emailOrLogin ? emailOrLogin : email},
                    {login: emailOrLogin ? emailOrLogin : login},
                ]
            }

            return await this.userModel.findOne(filter)
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async getUserByConfirmationCode (code: string): Promise<InstanceType<typeof UserModel> | null> {
        try {
            return await this.userModel.findOne({'userConfirm.confirmationCode': code})
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async save (user: InstanceType<typeof UserModel>): Promise<InstanceType<typeof UserModel>> {
        try {
            return await user.save()
        } catch (e: any) {
            throw new Error(e)
        }
    }

    async delete(user: InstanceType<typeof UserModel>): Promise<DeleteResult> {
        try {
            return await user.deleteOne()
        } catch (e: any) {
            throw new Error(e)
        }
    }
}