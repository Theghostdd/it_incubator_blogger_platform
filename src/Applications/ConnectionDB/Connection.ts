import { MongoClient, ServerApiVersion } from "mongodb";
import { SETTINGS } from "../../settings"; 

const uri = '';

export const client = new MongoClient(SETTINGS.MONGO.URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function startDB() {
    try {
        await client.connect()
        console.log("Connect to DB")
    } catch {
        console.log("Connection is lost")
        await client.close()
    }
}