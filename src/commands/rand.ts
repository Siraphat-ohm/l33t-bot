import { SlashCommandBuilder } from "discord.js";
import Command from "../class/Command";
import getTopics from "../utils/getTopics";
import randomQuestions from "../utils/randomQuetion";
import createEmbed from "../utils/createEmbed";

export default new Command({
    data: new SlashCommandBuilder()
                .setName( "rand" )
                .setDescription( "Random leetcode questions." )
                .addStringOption( opt => opt
                                        .setName( "difficulty" )
                                        .setDescription( "Select a difficulty questions." )
                                        .addChoices( 
                                                    { name: "Easy", value: "Easy" },
                                                    { name: "Medium", value: "Medium" },
                                                    { name: "Hard", value: "Hard" },
                                                    { name: "Mixed", value: "Mixed" }
                                        )
                )
                .addStringOption(opt => opt
                                      .setName('paid')
				                      .setDescription('Is leetcode premium questions ?')
				                      .addChoices(
				                      	{ name: 'No', value: 'n' },
				                      	{ name: 'Yes', value: 'y' },
				                      )
                )
                .addStringOption( opt =>  opt
                                          .setName( "topic" )
                                          .setDescription( "Select a topic." )
                                          .setAutocomplete( true )
                )
                .addNumberOption( opt => opt
                                         .setName( "n" )
                                         .setDescription( "Number of qusetions." )
                                         .setMinValue( 1 )
                                         .setMaxValue( 10 )
                )
    ,
    async execute( it ){
        const difficulty = it.options.get( "difficulty" )?.value as string ?? "Mixed";
        const paid = it.options.get( "paid" )?.value as string ?? "n" 
        const topic = it.options.get( "topic" )?.value as string ?? "" 
        const n = it.options.get( "n" )?.value as number ?? 1 ;

        if ( n > 10  ) {
            console.log( "อย่าเกรียนครับ ขก. แ้ก" );
            it.reply( "อย่าเกรียนครับ ขก. แ้ก" );
            return;
        }

        const questions = randomQuestions( { difficulty, topic, paidOnly: paid === "y" ? true : false, n } );
        
        const embeds = questions.map( q => createEmbed( q ) );
    
        await it.reply( { embeds } );
    },
    async autocomplete( it ){
        const focusedValue = it.options.getFocused();
        const choices = getTopics()
        const filtered = choices.filter( ch => ch.toLowerCase().startsWith( focusedValue.toLowerCase() ) );
        let options: typeof choices;
        if ( filtered.length > 25  ) {
            options = filtered.slice( 0, 25  )
        } else {
            options = filtered
        }
        await it.respond( options.map( ch => ({name: ch, value: ch }) ) )
    }

});
