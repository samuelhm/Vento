import {readFile, readdir} from 'fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';

const sleep = (ms) =>new Promise ((resolve) => setTimeout(resolve, ms));

export async function dbmigrations(fastify){
    const __dirname = fileURLToPath(new URL('.', import.meta.url));
    const dirpath = join(__dirname, '/migrations');
    const maxRetries = process.env.DB_MAX_RETRIES;
    let currentRetries = 0;

    while(currentRetries < maxRetries)
    {
        try{
            const client = await fastify.pg.connect();
            try{
                const files = await readdir(dirpath);
                for (const file of files){                   
                    const sqlstatment = await readFile(join(dirpath,file),'utf8');
                    await client.query(sqlstatment);
                }
            }catch(error){
                if(client)
                    client.release();
                throw new Error(`Migration failed in: ${error.message}`);
            }
            client.release();
            return;
        }
        catch(connError)
        {
            if(connError.message.includes('Migration failed in:'))
                throw ("error");
            console.log(`Conection failed (Attempt ${currentRetries}/${maxRetries})`);
            currentRetries++;
            await sleep(3000); 
        }
    }
    throw new Error("Could not connect to the database after multiple attempts.");
}
