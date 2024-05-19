import createClient from "./client";
import { TOKEN } from "./utils/constants";
import commands from "./commands";
import Logger from "./utils/logger";
import cron from 'node-cron';
import createEmbed from "./utils/createEmbed";
import randomQuestion from "./utils/randomQuetion";
import channels from "./data/channelIds.json"
import fs from 'fs';
import path from 'path';

const client = createClient();

client.on('ready', async() => Logger.info(`Bot is realdy :D`) );

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    try {
        if ( !interaction.isChatInputCommand() ) return;
        if ( commandName === "ping" ) {
            await interaction.reply( "Fork U!!" )
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});


client.on( 'guildCreate', async (guild) => {
    Logger.info(`Bot added to guild: ${guild.name}`);

    const channel = guild.channels.cache.find( channel => channel.name === "leetcode");
    if ( channel ) {
        channels['ids'].push( channel.id.toString() as never );
    } else {
        const newChannel = await guild.channels.create( {
            name: "leetcode",
        } )
        channels['ids'].push( newChannel.id as never );
    }

    fs.writeFile( path.join( __dirname, 'data', 'channelIds.json' ), JSON.stringify( channels ), (err) => {
        if ( err ) {
            Logger.error( JSON.stringify( err ) );
        }
    });

    Logger.info(`Channel added to channelIds.json`);
});

cron.schedule('0 0 * * *', async () => {
    try {
        const questions = randomQuestion( "Easy" );
        const embeds = questions.map( q => createEmbed( q ) );

        for (const channelId of channels['ids']) {
            
            const channel = await client.channels.fetch(channelId)
            const messages = await ( channel as any).messages.fetch();
            if ( messages.size > 0 ) {
                for (const message of messages.values()) {
                    await message.delete();
                }
            }
            await (  channel as any).send( { embeds: embeds } ); // Don't trust LSP. trust me
        }
    } catch (error) {
        Logger.error( JSON.stringify( error ));
    }
});


client.login(TOKEN);
