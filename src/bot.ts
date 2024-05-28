import { 
    GatewayIntentBits,
    Events,
    REST,
    Routes,
    ChatInputCommandInteraction,
    Channel,
    TextChannel,
    Guild,
    PermissionsBitField,
    ActivityType
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
import Logger from "./utils/logger";

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
            Logger.error( JSON.stringify( e ) );
        }
    }

    async eventHandlers() {
        this.client.on( Events.ClientReady , () => {
            this.client.user?.setStatus( "dnd" );
            this.client.user?.setActivity({
                name: "leetcode",
                type: ActivityType.Playing
            });
            Logger.success( "LeetBot logged in!!" );
        } );

        this.client.on( Events.GuildCreate, async ( guild: Guild ) => {
            try {
                Logger.info( `Bot added to guild ${guild.name}` );

                const channel = guild.channels.cache.find( ch => ch.name === "leetcode" );
                if ( channel ) channels["ids"].push( channel.id.toString() );
                else {
                    const newChannel = await guild.channels.create({
                        name : "leetcode",
                        permissionOverwrites: [
                            { 
                                id: guild.roles.everyone.id,
                                deny: [ PermissionsBitField.Flags.SendMessages ]
                            },
                            {
                                id: this.client?.user?.id || '',
                                allow: [ PermissionsBitField.Flags.SendMessages ]
                            }
                        ]
                    });
                    channels['ids'].push( newChannel.id );
                }

                fs.writeFile( path.join( __dirname, 'data', 'channelIds.json' ),  JSON.stringify( channels ), (e) => {
                    if ( e ) Logger.error( JSON.stringify( e ) );
                } )
            } catch( e ) {
                Logger.error( JSON.stringify( e ) );
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
                Logger.error( JSON.stringify( e ) );
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
                Logger.error( JSON.stringify( e ) );
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

            Logger.info( `Started refreshing ${ commands.length } application (/) commands.` );

            const data: any = await rest.put(
                Routes.applicationCommands( this.clientId ),
                { body: commands.map( cm => cm.data.toJSON() ) }
            )
            Logger.info( `Sucessfully reloaded ${data.length}` )

            } catch ( e ) {
                Logger.error( JSON.stringify( e ) );
            }
        })();

    }
}
