import { MongoClient, ServerApiVersion } from "mongodb";
import { SETTINGS } from "../../settings"; 

export const client = new MongoClient(SETTINGS.MONGO.URL_CLOUD, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export const db = client.db(SETTINGS.MONGO.DB_NAME)
export async function startDB() {
    try {
        await client.connect()
        console.log("Connect to DB")
    } catch {
        console.log("Connection is lost")
        await client.close()
    }
}