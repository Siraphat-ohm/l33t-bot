import { 
    GatewayIntentBits,
    Events,
    REST,
    Routes,
    ChatInputCommandInteraction,
    Channel,
    TextChannel,
    Guild
} from "discord.js";

import ExtendedClient from "./class/ExentClient";
import corn from "node-cron";
import PingCommand from "./commands/ping";
import RandCommand from "./commands/rand";
import Command from "./class/Command";
import randomQuestions from "./utils/randomQuetion";
import createEmbed from "./utils/createEmbed";
import channels from "./data/channelIds.json";
import fs from "fs";
import path from "path";

export default class LeetBot {
    private client = new ExtendedClient({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
    })

    constructor(
        private token: string,
        private clientId: string
    ){}

    async start() : Promise<void> {
        try {
            this.eventHandlers();
            this.registerCommands( [
                PingCommand,
                RandCommand
            ])
            await this.client.login( this.token );
            this.cronJob();
        } catch( e ) {
            console.error( e );
        }
    }

    async eventHandlers() {
        this.client.on( Events.ClientReady , () => {
            console.log( "LeetBot logged in!!" );
        } );

        this.client.on( Events.GuildCreate, async ( guild: Guild ) => {
            try {
                console.info( `Bot added to guild ${guild.name}` );

                const channel = guild.channels.cache.find( ch => ch.name === "leetcode" );
                if ( channel ) channels["ids"].push( channel.id.toString() );
                else {
                    const newChannel = await guild.channels.create( { name : "leetcode" } );
                    channels['ids'].push( newChannel.id );
                }

                fs.writeFile( path.join( __dirname, 'data', 'channelIds.json' ),  JSON.stringify( channels ), (e) => {
                    if ( e ) console.error( e );
                } )
            } catch( e ) {

            }
        } )

        this.client.on( Events.InteractionCreate, async( it: ChatInputCommandInteraction ) => {
            try {
                const { commandName } = it;
                if ( commandName === "ping" ) {
                    await PingCommand.execute( it );
                } else if ( commandName == "rand" ) {
                    if ( it.isAutocomplete() ) RandCommand.autocomplete( it )
                    else RandCommand.execute( it )
                }

            } catch (e) {
                console.error( e );
            }
        } )
    }

    async cronJob() {
        corn.schedule("0 0 * * *", async () => {
            try {
                const questions = [
                    randomQuestions( { difficulty: "Easy" } )[0],
                    randomQuestions( { difficulty: "Medium" } )[0],
                    randomQuestions( { difficulty: "Hard" } )[0],
                ];
                const embeds = questions.map( q => createEmbed( q ) );
                for (const channelId of channels['ids']) {
                    const channel: Channel = await this.client.channels.fetch(channelId);

                    if (channel.isTextBased()) {
                        const textChannel = channel as TextChannel;
                        const messages = await textChannel.messages.fetch();
                        
                        if (messages.size > 0) {
                            for (const message of messages.values()) {
                                await message.delete();
                            }
                        }
                        await textChannel.send({ embeds });
                    }
                }
            } catch (e) {
                console.error(e);
            }
        });
    }


    async registerCommands( commands : Command[] ) {
        const rest = new REST().setToken( this.token );

        for ( const command of commands ) {
            this.client.commands.set( command.data.name, command )
        }

        ( async () => {
            try {

            console.log( `Started refreshing ${ commands.length } application (/) commands.` );

            const data: any = await rest.put(
                Routes.applicationCommands( this.clientId ),
                { body: commands.map( cm => cm.data.toJSON() ) }
            )
            console.log( `Sucessfully reloaded ${data.length}` )

            } catch ( e ) {
                console.error( e );
            }
        })();

    }
}
