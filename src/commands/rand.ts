import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, CommandInteractionOption, AutocompleteInteraction } from "discord.js";
import randomQuestion, { Difficulty } from "../utils/randomQuetion";
import getTopics from "../utils/getTopics";
import createEmbed from "../utils/createEmbed";
import Logger from "../utils/logger";

const randomProblem = {
    data: new SlashCommandBuilder()
        .setName('rand')
        .setDescription('Generates a random problem')
        .addStringOption( opton => 
                    opton.setName( 'topic' )
                        .setDescription( 'Topic of the problem' )
                        .setRequired( true )
                        .setAutocomplete( true )
        )
    ,
    async autocomplete( interaction: AutocompleteInteraction ) {
        const choices = getTopics();
        const focusedValue = interaction.options.get( 'topic' )?.value as string;
        const filtered = choices.filter( ch => ch.startsWith(focusedValue) );
        let options = [];
        if ( filtered.length > 25 ) {
            options = filtered.slice( 0, 25 ).map( ( ch ) => ( { name: ch, value: ch } ) );
        } else {
            options = filtered.map( ( ch ) => ( { name: ch, value: ch } ) );
        }
        Logger.info( JSON.stringify( options ))
        await interaction.respond( options )
    }
    ,
    async execute(interaction: CommandInteraction) {
        try {
            const difficulty = interaction.options.get( 'difficulty' )?.value as Difficulty;
            const premium = interaction.options.get( 'premium' )?.value as string;
            const number = interaction.options.get( 'number' )?.value as number;

//            Logger.info( JSON.stringify( { difficulty, premium, topic, number }));
//            const question = randomQuestion( difficulty, topic, premium === "y" ? true : false, number  );
//            Logger.info( JSON.stringify( question ));
//            const embeds = question.map( ( q ) => createEmbed( q ) );
//            await interaction.reply( { embeds } );
        } catch ( error ) {
            Logger.error( JSON.stringify( error )) ;
            await interaction.reply( { content: 'An error occured while generating the problem', ephemeral: true } );
        }
    },
}

export default randomProblem;
