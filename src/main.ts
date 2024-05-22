import dotenv from "dotenv";
import LeetBot from "./bot";

dotenv.config();

const TOKEN = process.env.TOKEN || "";
const CLIENT_ID = process.env.CLIENT_ID || "";

const app = new LeetBot( TOKEN, CLIENT_ID );
app.start();