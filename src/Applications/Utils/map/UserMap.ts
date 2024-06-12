import { ObjectId } from "mongodb"
import { UserCreateModel, UserViewModel } from "../../Types/UserTypes/UserTypes"


export const UserOutputMap = async (data: UserCreateModel, insertedId: ObjectId): Promise<UserViewModel> => {
    return {
        id: insertedId.toString(),
        login: data.login,
        email: data.email,
        createdAt: data.createdAt
    }
}