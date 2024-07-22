import { MONGO_SETTINGS } from "../../settings";
import { SaveError } from "../../Utils/error-utils/save-error";
import * as mongoose from "mongoose";


export async function startDB() {
    try {
        await mongoose.connect(MONGO_SETTINGS.URL_CLOUD, {dbName: MONGO_SETTINGS.DB_NAME})
        console.log("Connect to DB")
    } catch (e: any) {
        await SaveError('/connect-to-db', 'CONNECT DB', 'Connecting to the database', e)
        console.log("DB connection error")
        await mongoose.disconnect()
    }
}