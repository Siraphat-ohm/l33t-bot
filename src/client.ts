import { Client, GatewayIntentBits } from 'discord.js';
import { REST, Routes } from 'discord.js';
import { CLIENT_ID, TOKEN } from './utils/constants';
import commands from './commands';
import Logger from './utils/logger';

const registerCommands = async (clientId: string, token: string) => {
    const rest = new REST({ version: '10' }).setToken(token);

    try {
        (async () => {
            await rest.put(

                Routes.applicationCommands( clientId ),
                { body: Object.values(commands).map( command => command.data ) }
            );
        }
        )();

        for (const command of Object.values(commands)) {
            Logger.success(`Command ${command.data.name} registered`);
        }
    } catch (e) {
        Logger.error( JSON.stringify(e) );
    }
}

const createClient = () => {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
        ],
    });

    registerCommands(CLIENT_ID, TOKEN);

    return client;
}

export default createClient;