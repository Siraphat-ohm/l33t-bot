import { 
    AutocompleteInteraction, 
    CommandInteraction, 
    SlashCommandBuilder, 
    SlashCommandOptionsOnlyBuilder,
} from "discord.js";

interface Options {
    data : SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
    execute : ( it : CommandInteraction ) => Promise<void>
    autocomplete? : ( it : AutocompleteInteraction ) => Promise<void>
}

export default class Command {
    public data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
    public execute : ( it: CommandInteraction ) => Promise<void>
    public autocomplete? : ( it: AutocompleteInteraction ) => Promise<void>

    constructor( options: Options ) {
        Object.assign( this , options);
    }
}
