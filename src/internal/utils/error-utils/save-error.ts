import fs from 'fs'

export async function saveError (endpoint: string, method: string, logic: string, error: any) {
    fs.appendFileSync('log.txt', `${endpoint} - Method: ${method}, Logic: ${logic}, Date: ${new Date().toISOString()} - ${error.toString()}\n`);
}


