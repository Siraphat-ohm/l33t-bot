import dotenv from "dotenv";
import LeetBot from "./bot";
import cron from "node-cron";
import { exec } from "child_process";
import Logger from "./utils/logger";
import fs from "fs";

dotenv.config();

const TOKEN = process.env.TOKEN || "";
const CLIENT_ID = process.env.CLIENT_ID || "";

const app = new LeetBot( TOKEN, CLIENT_ID );
app.start();

cron.schedule( "0 0 */7 * *", async() => {
    try {
        exec( "sh query.sh", (err, stdout, stderr ) => {
            if ( err ) console.error( stdout + err );
            fs.writeFileSync( "src/data/problems.json.json", stdout );
            Logger.success( "Sync problems" );
        } );
    } catch (e) {
        console.error( e );
    }
});
