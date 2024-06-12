import { MongoClient, ServerApiVersion } from "mongodb";
import { SETTINGS } from "../../settings"; 
import fs from 'fs'
import { SaveError } from "../../Service/ErrorService/ErrorService";

// Connect MongoDb 
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
    } catch (e: any) {
        SaveError('/connect-to-db', 'CONNECT DB', 'Connecting to the database', e)
        console.log("DB connection error")
        await client.close()
    }
}