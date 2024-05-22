import { SlashCommandBuilder } from "discord.js";
import Command from "../class/Command";

export default new Command( {
    data: new SlashCommandBuilder()
                .setName( "ping" )
                .setDescription( "Replies with Pong!" ),
    async execute ( it ) {
        await it.reply( "Pong!" );
    }
});
