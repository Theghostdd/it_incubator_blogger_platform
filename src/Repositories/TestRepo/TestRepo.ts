import { db } from "../../Applications/ConnectionDB/Connection"
import { Response } from "../../Applications/Utils/Response"
import { SETTINGS } from "../../settings"


export const TestRepo = {
    async DellAllElements (): Promise<any> {
        try {
            const deleteBlogs = await db.collection(SETTINGS.MONGO.COLLECTIONS.blogs).deleteMany({})
            const deletePosts = await db.collection(SETTINGS.MONGO.COLLECTIONS.posts).deleteMany({})
            return Response.S204
        } catch (e) {
            return Response.E400
        }
    }
}