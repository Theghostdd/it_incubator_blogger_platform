import { MongoClient, ServerApiVersion } from "mongodb";
import { MONGO_SETTINGS } from "../../settings"; 
import { SaveError } from "../../Utils/error-utils/save-error";

// Connect MongoDb 
export const client = new MongoClient(MONGO_SETTINGS.URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export const db = client.db(MONGO_SETTINGS.DB_NAME)
export async function startDB() {
    try {
        await client.connect()
        console.log("Connect to DB")
    } catch (e: any) {
        SaveError('/connect-to-db', 'CONNECT DB', 'Connecting to the database', e)
        console.log("DB connection error")
        await client.close()
    }
}