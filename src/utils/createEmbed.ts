import {ColorResolvable, EmbedBuilder} from "discord.js";


const createEmbed = (
    {
        color,
        title,
        difficulty,
        topicTags,
        paidOnly,
        acceptanceRate
    }: {
        color: ColorResolvable,
        title: string,
        difficulty: string,
        topicTags: { name: string }[],
        paidOnly: boolean,
        acceptanceRate: number
    },
) => new EmbedBuilder()
                .setColor( color )
                .setTitle( title )
                .setURL( `https://leetcode.com/problems/${title.replace( /\s/g, '-' ).toLowerCase()}`)
                .addFields( [
                    { name: 'Difficulty', value: difficulty },
                    { name: 'Topic', value: topicTags.length > 0 ? topicTags.map( tag => tag.name ).join( ', ' ) : "unknow" } ,
                    { name: 'Premium', value: paidOnly ? 'Yes' : 'No', inline: true },
                    { name: 'Acceptance Rate', value: `${acceptanceRate.toFixed(2)}%` }
                ] )
                .setTimestamp()


export default createEmbed;
