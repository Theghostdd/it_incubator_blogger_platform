import { ObjectId } from "mongodb"
import { UserCreateModel, UserMongoOutputType, UserViewModel } from "../../Types/UserTypes/UserTypes"


export const UserOutputMap = async (data: UserCreateModel, insertedId: ObjectId): Promise<UserViewModel> => {
    return {
        id: insertedId.toString(),
        login: data.login,
        email: data.email,
        createdAt: data.createdAt
    }
}

export const UsersOutputMap = async (data: UserMongoOutputType[]): Promise<UserViewModel[]> => {
    return data.map((user)=> {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    })
}