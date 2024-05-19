import { AutocompleteInteraction, CommandInteraction, SlashCommandBuilder,  SlashCommandOptionsOnlyBuilder } from "discord.js"
import ping  from "./ping"
import rand from "./rand"

interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder ,
    execute: (interaction: CommandInteraction) => Promise<void>,
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>
}

interface Commands {
    [key: string]: Command
}

const commands: Commands = {
    "ping": ping,
    "rand": rand
}

export default commands;
