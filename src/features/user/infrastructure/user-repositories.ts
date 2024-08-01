import {DeleteResult} from "mongodb";
import {inject, injectable} from "inversify";
import {HydratedDocument} from "mongoose";
import {UserDto} from "../../auth-registration/domain/dto";
import {IUserInstanceMethods} from "../../auth-registration/domain/interfaces";
import {UserModel} from "../../auth-registration/domain/user-entity";



@injectable()
export class UserRepositories {
    constructor(
        @inject(UserModel) private userModel: typeof UserModel
    ) {}

    async save(user: HydratedDocument<UserDto, IUserInstanceMethods>): Promise<void> {
        await user.save()
    }

    async delete(user: HydratedDocument<UserDto, IUserInstanceMethods>): Promise<boolean> {
        const result: DeleteResult = await user.deleteOne()
        if (result.deletedCount < 1) {
            throw new Error('Something went wrong')
        }
        return true
    }

    async getUserById(id: string): Promise<HydratedDocument<UserDto, IUserInstanceMethods> | null> {
        return this.userModel.findById(id)
    }

    async getUserByEmail(email: string): Promise<HydratedDocument<UserDto, IUserInstanceMethods> | null> {
        return this.userModel.findOne({email: email})
    }

    async getUserByEmailOrLogin(email: string, login: string, emailOrLogin?: string): Promise<HydratedDocument<UserDto, IUserInstanceMethods> | null> {
        const filter = {
            $or: [
                {email: emailOrLogin ? emailOrLogin : email},
                {login: emailOrLogin ? emailOrLogin : login},
            ]
        }

        return this.userModel.findOne(filter)
    }

    async getUserByConfirmationCode(code: string): Promise<HydratedDocument<UserDto, IUserInstanceMethods> | null> {
        return this.userModel.findOne({'userConfirm.confirmationCode': code})
    }


}