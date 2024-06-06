import fs from 'fs'

export async function SaveError (endpoint: string, method: string, logic: string, error: any) {
    const result = await fs.appendFileSync('log.txt', `${endpoint} - Method: ${method}, Logic: ${logic}, Date: ${new Date().toISOString()} - ${error.toString()}\n`);
}


