import {readFile, readdir} from 'fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';

const sleep = (ms) =>new Promise ((resolve) => setTimeout(resolve, ms));

export async function dbmigrations(fastify){
    const __dirname = fileURLToPath(new URL('.', import.meta.url));
    const dirPath = join(__dirname, '/migrations');
    const maxRetries = process.env.DB_MAX_RETRIES;
    let currentRetries = 0;
    let client;

while(currentRetries < maxRetries)
    {
        try{
            client = await fastify.pg.connect();
        }catch(connError){
            console.log(`Conection failed (Attempt ${currentRetries}/${maxRetries})`);
            currentRetries++;
            await sleep(3000);
            continue;
        }        
        try{
            const files = await readdir(dirPath);
            for (const file of files){
                const sqlStatment = await readFile(join(dirPath,file),'utf8');
                await client.query(sqlStatment);
            }
            client.release();
            return;
        }catch(error){
            if(client)
                client.release();
            console.log(`Migration failed in: ${error.message}`);
            currentRetries++;
        }
    }
    throw new Error("Could not connect to the database after multiple attempts.");
}
