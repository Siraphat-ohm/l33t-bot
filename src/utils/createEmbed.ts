import {ColorResolvable, EmbedBuilder} from "discord.js";

const createEmbed = (
    {
        title,
        difficulty,
        topicTags,
        paidOnly,
        acRate
    }: {
        title: string,
        difficulty: string,
        topicTags: { name: string }[],
        paidOnly: boolean,
        acRate: number
    },
) =>  {

const colors = {
    'Easy': '#00FF00',
    'Medium': '#FFFF00',
    'Hard': '#FF0000'
}

return new EmbedBuilder()
                .setColor( colors[difficulty] )
                .setTitle( title )
                .setURL( `https://leetcode.com/problems/${title.replace( /\s/g, '-' ).toLowerCase()}`)
                .addFields( [
                    { name: 'Difficulty', value: difficulty },
                    { name: 'Topic', value: topicTags.length > 0 ? topicTags.map( tag => tag.name ).join( ', ' ) : "unknow" } ,
                    { name: 'Premium', value: paidOnly ? 'Yes' : 'No', inline: true },
                    { name: 'Acceptance Rate', value: `${acRate.toFixed(2)}%` }
                ] )
                .setTimestamp()
}
export default createEmbed;
